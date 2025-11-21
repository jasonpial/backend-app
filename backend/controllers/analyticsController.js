const { promisePool } = require('../config/database');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const analytics = {};

    // Employee stats
    const [employees] = await promisePool.query('SELECT COUNT(*) as total, status FROM employees GROUP BY status');
    analytics.employees = employees;

    // Inventory stats
    const [inventory] = await promisePool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(stock_quantity * cost_price) as total_value,
        COUNT(CASE WHEN stock_quantity <= min_stock_level THEN 1 END) as low_stock_count
      FROM products WHERE status = 'active'
    `);
    analytics.inventory = inventory[0];

    // Sales stats (current month)
    const [sales] = await promisePool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value
      FROM sales_orders 
      WHERE MONTH(order_date) = MONTH(CURRENT_DATE()) 
      AND YEAR(order_date) = YEAR(CURRENT_DATE())
    `);
    analytics.sales = sales[0];

    // Finance stats (current month)
    const [finance] = await promisePool.query(`
      SELECT 
        (SELECT COALESCE(SUM(paid_amount), 0) FROM invoices WHERE MONTH(invoice_date) = MONTH(CURRENT_DATE())) as total_income,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE status = 'approved' AND MONTH(expense_date) = MONTH(CURRENT_DATE())) as total_expenses
    `);
    analytics.finance = finance[0];
    analytics.finance.profit = analytics.finance.total_income - analytics.finance.total_expenses;

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [monthlySales] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(order_date, '%Y-%m') as month,
        COUNT(*) as order_count,
        SUM(total_amount) as total_revenue
      FROM sales_orders
      WHERE order_date BETWEEN ? AND ?
      GROUP BY month
      ORDER BY month
    `, [start_date || '2024-01-01', end_date || '2025-12-31']);

    res.json({ success: true, data: { monthlySales } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
