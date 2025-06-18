const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const pedidosRoutes = require('./routes/pedidos');
const entregadoresRoutes = require('./routes/entregadores');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'zeca_delivery',
  charset: 'utf8mb4'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Make db accessible to routes
app.set('db', db);

// Use routes
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/entregadores', entregadoresRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
