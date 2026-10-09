import os
import json
import time
from kafka import KafkaConsumer
from indexer.invertedIndex import InvertedIndex
from storage.segmentFlusher import SegmentFlusher

def start_consumer():
    broker = os.getenv("KAFKA_BROKER", "kafka:29092")
    topic = os.getenv("KAFKA_TOPIC", "app-logs")
    group_id = os.getenv("CONSUMER_GROUP", "log-indexer-group")
    data_dir = os.getenv("DATA_DIR", "/app/data")
    
    # Flush conditions
    FLUSH_THRESHOLD = 50   # Flush every 50 logs
    FLUSH_INTERVAL_SEC = 10 # Flush at least every 10 seconds

    index = InvertedIndex()
    flusher = SegmentFlusher(data_dir)
    
    consumer = None
    while not consumer:
        try:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=[broker],
                group_id=group_id,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                enable_auto_commit=True
            )
            print(f"✅ Connected to Kafka Broker on {broker}")
        except Exception as e:
            print(f"⏳ Waiting for Kafka Broker... ({e})")
            time.sleep(5)

    last_flush_time = time.time()

    print("🚀 Indexer Worker listening for log streams...")
    for message in consumer:
        log_entry = message.value
        index.add_document(log_entry)

        current_time = time.time()
        # Flush if memory size threshold reached OR time interval elapsed
        if index.size() >= FLUSH_THRESHOLD or (current_time - last_flush_time) >= FLUSH_INTERVAL_SEC:
            flusher.flush_segment(index)
            last_flush_time = current_time