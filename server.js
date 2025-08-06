const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/expenses", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Expense schema
const expenseSchema = new mongoose.Schema({
  text: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model("Expense", expenseSchema);

// Routes

// GET all expenses
app.get("/expenses", async (req, res) => {
  console.log("📥 GET request received");
  try {
    const expenses = await Expense.find();
    console.log("✅ Sending expenses:", expenses);
    res.json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST new expense
app.post("/expenses", async (req, res) => {
  console.log("📥 POST request received:", req.body);
  try {
    const expense = new Expense(req.body);
    await expense.save();
    console.log("✅ Expense saved:", expense);
    res.json(expense);
  } catch (err) {
    console.error("❌ Error saving expense:", err);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

// DELETE expense by ID
app.delete("/expenses/:id", async (req, res) => {
  console.log("🗑️ DELETE request received for ID:", req.params.id);
  try {
    await Expense.findByIdAndDelete(req.params.id);
    console.log("✅ Expense deleted:", req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

// Add after app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`📥 ${req.method} request to ${req.url}`);
  if (req.method === "POST") {
    console.log("🔹 Request Body:", req.body);
  }
  next();
});
