const express = require('express');
const router = express.Router();
const { getSalesOrders, getSalesOrder, createSalesOrder, updateSalesOrder } = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSalesOrders)
  .post(authorize('admin', 'inventory', 'manager'), createSalesOrder);

router.route('/:id')
  .get(getSalesOrder)
  .put(authorize('admin', 'inventory', 'manager'), updateSalesOrder);

module.exports = router;
