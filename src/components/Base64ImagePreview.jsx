import { useState } from 'react';

export default function Base64ImagePreview() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const cleanDataURL = () => {
    setError('');
    let raw = input.trim();
    if (!raw) return '';
    // prefix data:image/png;base64, if missing
    if (!raw.startsWith('data:image')) {
      if (raw.startsWith('iVBORw0KGgo')) {
        // png heuristic
        raw = 'data:image/png;base64,' + raw;
      } else if (raw.startsWith('/9j/')) {
        // jpeg heuristic
        raw = 'data:image/jpeg;base64,' + raw;
      } else if (raw.startsWith('R0lGOD')) {
        // gif heuristic
        raw = 'data:image/gif;base64,' + raw;
      } else {
        raw = 'data:image/png;base64,' + raw;
      }
    }
    return raw;
  };

  const imageSrc = cleanDataURL();

  return (
    <div className="tool-container">
      <h2 className="tool-title">Base64 Image Preview</h2>
      <p className="tool-desc">Paste raw Base64 string data or Data URLs to render and inspect the visual image output.</p>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">
            <span>Base64 String Input</span>
            <button className="btn-text" onClick={() => setInput('')}>Clear</button>
          </div>
          <textarea
            className="code-textarea"
            placeholder="Paste your base64 raw data blocks or data:image URI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box" style={{ justifyContent: 'center', alignItems: 'center', minHeight: 400, padding: 16 }}>
          <div className="editor-header" style={{ width: '100%', position: 'absolute', top: 0 }}>Visual Preview</div>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Base64 Preview"
              onError={() => setError('Invalid image data')}
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
              }}
            />
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Rendered image will appear here...</span>
          )}
          {error && <div className="error-banner" style={{ marginTop: 12 }}>❌ {error}</div>}
        </div>
      </div>
    </div>
  );
}
