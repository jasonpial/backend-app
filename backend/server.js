require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());

// CORS for frontend
app.use(cors({
  origin: [
    "http://localhost:3000",           // local React
    "https://dbroft-app.vercel.app"    // your Vercel frontend (fixed)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ==== ROUTES ====

// Auth
app.use('/api/auth', require('./routes/authRoutes'));

// Employees
app.use('/api/employees', require('./routes/employeeRoutes'));

// Attendance
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Leave
app.use('/api/leaves', require('./routes/leaveRoutes'));

// Payroll
app.use('/api/payroll', require('./routes/payrollRoutes'));

// Products
app.use('/api/products', require('./routes/productRoutes'));

// Purchase
app.use('/api/purchase', require('./routes/purchaseRoutes'));

// Sales
app.use('/api/sales', require('./routes/salesRoutes'));

// Finance
app.use('/api/finance', require('./routes/financeRoutes'));

// Analytics
app.use('/api/analytics', require('./routes/analyticsRoutes'));


// Health Check (Important for Render)
app.get("/", (req, res) => {
  res.send("Backend is running on Render!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
