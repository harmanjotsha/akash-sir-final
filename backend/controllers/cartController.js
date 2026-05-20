const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    console.log('productId received:', productId);
    console.log('userId:', userId);

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if productId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    console.log('Product found:', product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = await Cart.findOne({
      user: userId,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      const updated = await Cart
        .findById(existingItem._id)
        .populate('product');
      return res.status(200).json(updated);
    }

    const cartItem = await Cart.create({
      user: userId,
      product: productId,
      quantity: 1,
    });

    const populated = await Cart
      .findById(cartItem._id)
      .populate('product');

    res.status(201).json(populated);

  } catch (error) {
    console.log('ADD TO CART ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart
      .find({ user: userId })
      .populate('product');

    const total = cartItems.reduce((acc, item) => {
      if (item.product) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);

    res.status(200).json({
      cartItems,
      total,
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.log('GET CART ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { action } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid cart item ID' });
    }

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (action === 'increase') {
      cartItem.quantity += 1;
    } else if (action === 'decrease') {
      if (cartItem.quantity === 1) {
        await cartItem.deleteOne();
        return res.status(200).json({ message: 'Item removed from cart' });
      }
      cartItem.quantity -= 1;
    } else {
      return res.status(400).json({
        message: 'Invalid action. Use increase or decrease',
      });
    }

    await cartItem.save();
    const updated = await Cart
      .findById(cartItem._id)
      .populate('product');
    res.status(200).json(updated);

  } catch (error) {
    console.log('UPDATE CART ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid cart item ID' });
    }

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.deleteOne();
    res.status(200).json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.log('REMOVE CART ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };