const { promisePool } = require('../config/database');

// @desc    Get attendance records
// @route   GET /api/attendance
exports.getAttendance = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, status } = req.query;
    let query = `
      SELECT a.*, e.employee_code, u.full_name 
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ' AND a.employee_id = ?';
      params.push(employee_id);
    }
    if (start_date) {
      query += ' AND a.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND a.date <= ?';
      params.push(end_date);
    }
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.date DESC, a.employee_id';

    const [records] = await promisePool.query(query, params);
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
exports.createAttendance = async (req, res) => {
  try {
    const { employee_id, date, check_in, check_out, status, notes } = req.body;

    const [result] = await promisePool.query(
      'INSERT INTO attendance (employee_id, date, check_in, check_out, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, date, check_in, check_out, status || 'present', notes]
    );

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Attendance already recorded for this date' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
exports.updateAttendance = async (req, res) => {
  try {
    const { check_in, check_out, status, notes } = req.body;

    const [result] = await promisePool.query(
      'UPDATE attendance SET check_in = ?, check_out = ?, status = ?, notes = ? WHERE id = ?',
      [check_in, check_out, status, notes, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
