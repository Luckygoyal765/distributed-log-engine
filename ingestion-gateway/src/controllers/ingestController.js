const { sendLogsToKafka } = require('../producer/kafkaProducer');

const handleLogIngestion = async (req, res) => {
  try {
    const payload = req.body;

    // Support single log object or array of logs
    const logs = Array.isArray(payload) ? payload : [payload];

    if (!logs.length || !logs[0].message) {
      return res.status(400).json({ error: 'Invalid log payload. "message" field is required.' });
    }

    // Publish to Kafka stream asynchronously
    await sendLogsToKafka(logs);

    return res.status(202).json({
      status: 'accepted',
      count: logs.length
    });
  } catch (error) {
    console.error('Error ingesting log batch:', error.message);
    return res.status(500).json({ error: 'Internal Ingestion Error' });
  }
};

module.exports = { handleLogIngestion };