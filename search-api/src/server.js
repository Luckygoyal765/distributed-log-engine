require('dotenv').config();
const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', searchRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Search API Healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Search API running on port ${PORT}`);
});