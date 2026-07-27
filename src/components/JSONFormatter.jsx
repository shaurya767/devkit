import { useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [spaces, setSpaces] = useState(2);

  const formatJSON = (prettify) => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (prettify) {
        setOutput(JSON.stringify(parsed, null, Number(spaces)));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoadSample = () => {
    const sample = {
      name: "devkit",
      version: "1.0.0",
      description: "Developer Utility Suite",
      features: ["json_formatter", "diff_checker", "url_codec", "jwt_decoder"],
      active: true,
      stats: { toolsCount: 6, offline: true }
    };
    setInput(JSON.stringify(sample, null, 2));
    setError('');
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">JSON Formatter & Validator</h2>
      <p className="tool-desc">Prettify, minify, validate, and format JSON code.</p>

      <div className="json-controls">
        <div className="control-group">
          <label>Spaces:</label>
          <select value={spaces} onChange={(e) => setSpaces(e.target.value)}>
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>

        <div className="control-buttons">
          <button className="btn btn-secondary" onClick={handleLoadSample}>Load Sample</button>
          <button className="btn btn-primary" onClick={() => formatJSON(true)}>Prettify</button>
          <button className="btn btn-primary" onClick={() => formatJSON(false)}>Minify</button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">
            <span>Input JSON</span>
            <button className="btn-text" onClick={() => setInput('')}>Clear</button>
          </div>
          <textarea
            className="code-textarea"
            placeholder="Paste your raw JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">
            <span>Output</span>
            {output && <button className="btn-text" onClick={copyToClipboard}>Copy</button>}
          </div>
          <textarea
            className="code-textarea"
            readOnly
            placeholder="Formatted output will appear here..."
            value={output}
          />
        </div>
      </div>

      {error && <div className="error-banner">❌ Invalid JSON: {error}</div>}
    </div>
  );
}
