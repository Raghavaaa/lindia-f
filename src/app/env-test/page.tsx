"use client";

export default function EnvTestPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET';

  const testBackend = async () => {
    try {
      const response = await fetch(backendUrl + "/health");
      const data = await response.json();
      alert(`Backend response: ${JSON.stringify(data)}`);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Environment Variable Test</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>NEXT_PUBLIC_BACKEND_URL:</strong> {backendUrl}
      </div>
      
      <button 
        onClick={testBackend}
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Backend Connection
      </button>
      
      <div style={{ marginTop: '1rem' }}>
        <h3>Console Test:</h3>
        <p>Open DevTools Console and run:</p>
        <code style={{ backgroundColor: '#f5f5f5', padding: '0.5rem' }}>
          console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
        </code>
      </div>
    </div>
  );
}
