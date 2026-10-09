require('dotenv').config();
const express = require('express');
const { connectProducer } = require('./producer/kafkaProducer');
const { handleLogIngestion } = require('./controllers/ingestController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/ingest', handleLogIngestion);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Ingestion Gateway Healthy' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Ingestion Gateway running on port ${PORT}`);
  await connectProducer();
});