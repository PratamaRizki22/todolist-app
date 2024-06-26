const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());  // Gunakan middleware CORS
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
