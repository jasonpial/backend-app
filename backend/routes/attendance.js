const express = require('express');
const router = express.Router();
const { getAttendance, createAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(authorize('admin', 'hr'), createAttendance);

router.route('/:id')
  .put(authorize('admin', 'hr'), updateAttendance);

module.exports = router;
