import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const SERVICES = ['auth-service', 'billing-service', 'order-service', 'gateway'];
const LEVELS = ['INFO', 'WARN', 'ERROR', 'CRITICAL'];
const MESSAGES = [
  'User login successful from IP 192.168.1.1',
  'Database connection timeout on pool allocation',
  'Payment gateway timeout on transaction authorization',
  'Memory limit exceeded in worker thread 4',
  'Invalid auth token provided in bearer header'
];

export default function () {
  const payload = JSON.stringify({
    service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
    level: LEVELS[Math.floor(Math.random() * LEVELS.length)],
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    timestamp: new Date().toISOString()
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // Sends HTTP traffic to Nginx Edge Proxy
  http.post('http://localhost:8080/ingest', payload, params);
  sleep(0.1);
}