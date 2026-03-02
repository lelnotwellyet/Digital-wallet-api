const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, "data", "users.json");

// Helper function to read users
const getUsers = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Helper function to save users
const saveUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// 1️⃣ Health Check
app.get("/", (req, res) => {
  res.json({ message: "Digital Wallet API is running 💰" });
});

// 2️⃣ Get All Users
app.get("/api/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

// 3️⃣ Get Single User
app.get("/api/users/:id", (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// 4️⃣ Check Wallet Balance
app.get("/api/users/:id/balance", (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    walletBalance: user.walletBalance
  });
});

// 5️⃣ Add Money (Using Query Parameter)
app.get("/api/users/:id/add", (req, res) => {
  const amount = parseFloat(req.query.amount);
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  user.walletBalance += amount;
  saveUsers(users);

  res.json({
    message: "Money added successfully",
    newBalance: user.walletBalance
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;