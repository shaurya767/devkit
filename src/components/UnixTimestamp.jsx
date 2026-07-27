import { useState, useEffect } from 'react';

export default function UnixTimestamp() {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState('');
  const [epochResult, setEpochResult] = useState('');

  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEpochConvert = () => {
    if (!epochInput) return;
    try {
      const ms = epochInput.length <= 10 ? Number(epochInput) * 1000 : Number(epochInput);
      setEpochResult(new Date(ms).toLocaleString());
    } catch {
      setEpochResult('Invalid Epoch Timestamp format');
    }
  };

  const handleDateConvert = () => {
    if (!dateInput) return;
    try {
      const parsed = Date.parse(dateInput);
      if (isNaN(parsed)) {
        setDateResult('Invalid date string format');
      } else {
        setDateResult(`Epoch Seconds: ${Math.floor(parsed / 1000)} | Milliseconds: ${parsed}`);
      }
    } catch {
      setDateResult('Invalid Date string');
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Unix Epoch Timestamp Converter</h2>
      <p className="tool-desc">Real-time epoch counter and date-string parser.</p>

      <div className="jwt-expiry-banner active" style={{ fontSize: 16 }}>
        🕒 Current Unix Time: <strong>{currentEpoch}</strong>
      </div>

      <div className="editor-grid">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">Epoch to Date</h3>
          <input
            type="text"
            className="regex-expression-input"
            placeholder="1716382041 (Seconds or ms)"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleEpochConvert}>Convert to Date</button>
          {epochResult && <pre className="jwt-code-block" style={{ padding: 12 }}>{epochResult}</pre>}
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">Date to Epoch</h3>
          <input
            type="text"
            className="regex-expression-input"
            placeholder="2026-07-27T07:30:00"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleDateConvert}>Convert to Epoch</button>
          {dateResult && <pre className="jwt-code-block" style={{ padding: 12 }}>{dateResult}</pre>}
        </div>
      </div>
    </div>
  );
}
