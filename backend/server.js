require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const bcrypt = require('bcryptjs');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


// Allow frontend domain from Vercel
app.use(cors({
  origin: ["https://your-frontend.vercel.app"],   // replace with your URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Import routes
const routes = require("./routes");
app.use("/api", routes);

// Health endpoint for Render
app.get("/", (req, res) => {
  res.send("Backend is running on Render!");
});

const PORT = process.env.PORT || 10000; // Render sets its own port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
