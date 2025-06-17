require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manually set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'exampleuser',
  password: process.env.DB_PASSWORD || 'examplepass',
  database: process.env.DB_NAME || 'exampledb'
};

function connectWithRetry() {
  const db = mysql.createConnection(dbConfig);
  db.connect(err => {
    if (err) {
      console.error('MySQL connection error:', err);
      setTimeout(connectWithRetry, 2000);
    } else {
      console.log('Connected to MySQL');
      app.locals.db = db;
    }
  });
}
connectWithRetry();

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.get('/users', (req, res) => {
  const db = req.app.locals.db;
  if (!db) {
    console.error('Database not connected');
    return res.status(500).json({ error: 'Database not connected' });
  }
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

app.get('/about', (req, res) => {
  res.send('Hello World About!');
});

app.listen(process.env.PORT || 3055, () => {
  console.log(`Server running on port ${process.env.PORT || 3055}`);
});
