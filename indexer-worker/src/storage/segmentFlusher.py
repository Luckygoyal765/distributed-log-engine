import os
import json
import time

class SegmentFlusher:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)

    def flush_segment(self, inverted_index_obj) -> str:
        """Serializes current in-memory index segment to persistent disk volume."""
        if inverted_index_obj.size() == 0:
            return ""

        timestamp = int(time.time() * 1000)
        segment_filename = f"segment_{timestamp}.json"
        segment_path = os.path.join(self.data_dir, segment_filename)

        # Convert sets to lists for JSON serialization
        serializable_index = {
            term: list(doc_ids) 
            for term, doc_ids in inverted_index_obj.index.items()
        }

        segment_data = {
            "created_at": timestamp,
            "document_count": inverted_index_obj.size(),
            "index": serializable_index,
            "documents": inverted_index_obj.documents
        }

        with open(segment_path, "w") as f:
            json.dump(segment_data, f, indent=2)

        print(f"💾 Flushed index segment to {segment_filename} ({inverted_index_obj.size()} docs)")
        
        # Reset RAM buffer
        inverted_index_obj.clear()
        return segment_path