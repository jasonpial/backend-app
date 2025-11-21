const express = require('express');
const router = express.Router();
const { 
  getInvoices, createInvoice,
  getPayments, createPayment,
  getExpenses, createExpense, updateExpense
} = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/invoices')
  .get(getInvoices)
  .post(authorize('admin', 'finance'), createInvoice);

router.route('/payments')
  .get(getPayments)
  .post(authorize('admin', 'finance'), createPayment);

router.route('/expenses')
  .get(getExpenses)
  .post(createExpense);

router.put('/expenses/:id', authorize('admin', 'finance', 'manager'), updateExpense);

module.exports = router;
