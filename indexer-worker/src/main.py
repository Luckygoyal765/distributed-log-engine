import os
from dotenv import load_dotenv
from consumer.kafkaConsumer import start_consumer

if __name__ == "__main__":
    load_dotenv()
    print("⚡ Starting Distributed Log Indexer Worker...")
    start_consumer()