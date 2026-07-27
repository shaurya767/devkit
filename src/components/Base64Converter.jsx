import { useState } from 'react';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = (encode) => {
    setError('');
    try {
      if (encode) {
        setOutput(window.btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(window.atob(input))));
      }
    } catch (err) {
      setError('Failed to process string. Ensure encoding syntax is correct.');
    }
  };

  const handleFileUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOutput(reader.result);
    };
    reader.onerror = () => {
      setError('Error reading file contents.');
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Base64 Converter</h2>
      <p className="tool-desc">Encode strings or files to Base64, or decode back to readable text.</p>

      <div className="json-controls">
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => handleAction(true)}>Encode String</button>
          <button className="btn btn-primary" onClick={() => handleAction(false)}>Decode Base64</button>
          <div className="file-upload-btn-wrap">
            <input type="file" id="file-uploader" onChange={handleFileUpload} style={{ display: 'none' }} />
            <label htmlFor="file-uploader" className="btn btn-secondary">Convert File to Base64</label>
          </div>
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
            placeholder="Enter plain text to encode, or base64 string to decode..."
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
            placeholder="Converted Base64 output will appear here..."
            value={output}
          />
        </div>
      </div>

      {error && <div className="error-banner">❌ Error: {error}</div>}
    </div>
  );
}
