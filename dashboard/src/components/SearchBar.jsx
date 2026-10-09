import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputWrapper}>
        <Search style={styles.icon} size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search logs by keyword (e.g. 'error', 'database', 'timeout')..."
          style={styles.input}
        />
      </div>
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', gap: '12px', width: '100%', marginBottom: '24px' },
  inputWrapper: { position: 'relative', flex: 1, display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px', color: '#888' },
  input: {
    width: '100%',
    padding: '12px 12px 12px 42px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '16px'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};