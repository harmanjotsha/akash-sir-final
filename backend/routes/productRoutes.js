const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ─── Public Routes ───────────────────────────────
router.get('/', getProducts);
router.get('/low-stock', protect, authorizeRoles('admin'), getLowStockProducts);
router.get('/:id', getProductById);

// ─── Admin Only Routes ────────────────────────────
router.post('/', protect, authorizeRoles('admin'), createProduct);
router.patch('/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;