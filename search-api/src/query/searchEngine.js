const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || '/app/data';

const tokenize = (text) => {
  if (!text) return [];
  return text.toLowerCase().match(/\b\w+\b/g) || [];
};

const executeSearch = async (queryString) => {
  const queryTokens = tokenize(queryString);
  if (!queryTokens.length) {
    return { results: [], totalHits: 0, scannedSegments: 0 };
  }

  if (!fs.existsSync(DATA_DIR)) {
    return { results: [], totalHits: 0, scannedSegments: 0 };
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith('segment_') && f.endsWith('.json'));
  
  const matchedDocuments = [];
  let scannedSegments = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const segment = JSON.parse(rawData);
      scannedSegments++;

      const index = segment.index || {};
      const documents = segment.documents || {};

      // Get posting lists for all query tokens
      const postingLists = queryTokens.map((token) => new Set(index[token] || []));

      // Find document IDs containing ALL query tokens (AND operation)
      let matchingDocIds = Array.from(postingLists[0]);
      for (let i = 1; i < postingLists.length; i++) {
        matchingDocIds = matchingDocIds.filter((id) => postingLists[i].has(id));
      }

      // Reconstruct document records
      matchingDocIds.forEach((docId) => {
        if (documents[docId]) {
          matchedDocuments.push(documents[docId]);
        }
      });
    } catch (err) {
      console.error(`Error reading segment file ${file}:`, err.message);
    }
  }

  // Sort matched documents descending by timestamp
  matchedDocuments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    results: matchedDocuments,
    totalHits: matchedDocuments.length,
    scannedSegments
  };
};

module.exports = { executeSearch };