FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9999

CMD ["node", "productsappservice.js"]



