const { promisePool } = require('../config/database');

// @desc    Get all invoices
// @route   GET /api/invoices
exports.getInvoices = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM invoices WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY invoice_date DESC';

    const [invoices] = await promisePool.query(query, params);
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create invoice
// @route   POST /api/invoices
exports.createInvoice = async (req, res) => {
  try {
    const { invoice_number, sales_order_id, customer_name, invoice_date, due_date, total_amount, notes } = req.body;

    const [result] = await promisePool.query(
      `INSERT INTO invoices (invoice_number, sales_order_id, customer_name, invoice_date, due_date, total_amount, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [invoice_number, sales_order_id, customer_name, invoice_date, due_date, total_amount, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Invoice number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
exports.getPayments = async (req, res) => {
  try {
    const { invoice_id } = req.query;
    let query = `
      SELECT p.*, i.invoice_number, u.full_name as created_by_name
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (invoice_id) {
      query += ' AND p.invoice_id = ?';
      params.push(invoice_id);
    }

    query += ' ORDER BY p.payment_date DESC';

    const [payments] = await promisePool.query(query, params);
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create payment
// @route   POST /api/payments
exports.createPayment = async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { invoice_id, payment_date, amount, payment_method, reference_number, notes } = req.body;

    // Insert payment
    const [result] = await connection.query(
      'INSERT INTO payments (invoice_id, payment_date, amount, payment_method, reference_number, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [invoice_id, payment_date, amount, payment_method, reference_number, notes, req.user.id]
    );

    // Update invoice paid amount
    await connection.query(
      'UPDATE invoices SET paid_amount = paid_amount + ? WHERE id = ?',
      [amount, invoice_id]
    );

    // Check if invoice is fully paid
    const [invoices] = await connection.query('SELECT total_amount, paid_amount FROM invoices WHERE id = ?', [invoice_id]);
    if (invoices.length > 0 && invoices[0].paid_amount >= invoices[0].total_amount) {
      await connection.query('UPDATE invoices SET status = ? WHERE id = ?', ['paid', invoice_id]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = `
      SELECT e.*, u.full_name as created_by_name, approver.full_name as approved_by_name
      FROM expenses e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN users approver ON e.approved_by = approver.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND e.category = ?';
      params.push(category);
    }

    query += ' ORDER BY e.expense_date DESC';

    const [expenses] = await promisePool.query(query, params);
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { expense_date, category, description, amount, payment_method, receipt_number } = req.body;

    const [result] = await promisePool.query(
      'INSERT INTO expenses (expense_date, category, description, amount, payment_method, receipt_number, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [expense_date, category, description, amount, payment_method, receipt_number, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense status
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await promisePool.query(
      'UPDATE expenses SET status = ?, approved_by = ? WHERE id = ?',
      [status, req.user.id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
