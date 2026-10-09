Distributed Log Search & Indexing Engine

A high-performance, event-driven log ingestion and full-text search engine built with Node.js, Python, Apache Kafka, Redis, and React.

System Architecture

[ k6 Load Generator / Clients ]
               │
               ▼
        [ Nginx Proxy ] (Port 8080)
               │
               ▼
   [ Ingestion Gateway Nodes ] (Node.js/Express)
               │
               ▼
        [ Apache Kafka ] (Broker / Zookeeper)
               │
               ▼
     [ Indexer Worker ] (Python Inverted Indexer)
               │
               ▼
     [ Disk Segment Files ] (./data/segment_*.json)
               ▲
               │
        [ Search API ] (Node.js/Express) ──► [ Redis Cache ]
               ▲
               │
       [ React Dashboard ] (Port 5173)


Features

Asynchronous Log Ingestion: Load-balanced ingestion gateway powered by Nginx and Express.

Distributed Streaming Bus: Apache Kafka buffers high-throughput log events.

Inverted Index Engine: Custom Python background worker tokenizes and builds inverted index posting lists, periodically flushing immutable segment files to disk.

Cache-Aside Querying: Express Search API with Redis caching layer for sub-millisecond repeated queries.

Interactive UI: React + Vite dashboard displaying log query hits, scanned segment counts, and execution source tags (DISK_SEGMENT_INDEX vs REDIS_CACHE).

Prerequisites

Docker & Docker Compose

Node.js (v18+)

Python 3.10+

k6 (for performance testing)

Quick Start

1. Start Infrastructure & Services

docker compose up --build -d


2. Run Load Testing

k6 run k6/load-test.js


3. Start the Dashboard

cd dashboard
npm install
npm run dev


Open http://localhost:5173 in your browser.

Project Structure

├── dashboard/           # React + Vite Search UI
├── data/                # Generated inverted index JSON segments
├── indexer-worker/      # Python consumer & inverted indexer
├── ingestion-gateway/   # Express ingestion API
├── k6/                  # Load generation scripts
├── search-api/          # Search API with Redis caching
├── docker-compose.yml   # Multi-container orchestrator
└── nginx.conf           # Load balancer configuration
