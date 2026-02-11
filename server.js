const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

const usersFile = "users.json";

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));
  
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send("Account created ✅ <br><a href='/'>Back</a>");
});

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

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
