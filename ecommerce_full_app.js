
// Importing necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

// Product Schema and Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// Sample product data to insert (this would normally be done manually or through a DB seeder)
const sampleProducts = [
  { name: "Product 1", price: 10, description: "Description 1", image: "image1.jpg" },
  { name: "Product 2", price: 20, description: "Description 2", image: "image2.jpg" },
];

// Uncomment this line if you need to insert products into the database
// Product.insertMany(sampleProducts).then(() => console.log("Sample products inserted"));

// API to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// API to place an order (checkout)
app.post('/api/cart', (req, res) => {
  res.json({ message: 'Order placed successfully!', cart: req.body });
});

// Serve the React app (for simplicity, we are embedding the front-end code)
app.get('/', (req, res) => {
  const reactApp = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-commerce Store</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        h1 { text-align: center; }
        .product { border: 1px solid gray; padding: 10px; margin: 10px; width: 200px; display: inline-block; text-align: center; }
        button { background-color: #28a745; color: white; border: none; padding: 5px 10px; cursor: pointer; }
        button:hover { background-color: #218838; }
        .cart { margin-top: 20px; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const products = ${JSON.stringify(sampleProducts)};
        const cart = [];

        function addToCart(product) {
          cart.push(product);
          alert(product.name + ' added to cart');
        }

        function checkout() {
          alert('Checkout: ' + JSON.stringify(cart));
        }

        const root = document.getElementById('root');
        root.innerHTML = '<h1>E-commerce Store</h1><h2>Products</h2>';

        products.forEach(product => {
          const div = document.createElement('div');
          div.classList.add('product');
          div.innerHTML = \`
            <h3>\${product.name}</h3>
            <p>\${product.description}</p>
            <p>$\${product.price}</p>
            <button onclick="addToCart(product)">Add to Cart</button>
          \`;
          root.appendChild(div);
        });

        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cart');
        cartDiv.innerHTML = '<h2>Cart</h2>';
        root.appendChild(cartDiv);

        const checkoutButton = document.createElement('button');
        checkoutButton.innerHTML = 'Checkout';
        checkoutButton.onclick = checkout;
        cartDiv.appendChild(checkoutButton);
      </script>
    </body>
    </html>
  `;
  res.send(reactApp);
});

// Server running
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
