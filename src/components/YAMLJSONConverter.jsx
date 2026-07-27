import { useState } from 'react';
import * as yaml from 'js-yaml';

export default function YAMLJSONConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = (toJSON) => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      if (toJSON) {
        // YAML to JSON
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        // JSON to YAML
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed));
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
      <h2 className="tool-title">YAML ↔ JSON Converter</h2>
      <p className="tool-desc">Seamlessly convert data structures between YAML and JSON formats.</p>

      <div className="json-controls">
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => convert(true)}>YAML to JSON</button>
          <button className="btn btn-primary" onClick={() => convert(false)}>JSON to YAML</button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">
            <span>Input</span>
            <button className="btn-text" onClick={() => setInput('')}>Clear</button>
          </div>
          <textarea
            className="code-textarea"
            placeholder="Paste YAML or JSON raw string..."
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
            placeholder="Parsed output will appear here..."
            value={output}
          />
        </div>
      </div>

      {error && <div className="error-banner">❌ Parsing Error: {error}</div>}
    </div>
  );
}
