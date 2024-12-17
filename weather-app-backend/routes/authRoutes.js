const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');  // Your db connection
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).send('Error fetching user');
    if (results.length === 0) return res.status(400).send('User not found');
    
    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Check if username is available
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.json({ available: false });
      }
      res.json({ available: true });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while checking username.' });
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(emailQuery, [email], async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already exists.' });
      }

      // Check if username is taken
      const usernameQuery = 'SELECT * FROM users WHERE username = ?';
      db.query(usernameQuery, [username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          return res.status(409).json({ message: 'Username already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
          if (err) throw err;

          const token = jwt.sign({ id: result.insertId, username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
          });

          res.status(201).json({
            message: 'User registered successfully.',
            token,
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while signing up.' });
  }
});

module.exports = router;
