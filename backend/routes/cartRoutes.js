const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');

router.post('/', protect, addToCart);
router.get('/', protect, getCart);
router.patch('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);

module.exports = router;