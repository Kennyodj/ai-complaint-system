import React, { useState } from 'react';

const ComplaintForm = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing complaint:', error);
      setResult({ error: 'Something went wrong.' });
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your IT issue..."
          style={{ width: '100%', padding: '10px' }}
          required
        />
        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {result && !result.error && (
        <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '10px' }}>
          <h3>AI Classification</h3>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Urgency:</strong> {result.urgency}</p>
        </div>
      )}

      {result?.error && (
        <p style={{ color: 'red', marginTop: '20px' }}>{result.error}</p>
      )}
    </div>
  );
};

export default ComplaintForm;
