const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1 - Fetch user's cart
    const cartItems = await Cart.find({ user: userId }).populate('product');

    console.log('Cart items found:', cartItems.length);

    // Step 2 - Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Add items before placing order.' });
    }

    // Step 3 - Check if all products exist
    const invalidItems = cartItems.filter(item => !item.product);
    if (invalidItems.length > 0) {
      return res.status(400).json({ message: 'Some products in cart are no longer available.' });
    }

    // Step 4 - Build products array for order
    const orderProducts = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Step 5 - Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    console.log('Total amount:', totalAmount);

    // Step 6 - Create order in DB
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      orderStatus: 'pending',
    });

    // Step 7 - Clear cart after successful order
    await Cart.deleteMany({ user: userId });

    console.log('Order placed successfully:', order._id);

    // Step 8 - Return populated order
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price image');

    res.status(201).json({
      message: 'Order placed successfully!',
      order: populatedOrder,
    });

  } catch (error) {
    console.log('PLACE ORDER ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.log('GET ORDERS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    })
      .populate('user', 'name email')
      .populate('products.product', 'name price image description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);

  } catch (error) {
    console.log('GET SINGLE ORDER ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getUserOrders, getSingleOrder };