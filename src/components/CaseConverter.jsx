import { useState } from 'react';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const toCamel = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };

  const toSnake = (str) => {
    return str
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const toKebab = (str) => {
    return str
      .replace(/\s+/g, '-')
      .toLowerCase();
  };

  const toPascal = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      .replace(/\s+/g, '');
  };

  const handleConvert = (mode) => {
    if (!input.trim()) return;
    const raw = input.trim();
    if (mode === 'camel') setOutput(toCamel(raw));
    if (mode === 'snake') setOutput(toSnake(raw));
    if (mode === 'kebab') setOutput(toKebab(raw));
    if (mode === 'pascal') setOutput(toPascal(raw));
    if (mode === 'upper') setOutput(raw.toUpperCase());
    if (mode === 'lower') setOutput(raw.toLowerCase());
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Text Case Converter</h2>
      <p className="tool-desc">Instantly convert strings into coding casing standards.</p>

      <div className="json-controls">
        <div className="control-buttons" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => handleConvert('camel')}>camelCase</button>
          <button className="btn btn-secondary" onClick={() => handleConvert('snake')}>snake_case</button>
          <button className="btn btn-secondary" onClick={() => handleConvert('kebab')}>kebab-case</button>
          <button className="btn btn-secondary" onClick={() => handleConvert('pascal')}>PascalCase</button>
          <button className="btn btn-secondary" onClick={() => handleConvert('upper')}>UPPERCASE</button>
          <button className="btn btn-secondary" onClick={() => handleConvert('lower')}>lowercase</button>
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
            placeholder="Enter raw text words..."
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
            placeholder="Case modified string will appear here..."
            value={output}
          />
        </div>
      </div>
    </div>
  );
}
