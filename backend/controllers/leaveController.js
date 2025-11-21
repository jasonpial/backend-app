const { promisePool } = require('../config/database');

// @desc    Get all leave requests
// @route   GET /api/leaves
exports.getLeaves = async (req, res) => {
  try {
    const { employee_id, status } = req.query;
    let query = `
      SELECT l.*, e.employee_code, u.full_name, approver.full_name as approved_by_name
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN users approver ON l.approved_by = approver.id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ' AND l.employee_id = ?';
      params.push(employee_id);
    }
    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }

    query += ' ORDER BY l.created_at DESC';

    const [leaves] = await promisePool.query(query, params);
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create leave request
// @route   POST /api/leaves
exports.createLeave = async (req, res) => {
  try {
    const { employee_id, leave_type, start_date, end_date, days, reason } = req.body;

    const [result] = await promisePool.query(
      'INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, leave_type, start_date, end_date, days, reason]
    );

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update leave status (approve/reject)
// @route   PUT /api/leaves/:id
exports.updateLeave = async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await promisePool.query(
      'UPDATE leaves SET status = ?, approved_by = ? WHERE id = ?',
      [status, req.user.id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    res.json({ success: true, message: `Leave request ${status} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
