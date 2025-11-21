const { promisePool } = require('../config/database');

// @desc    Get all sales orders
// @route   GET /api/sales
exports.getSalesOrders = async (req, res) => {
  try {
    const { status, payment_status } = req.query;
    let query = 'SELECT * FROM sales_orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (payment_status) {
      query += ' AND payment_status = ?';
      params.push(payment_status);
    }

    query += ' ORDER BY order_date DESC';

    const [orders] = await promisePool.query(query, params);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single sales order with items
// @route   GET /api/sales/:id
exports.getSalesOrder = async (req, res) => {
  try {
    const [orders] = await promisePool.query('SELECT * FROM sales_orders WHERE id = ?', [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Sales order not found' });
    }

    const [items] = await promisePool.query(
      `SELECT soi.*, p.name as product_name, p.product_code
       FROM sales_order_items soi
       JOIN products p ON soi.product_id = p.id
       WHERE soi.so_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create sales order
// @route   POST /api/sales
exports.createSalesOrder = async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { so_number, customer_name, customer_email, customer_phone, order_date, notes, items } = req.body;

    // Calculate total
    const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    // Insert sales order
    const [soResult] = await connection.query(
      `INSERT INTO sales_orders (so_number, customer_name, customer_email, customer_phone, order_date, total_amount, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [so_number, customer_name, customer_email, customer_phone, order_date, total_amount, notes, req.user.id]
    );

    const so_id = soResult.insertId;

    // Insert items and update stock
    for (const item of items) {
      const total_price = item.quantity * item.unit_price;
      
      await connection.query(
        'INSERT INTO sales_order_items (so_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [so_id, item.product_id, item.quantity, item.unit_price, total_price]
      );

      // Update stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      // Create stock transaction
      await connection.query(
        'INSERT INTO stock_transactions (product_id, transaction_type, quantity, reference_type, reference_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [item.product_id, 'sale', item.quantity, 'sales_order', so_id, req.user.id]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Sales order created successfully',
      data: { id: so_id, so_number, total_amount }
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Sales order number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Update sales order status
// @route   PUT /api/sales/:id
exports.updateSalesOrder = async (req, res) => {
  try {
    const { status, payment_status } = req.body;

    const [result] = await promisePool.query(
      'UPDATE sales_orders SET status = ?, payment_status = ? WHERE id = ?',
      [status, payment_status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sales order not found' });
    }

    res.json({ success: true, message: 'Sales order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
