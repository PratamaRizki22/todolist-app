const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  console.log('Received registration request:', email);
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (row) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ msg: 'Server error' });
        }
        console.log('User registered successfully:', email);
        res.status(201).json({ msg: 'User registered' });
      });
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      res.status(500).json({ msg: 'Server error' });
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', email);
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
    if (!row) {
      console.log('Invalid credentials for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, row.password);
    if (!isMatch) {
      console.log('Invalid credentials for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: row.id,
      },
    };

    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      console.log('Login successful for email:', email);
      res.json({ token });
    });
  });
});

module.exports = router;
