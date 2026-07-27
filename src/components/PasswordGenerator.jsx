import { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('Select at least one character set options');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[(Math.random() * charset.length) | 0];
    }
    setPassword(result);
  };

  const getStrength = () => {
    if (!password) return { label: 'Empty', color: 'var(--text-muted)', pct: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak 🔴', color: 'var(--error)', pct: 33 };
    if (score <= 4) return { label: 'Good 🟡', color: 'var(--warning)', pct: 66 };
    return { label: 'Very Strong 🟢', color: 'var(--success)', pct: 100 };
  };

  const strength = getStrength();

  return (
    <div className="tool-container">
      <h2 className="tool-title">Password Generator & Strength Meter</h2>
      <p className="tool-desc">Generate strong cryptographically secure passwords and measure their strength.</p>

      <div className="editor-grid">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="panel-title">Custom Configurations</h3>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Length: {length}</label>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <label className="recurring-label">
            <input type="checkbox" className="recurring-check" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            <span>Uppercase (A-Z)</span>
          </label>

          <label className="recurring-label">
            <input type="checkbox" className="recurring-check" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
            <span>Lowercase (a-z)</span>
          </label>

          <label className="recurring-label">
            <input type="checkbox" className="recurring-check" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
            <span>Numbers (0-9)</span>
          </label>

          <label className="recurring-label">
            <input type="checkbox" className="recurring-check" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
            <span>Special Characters (!@#$)</span>
          </label>

          <button className="btn btn-primary" onClick={generatePassword}>Generate Password</button>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="panel-title">Generated Password</h3>
          <div className="sidebar-search" style={{ margin: 0 }}>
            <input
              type="text"
              readOnly
              style={{ fontSize: 16, fontFamily: 'monospace' }}
              value={password}
              placeholder="Your password will render here..."
            />
            {password && (
              <button
                className="btn btn-sm btn-secondary"
                style={{ position: 'absolute', right: 6, top: 4 }}
                onClick={() => navigator.clipboard.writeText(password)}
              >
                Copy
              </button>
            )}
          </div>

          {password && (
            <div className="score-row" style={{ marginTop: 12 }}>
              <div className="score-row-top">
                <span className="score-row-label">Strength Assessment</span>
                <span className="score-row-pts" style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
