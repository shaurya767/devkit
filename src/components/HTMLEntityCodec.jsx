import { useState } from 'react';

export default function HTMLEntityCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeHTML = () => {
    const el = document.createElement('div');
    el.innerText = input;
    setOutput(el.innerHTML);
  };

  const decodeHTML = () => {
    const el = document.createElement('div');
    el.innerHTML = input;
    setOutput(el.innerText);
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">HTML Entity Encoder & Decoder</h2>
      <p className="tool-desc">Escape raw strings for HTML tag blocks or unescape entities back to raw elements.</p>

      <div className="json-controls">
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={encodeHTML}>Encode HTML</button>
          <button className="btn btn-primary" onClick={decodeHTML}>Decode HTML</button>
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
            placeholder="Enter text or HTML tags..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">
            <span>Result</span>
            {output && <button className="btn-text" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>}
          </div>
          <textarea
            className="code-textarea"
            readOnly
            placeholder="Result will appear here..."
            value={output}
          />
        </div>
      </div>
    </div>
  );
}
