const kafka = require('../config/kafka');

const producer = kafka.producer();
const TOPIC = process.env.KAFKA_TOPIC || 'app-logs';

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    try {
      await producer.connect();
      isConnected = true;
      console.log('✅ Kafka Producer connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect Kafka Producer:', error);
      setTimeout(connectProducer, 5000);
    }
  }
};

const sendLogsToKafka = async (logs) => {
  if (!isConnected) {
    throw new Error('Kafka Producer is not connected yet');
  }

  // Format messages for Kafka partitions
  const messages = logs.map((log) => ({
    key: log.service || 'default-service',
    value: JSON.stringify({
      id: log.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: log.timestamp || new Date().toISOString(),
      level: log.level || 'INFO',
      service: log.service || 'unknown',
      message: log.message || ''
    })
  }));

  await producer.send({
    topic: TOPIC,
    messages
  });
};

module.exports = { connectProducer, sendLogsToKafka };