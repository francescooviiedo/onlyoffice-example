require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

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

// --- FILES ROUTES START ---

// Upload files (multiple)
app.post('/files', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const files = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/files/${file.filename}`
  }));
  res.status(201).json({ files });
});

// List all uploaded files
app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to list files' });
    }
    const fileList = files.map(filename => ({
      filename,
      url: `/files/${filename}`
    }));
    res.json({ files: fileList });
  });
});

// Download a file by filename
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.download(filePath, err => {
    if (err) {
      res.status(500).json({ error: 'Error sending file' });
    }
  });
});

// --- FILES ROUTES END ---

app.listen(process.env.PORT || 3055, () => {
  console.log(`Server running on port ${process.env.PORT || 3055}`);
});
