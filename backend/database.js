const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Tentukan lokasi penyimpanan database di luar folder backend
const dbPath = path.resolve(__dirname, '../data/todolist.db');

// Periksa apakah direktori ada, jika tidak, buatlah
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`);
  
      db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`);
    });
  }
});

module.exports = db;
