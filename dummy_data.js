let products = [
    {id: '1', title: 'MS Office 365 1 Year Subscription', price: '100.35'},
    {id: '2', title: 'Logitech Mouse', price: '25.25' },
    {id: '3', title: 'Logitech Mechenical Keyboard', price: '159.65'},
    {id: '4', title: 'Dell 27 Inch Monitor', price: '248.79'},
    {id: '5', title: 'Apple MacBook 27 Inch', price: '4899'},
    {id: '6', title: 'Apple AirPods Headset', price: '899.77'},
    {id: '7', title: 'Segate HDD', price: '49.99'},
    {id: '8', title: 'Segate HDD-2', price: '64.65'},
  ]
  
  let reviews = [
    {id: '1', rating: 5,  product_id: '5' },
    {id: '2', rating: 4,  product_id: '4' },
    {id: '3', rating: 3,  product_id: '1' },
    {id: '4', rating: 5,  product_id: '3' },
    {id: '5', rating: 2,  product_id: '2' },
    {id: '6', rating: 1,  product_id: '6' },
    {id: '7', rating: 2,  product_id: '7' },
    {id: '8', rating: 5,  product_id: '8' },
    {id: '9', rating: 4,  product_id: '5' },
    {id: '10', rating: 3,  product_id: '1' },
  ]
  
  let sales = [
    {id: '1', returned: false,  product_id: '5' },
    {id: '2', returned: false,  product_id: '4' },
    {id: '3', returned: false,  product_id: '1' },
    {id: '4', returned: false,  product_id: '3' },
    {id: '5', returned: false,  product_id: '2' },
    {id: '6', returned: false,  product_id: '6' },
    {id: '7', returned: false,  product_id: '1' },
    {id: '8', returned: false,  product_id: '7' },
    {id: '9', returned: false,  product_id: '8' },
    {id: '10', returned: false,  product_id: '4' },
  ]
  export default { products, reviews, sales }