import re
from typing import List, Dict, Set

class InvertedIndex:
    def __init__(self):
        # Maps token string -> set of Log IDs
        self.index: Dict[str, Set[str]] = {}
        # Maps Log ID -> complete log record dictionary
        self.documents: Dict[str, dict] = {}

    def _tokenize(self, text: str) -> List[str]:
        """Normalizes and splits log string into alphanumeric tokens."""
        if not text:
            return []
        tokens = re.findall(r'\b\w+\b', text.lower())
        return tokens

    def add_document(self, log_entry: dict):
        """Indexes a single log document into posting lists."""
        doc_id = log_entry.get("id")
        if not doc_id:
            return

        # Store document record
        self.documents[doc_id] = log_entry

        # Tokenize message body and metadata
        raw_text = f"{log_entry.get('message', '')} {log_entry.get('level', '')} {log_entry.get('service', '')}"
        tokens = self._tokenize(raw_text)

        # Update posting lists for each unique token
        for token in set(tokens):
            if token not in self.index:
                self.index[token] = set()
            self.index[token].add(doc_id)

    def size(self) -> int:
        return len(self.documents)

    def clear(self):
        """Resets in-memory storage after segment flushing."""
        self.index.clear()
        self.documents.clear()