import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from "express";
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import {makeExecutableSchema} from '@graphql-tools/schema'
import {typeDefs} from './productsappserviceschema.js'
import data from './dummy_data.js'
import {PubSub} from 'graphql-subscriptions'

const app = express();
const httpServer = createServer(app);
const pubSub = new PubSub();

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const PRODUCT_INFO_UPDATED = "PRODUCT_INFO_UPDATED" 

const resolvers =  {
    Query: {
        products(){
            console.log(`All Products query`)
            return data.products
        },
        reviews(){
            console.log(`All Reviews query`)
            return data.reviews
        },
        sales(){
            console.log(`All Sales query`)
            return data.sales
        },
        product(_, args) {
            console.log(`Single Product query for Id:${args.id}`)
            return data.products.find((product) => product.id === args.id)
        },
        review(_, args) {
            console.log(`Single Review query for Id:${args.id}`)
            return data.reviews.find((review) => review.id === args.id)
        },
        sale(_, args) {
            console.log(`Single Sale query for Id:${args.id}`)
            return data.sales.find((sale) => sale.id === args.id)
        }
    },
    Product: {
        avg_rating(parent) {
            const reviewsForTheProduct = data.reviews.filter((r) => r.product_id === parent.id)
            const sum = reviewsForTheProduct.reduce(function (result, item) {
                return result + item.rating;
            }, 0);
            return Math.round(sum/reviewsForTheProduct.length);
        },
        total_sales(parent) {
            return data.sales.filter((s) => s.product_id === parent.id && s.returned === false).length;
        }
    },
    Review: {
        product(parent) {
          return data.products.find((p) => p.id === parent.product_id)
        }
    },
    Sale: {
        product(parent) {
          return data.products.find((p) => p.id === parent.product_id)
        }
    },
    Mutation: {
      addReview(_, args) {
        let review = {
            id: Math.floor(Math.random() * 1000).toString(),
            rating: args.rating,
            product_id: args.product_id 
        }
        data.reviews.push(review)
        pubSub.publish(PRODUCT_INFO_UPDATED,{productInfoUpdated:data.products.find((p) => p.id === args.product_id)})
        console.log(`Add Review: publish done:${args.product_id}`)
        let prodc= data.products.find((p) => p.id === args.product_id)
        console.log(`Add Review Product Returned id:${prodc.id}, title:${prodc.title}, price:${prodc.price} `)
        return review
      },
      addSale(_, args) {
        let sale = {
            id: Math.floor(Math.random() * 10000).toString(),
            returned: false,
            product_id: args.product_id
        }
        data.sales.push(sale)
        pubSub.publish(PRODUCT_INFO_UPDATED,{productInfoUpdated:data.products.find((p) => p.id === args.product_id)})
        console.log(`Add Sales: publish done:${args.product_id}`)
        let prodc= data.products.find((p) => p.id === args.product_id)
        console.log(`Add Sales Product Returned id:${prodc.id}, title:${prodc.title}, price:${prodc.price} `)
        return sale
      },
      addReturn(_, args) {
        let sale = data.sales.find((sale) => sale.id === args.id);
        sale.returned=true
        pubSub.publish(PRODUCT_INFO_UPDATED,{productInfoUpdated:data.products.find((p) => p.id === sale.product_id)})
        console.log(`Return: publish done:${sale.product_id}`)
        let prodc= data.products.find((p) => p.id === sale.product_id)
        console.log(`Return Sale Product Returned id:${prodc.id}, title:${prodc.title}, price:${prodc.price} `)
        return sale
      }
    },
    Subscription: {
        productInfoUpdated: {
             subscribe:()=>pubSub.asyncIterator(PRODUCT_INFO_UPDATED)
        }
    }
}

const schema = makeExecutableSchema({typeDefs,resolvers})

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);
 
// create apollo server
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
 
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
 
await apolloServer.start();
apolloServer.applyMiddleware({ app });
 
httpServer.listen(9999);

export default apolloServer;

