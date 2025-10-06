import React, { useState } from 'react';

const API_URL = "http://localhost:8000";
export default function ResearchAssistant() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
    const response = await fetch(`${API_URL}/research?query=${encodeURIComponent(query)}&max_results=10`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Deep Research Assistant</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter research query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '70%', padding: '0.5rem', fontSize: '1rem', marginRight: '0.5rem' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {results.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map(({ title, url, snippet }, idx) => (
            <li key={idx} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0077cc', textDecoration: 'none' }}>
                {title}
              </a>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.5rem 0' }}>{snippet}</p>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#009900' }}>
                {url}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No results yet. Try a query above.</p>
      )}
    </div>
  );
}
