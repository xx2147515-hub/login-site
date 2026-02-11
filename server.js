const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

// Users file
const usersFile = path.join(__dirname, "users.json");

// Agar users.json bo‘lmasa yaratadi
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

// 🔥 Home route (MUAMMO SHU YERDA EDI)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send("Account created ✅ <br><a href='/'>Back</a>");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));

  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    res.send("Login successful ✅");
  } else {
    res.send("Wrong credentials ❌");
  }
});

// Port (Render uchun muhim)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
