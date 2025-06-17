const express = require('express');
const cors = require('cors');

const app = express();

// Add CORS support for frontend requests
app.use(cors({
  origin: '*'
}));

// ...existing code...

module.exports = app;