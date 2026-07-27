import { useState, useEffect, useRef } from 'react';

export default function QRGenerator() {
  const [text, setText] = useState('https://devkit.org');
  const [size, setSize] = useState(200);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    // Generate QR code using qrserver api locally (free, public API)
    const apiSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    if (qrRef.current) {
      qrRef.current.src = apiSrc;
    }
  }, [text, size]);

  return (
    <div className="tool-container">
      <h2 className="tool-title">QR Code Generator</h2>
      <p className="tool-desc">Generate customizable QR codes for links, text values, or code blocks instantly.</p>

      <div className="editor-grid">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">QR Configuration</h3>

          <div className="control-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <label>Value / Link / String</label>
            <input
              type="text"
              className="regex-expression-input"
              style={{ width: '100%' }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Size: {size}px</label>
            <input
              type="range"
              min={100}
              max={400}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
          <h3 className="panel-title" style={{ alignSelf: 'flex-start' }}>Render Output</h3>
          {text ? (
            <img
              ref={qrRef}
              alt="QR Code"
              style={{
                boxShadow: 'var(--shadow)',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                padding: 10,
              }}
            />
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Provide value inputs to render QR...</span>
          )}
        </div>
      </div>
    </div>
  );
}
