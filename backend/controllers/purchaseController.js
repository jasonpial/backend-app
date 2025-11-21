const { promisePool } = require('../config/database');

// @desc    Get all purchase orders
// @route   GET /api/purchases
exports.getPurchaseOrders = async (req, res) => {
  try {
    const { status, supplier_id } = req.query;
    let query = `
      SELECT po.*, s.name as supplier_name, u.full_name as created_by_name
      FROM purchase_orders po
      JOIN suppliers s ON po.supplier_id = s.id
      LEFT JOIN users u ON po.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND po.status = ?';
      params.push(status);
    }
    if (supplier_id) {
      query += ' AND po.supplier_id = ?';
      params.push(supplier_id);
    }

    query += ' ORDER BY po.order_date DESC';

    const [orders] = await promisePool.query(query, params);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single purchase order with items
// @route   GET /api/purchases/:id
exports.getPurchaseOrder = async (req, res) => {
  try {
    const [orders] = await promisePool.query(
      `SELECT po.*, s.name as supplier_name, s.contact_person, s.phone, s.email
       FROM purchase_orders po
       JOIN suppliers s ON po.supplier_id = s.id
       WHERE po.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    const [items] = await promisePool.query(
      `SELECT poi.*, p.name as product_name, p.product_code
       FROM purchase_order_items poi
       JOIN products p ON poi.product_id = p.id
       WHERE poi.po_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create purchase order
// @route   POST /api/purchases
exports.createPurchaseOrder = async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { po_number, supplier_id, order_date, notes, items } = req.body;

    // Calculate total
    const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    // Insert purchase order
    const [poResult] = await connection.query(
      'INSERT INTO purchase_orders (po_number, supplier_id, order_date, total_amount, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [po_number, supplier_id, order_date, total_amount, notes, req.user.id]
    );

    const po_id = poResult.insertId;

    // Insert items
    for (const item of items) {
      const total_price = item.quantity * item.unit_price;
      await connection.query(
        'INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [po_id, item.product_id, item.quantity, item.unit_price, total_price]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: { id: po_id, po_number, total_amount }
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Purchase order number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Update purchase order status (receive stock)
// @route   PUT /api/purchases/:id/receive
exports.receivePurchaseOrder = async (req, res) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Update PO status
    await connection.query('UPDATE purchase_orders SET status = ? WHERE id = ?', ['received', req.params.id]);

    // Get PO items
    const [items] = await connection.query('SELECT * FROM purchase_order_items WHERE po_id = ?', [req.params.id]);

    // Update stock and create transactions
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      await connection.query(
        'INSERT INTO stock_transactions (product_id, transaction_type, quantity, reference_type, reference_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [item.product_id, 'purchase', item.quantity, 'purchase_order', req.params.id, req.user.id]
      );
    }

    await connection.commit();

    res.json({ success: true, message: 'Purchase order received and stock updated' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
