const { Kafka } = require('kafkajs');

const broker = process.env.KAFKA_BROKER || 'kafka:29092';

const kafka = new Kafka({
  clientId: 'ingestion-gateway',
  brokers: [broker],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

module.exports = kafka;