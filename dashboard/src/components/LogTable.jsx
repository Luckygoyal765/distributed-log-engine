import React from 'react';

export default function LogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return <div style={styles.empty}>No logs found for this query.</div>;
  }

  const getLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
      case 'CRITICAL':
        return '#ff4d4f';
      case 'WARN':
        return '#faad14';
      default:
        return '#52c41a';
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Timestamp</th>
            <th style={styles.th}>Level</th>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} style={styles.tr}>
              <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, backgroundColor: getLevelColor(log.level) }}>
                  {log.level}
                </span>
              </td>
              <td style={styles.td}><code>{log.service}</code></td>
              <td style={styles.td}>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { overflowX: 'auto', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' },
  empty: { padding: '32px', textAlign: 'center', color: '#888' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#eee', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '1px solid #333', backgroundColor: '#111', color: '#888' },
  tr: { borderBottom: '1px solid #222' },
  td: { padding: '12px 16px', fontSize: '14px' },
  badge: { padding: '2px 8px', borderRadius: '4px', color: '#000', fontWeight: 'bold', fontSize: '12px' }
};