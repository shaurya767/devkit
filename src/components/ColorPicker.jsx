import { useState } from 'react';

export default function ColorPicker() {
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#a855f7');
  const [angle, setAngle] = useState(135);

  const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const hexToRGB = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">CSS Gradient & Color Converter</h2>
      <p className="tool-desc">Build gorgeous gradients, inspect codes in HEX & RGB formats.</p>

      <div className="editor-grid">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">Gradient Settings</h3>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Color 1 (HEX):</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
              <input type="text" className="regex-flags-input" style={{ width: 100 }} value={color1} onChange={(e) => setColor1(e.target.value)} />
            </div>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Color 2 (HEX):</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
              <input type="text" className="regex-flags-input" style={{ width: 100 }} value={color2} onChange={(e) => setColor2(e.target.value)} />
            </div>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Color 1 in RGB:</label>
            <pre className="jwt-code-block" style={{ padding: 10 }}>{hexToRGB(color1)}</pre>
          </div>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">Visual Preview</h3>

          <div
            style={{
              height: 180,
              borderRadius: 'var(--radius)',
              background: gradientString,
              boxShadow: 'var(--shadow)',
            }}
          />

          <div className="sidebar-search" style={{ margin: '12px 0 0' }}>
            <input
              type="text"
              readOnly
              style={{ fontSize: 13, fontFamily: 'monospace' }}
              value={`background: ${gradientString};`}
            />
            <button
              className="btn btn-sm btn-secondary"
              style={{ position: 'absolute', right: 6, top: 4 }}
              onClick={() => navigator.clipboard.writeText(`background: ${gradientString};`)}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
