const express = require('express');
const mongoose = require('mongoose');
const { Product, User, Comment, Cart, Order } = require('./models');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://suhaibhussain26000:nePdZCOxE7FBWTIF@cluster0.j9fxnxj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define your endpoints here. For example, to create a new user:
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/products', async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post('/comments', async (req, res) => {
    try {
      const newComment = await Comment.create(req.body);
      res.status(201).send(newComment);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  app.post('/comments', async (req, res) => {
    try {
      const newComment = await Comment.create(req.body);
      res.status(201).send(newComment);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  app.post('/cart', async (req, res) => {
    console.log("Received body:", req.body); // Log the complete request body
    const { userId, products } = req.body;

    console.log("Products array:", products); // Specifically log the products array

    if (!Array.isArray(products)) {
        console.log("Products is not an array:", products); // Log what was received that is not an array
        return res.status(400).send({ message: 'Products must be an array' });
    }

    try {
        const userCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $push: { products: { $each: products } } },
            { new: true, upsert: true }
        );
        res.status(201).send(userCart);
    } catch (error) {
        console.error("Error updating cart:", error); // Log the full error message
        res.status(400).send(error);
    }
});

  
  app.post('/orders', async (req, res) => {
    const { userId } = req.body;
    try {
     
      const userCart = await Cart.findOne({ user: userId }).populate('products.product');
      if (!userCart) {
        return res.status(404).send({ message: 'Cart not found' });
      }
      
      const order = await Order.create({
        products: userCart.products,
        user: userId
      });
  
      
      await Cart.findOneAndDelete({ user: userId });
  
      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error);
    }
  });
            
  app.put('/users/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true 
     });
      if (!updatedUser) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  app.delete('/comments/:id', async (req, res) => {
    try {
      const deletedComment = await Comment.findByIdAndRemove(req.params.id);
      if (!deletedComment) {
        return res.status(404).send({ message: 'Comment not found' });
      }
      res.status(204).send(); 
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
