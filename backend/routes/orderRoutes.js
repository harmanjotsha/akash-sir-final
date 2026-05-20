const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  placeOrder,
  getUserOrders,
  getSingleOrder,
} = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getSingleOrder);

module.exports = router;