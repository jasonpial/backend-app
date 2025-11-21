const express = require('express');
const router = express.Router();
const { getPayroll, createPayroll, updatePayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'hr', 'finance'));

router.route('/')
  .get(getPayroll)
  .post(createPayroll);

router.route('/:id')
  .put(updatePayroll);

module.exports = router;
