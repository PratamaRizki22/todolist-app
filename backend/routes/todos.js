const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// Endpoint untuk mendapatkan semua todos
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM todos WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    res.json(rows);
  });
});

// Endpoint untuk menambahkan todo baru
router.post('/', auth, (req, res) => {
  const { text } = req.body;
  db.run('INSERT INTO todos (user_id, text) VALUES (?, ?)', [req.user.id, text], function(err) {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    res.json({ id: this.lastID, user_id: req.user.id, text, completed: false });
  });
});

// Endpoint untuk memperbarui todo
router.put('/:id', auth, (req, res) => {
  const { text, completed } = req.body;
  db.run('UPDATE todos SET text = ?, completed = ? WHERE id = ? AND user_id = ?', [text, completed, req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    res.json({ msg: 'Todo updated' });
  });
});

// Endpoint untuk menghapus todo
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
    res.json({ msg: 'Todo deleted' });
  });
});

module.exports = router;
