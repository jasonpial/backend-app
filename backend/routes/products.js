const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, getLowStock } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/alerts/low-stock', getLowStock);

router.route('/')
  .get(getProducts)
  .post(authorize('admin', 'inventory'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'inventory'), updateProduct);

module.exports = router;
