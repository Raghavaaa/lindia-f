"use client";

export default function DebugPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          🔍 Debug Information
        </h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Environment Variables
          </h2>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '500' }}>NEXT_PUBLIC_BACKEND_URL:</span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: backendUrl && backendUrl !== 'NOT SET' ? '#dcfce7' : '#fecaca',
                color: backendUrl && backendUrl !== 'NOT SET' ? '#166534' : '#dc2626'
              }}>
                {backendUrl}
              </span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Backend Connection Test
          </h2>
          <div>
            <button
              onClick={() => {
                if (backendUrl && backendUrl !== 'NOT SET') {
                  window.open(`${backendUrl}/health`, '_blank');
                } else {
                  alert('Backend URL not configured');
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Test Backend Health Check
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>This page helps debug the frontend-backend connection.</p>
          <p>If NEXT_PUBLIC_BACKEND_URL shows "NOT SET", the environment variable isn't configured properly.</p>
        </div>
      </div>
    </div>
  );
}
