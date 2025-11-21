const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

// Example test route
app.get("/hello", (req, res) => {
  res.json({ message: "Backend API running on Vercel!" });
});

// Export the serverless handler
module.exports = serverless(app);
