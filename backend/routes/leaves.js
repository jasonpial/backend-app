const express = require('express');
const router = express.Router();
const { getLeaves, createLeave, updateLeave } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/:id')
  .put(authorize('admin', 'hr', 'manager'), updateLeave);

module.exports = router;
