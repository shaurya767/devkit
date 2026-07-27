import { useState } from 'react';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = (encode) => {
    setError('');
    try {
      if (encode) {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">URL Encoder & Decoder</h2>
      <p className="tool-desc">Encode or decode strings to be safe for inclusion in URLs.</p>

      <div className="json-controls">
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => handleAction(true)}>Encode</button>
          <button className="btn btn-primary" onClick={() => handleAction(false)}>Decode</button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">
            <span>Input String</span>
            <button className="btn-text" onClick={() => setInput('')}>Clear</button>
          </div>
          <textarea
            className="code-textarea"
            placeholder="Enter text or URL query string..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">
            <span>Result</span>
            {output && <button className="btn-text" onClick={copyToClipboard}>Copy</button>}
          </div>
          <textarea
            className="code-textarea"
            readOnly
            placeholder="Result will appear here..."
            value={output}
          />
        </div>
      </div>

      {error && <div className="error-banner">❌ Error: {error}</div>}
    </div>
  );
}
