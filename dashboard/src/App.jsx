import React from 'react';
import SearchBar from './components/SearchBar';
import LogTable from './components/LogTable';
import { useSearch } from './hooks/useSearch';

export default function App() {
  const { data, isLoading, error, searchLogs } = useSearch();

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ Distributed Log Search Engine</h1>
        <p style={styles.subtitle}>Inverted Indexing • Kafka Streaming • Redis Query Cache</p>
      </header>

      <SearchBar onSearch={searchLogs} isLoading={isLoading} />

      {error && <div style={styles.error}>{error}</div>}

      {data && (
        <div style={styles.metrics}>
          <span>Hits: <strong>{data.totalHits}</strong></span>
          <span>Source: <span style={styles.sourceBadge}>{data.source}</span></span>
          <span>Scanned Segments: <strong>{data.scannedSegments}</strong></span>
        </div>
      )}

      {data && <LogTable logs={data.results} />}
    </div>
  );
}

const styles = {
  app: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '28px', marginBottom: '8px' },
  subtitle: { color: '#888', fontSize: '14px' },
  error: { padding: '12px', backgroundColor: '#3d1214', color: '#ff4d4f', borderRadius: '6px', marginBottom: '20px' },
  metrics: { display: 'flex', gap: '20px', marginBottom: '16px', padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', fontSize: '14px' },
  sourceBadge: { padding: '2px 6px', backgroundColor: '#0070f3', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
};