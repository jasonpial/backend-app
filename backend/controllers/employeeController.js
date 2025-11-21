const { promisePool } = require('../config/database');

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const { status, department } = req.query;
    let query = `
      SELECT e.*, u.username, u.email, u.full_name 
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND e.department = ?';
      params.push(department);
    }

    query += ' ORDER BY e.created_at DESC';

    const [employees] = await promisePool.query(query, params);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployee = async (req, res) => {
  try {
    const [employees] = await promisePool.query(
      `SELECT e.*, u.username, u.email, u.full_name 
       FROM employees e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employees[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create employee
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { user_id, employee_code, department, designation, date_of_joining, salary, phone, address, emergency_contact } = req.body;

    const [result] = await promisePool.query(
      `INSERT INTO employees (user_id, employee_code, department, designation, date_of_joining, salary, phone, address, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, employee_code, department, designation, date_of_joining, salary, phone, address, emergency_contact]
    );

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Employee code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const { department, designation, salary, phone, address, emergency_contact, status } = req.body;

    const [result] = await promisePool.query(
      `UPDATE employees SET department = ?, designation = ?, salary = ?, phone = ?, address = ?, emergency_contact = ?, status = ?
       WHERE id = ?`,
      [department, designation, salary, phone, address, emergency_contact, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const [result] = await promisePool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
