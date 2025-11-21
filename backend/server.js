require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

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
