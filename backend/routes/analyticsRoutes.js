const express = require('express');
const router = express.Router();
const { getDashboard, getSalesAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/sales', getSalesAnalytics);

module.exports = router;
