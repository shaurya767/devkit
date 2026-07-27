import { useState } from 'react';

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  const decodeJWT = () => {
    setError('');
    setHeader(null);
    setPayload(null);

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('JWT must consist of exactly 3 parts separated by dots.');
      return;
    }

    try {
      const base64Decode = (str) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      };

      setHeader(base64Decode(parts[0]));
      setPayload(base64Decode(parts[1]));
    } catch (err) {
      setError('Failed to parse JWT payload. Ensure it is a valid base64url encoded token.');
    }
  };

  const getExpirationStatus = () => {
    if (!payload || !payload.exp) return null;
    const expTime = payload.exp * 1000;
    const diff = expTime - Date.now();
    const dateStr = new Date(expTime).toLocaleString();
    if (diff < 0) {
      return { expired: true, text: `Expired on ${dateStr}` };
    }
    const mins = Math.floor(diff / 60000);
    return { expired: false, text: `Expires on ${dateStr} (in ~${mins} minutes)` };
  };

  const expStatus = getExpirationStatus();

  return (
    <div className="tool-container">
      <h2 className="tool-title">JWT Decoder</h2>
      <p className="tool-desc">Decode JSON Web Tokens (JWT) payload structures instantly.</p>

      <div className="jwt-layout">
        <div className="editor-box full-width">
          <div className="editor-header">
            <span>Encoded JWT Token</span>
            <button className="btn btn-primary btn-sm" onClick={decodeJWT}>Decode</button>
          </div>
          <textarea
            className="code-textarea single-line-height"
            placeholder="Paste your encoded token (header.payload.signature)..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        {error && <div className="error-banner">❌ {error}</div>}

        {(header || payload) && (
          <div className="jwt-result-sections">
            {expStatus && (
              <div className={`jwt-expiry-banner ${expStatus.expired ? 'expired' : 'active'}`}>
                {expStatus.expired ? '🚨' : '⏰'} {expStatus.text}
              </div>
            )}

            <div className="editor-grid">
              <div className="editor-box">
                <div className="editor-header header-red">Header (Algorithms & Token Type)</div>
                <pre className="jwt-code-block">{JSON.stringify(header, null, 2)}</pre>
              </div>

              <div className="editor-box">
                <div className="editor-header payload-purple">Payload (Claims/Data)</div>
                <pre className="jwt-code-block">{JSON.stringify(payload, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
