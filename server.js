const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = 'users.json';

// Helper: Load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data || '[]');
}

// Helper: Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register Route
app.post('/api/users/register', (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = loadUsers();
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ email, phone, password });
  saveUsers(users);

  res.json({ message: 'Registration successful!' });
});

// Login Route
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
