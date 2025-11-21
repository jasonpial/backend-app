const { promisePool } = require('../config/database');

// @desc    Get payroll records
// @route   GET /api/payroll
exports.getPayroll = async (req, res) => {
  try {
    const { employee_id, month, status } = req.query;
    let query = `
      SELECT p.*, e.employee_code, u.full_name, e.department
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ' AND p.employee_id = ?';
      params.push(employee_id);
    }
    if (month) {
      query += ' AND p.month = ?';
      params.push(month);
    }
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.month DESC, e.employee_code';

    const [records] = await promisePool.query(query, params);
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create payroll record
// @route   POST /api/payroll
exports.createPayroll = async (req, res) => {
  try {
    const { employee_id, month, basic_salary, allowances, deductions, payment_date } = req.body;
    const net_salary = parseFloat(basic_salary) + parseFloat(allowances || 0) - parseFloat(deductions || 0);

    const [result] = await promisePool.query(
      `INSERT INTO payroll (employee_id, month, basic_salary, allowances, deductions, net_salary, payment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, month, basic_salary, allowances || 0, deductions || 0, net_salary, payment_date]
    );

    res.status(201).json({
      success: true,
      message: 'Payroll record created successfully',
      data: { id: result.insertId, net_salary, ...req.body }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Payroll already exists for this employee and month' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payroll status
// @route   PUT /api/payroll/:id
exports.updatePayroll = async (req, res) => {
  try {
    const { status, payment_date } = req.body;

    const [result] = await promisePool.query(
      'UPDATE payroll SET status = ?, payment_date = ? WHERE id = ?',
      [status, payment_date, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    res.json({ success: true, message: 'Payroll updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
