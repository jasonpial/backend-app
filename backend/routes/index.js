const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/employees', require('./employeeRoutes'));
router.use('/attendance', require('./attendanceRoutes'));
router.use('/leaves', require('./leaveRoutes'));
router.use('/payroll', require('./payrollRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/purchase', require('./purchaseRoutes'));
router.use('/sales', require('./salesRoutes'));
router.use('/finance', require('./financeRoutes'));
router.use('/analytics', require('./analyticsRoutes'));

module.exports = router;
