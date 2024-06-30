const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

const corsOptions = {
  origin: 'http://35.202.78.230:3000', // Sesuaikan dengan domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
};

app.use(cors(corsOptions))

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
