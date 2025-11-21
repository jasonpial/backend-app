const { promisePool } = require('../config/database');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY name';

    const [products] = await promisePool.query(query, params);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const [products] = await promisePool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { product_code, name, description, category, unit, cost_price, selling_price, stock_quantity, min_stock_level } = req.body;

    const [result] = await promisePool.query(
      `INSERT INTO products (product_code, name, description, category, unit, cost_price, selling_price, stock_quantity, min_stock_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_code, name, description, category, unit, cost_price, selling_price, stock_quantity || 0, min_stock_level || 10]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Product code already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, unit, cost_price, selling_price, stock_quantity, min_stock_level, status } = req.body;

    const [result] = await promisePool.query(
      `UPDATE products SET name = ?, description = ?, category = ?, unit = ?, cost_price = ?, 
       selling_price = ?, stock_quantity = ?, min_stock_level = ?, status = ? WHERE id = ?`,
      [name, description, category, unit, cost_price, selling_price, stock_quantity, min_stock_level, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/alerts/low-stock
exports.getLowStock = async (req, res) => {
  try {
    const [products] = await promisePool.query(
      'SELECT * FROM products WHERE stock_quantity <= min_stock_level AND status = ? ORDER BY stock_quantity',
      ['active']
    );

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
