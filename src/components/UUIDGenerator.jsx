import { useState } from 'react';

export default function UUIDGenerator() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState('uuid'); // uuid, nanoid, ulid
  const [count, setCount] = useState(5);

  const generateUUID = () => {
    // Standard RFC4122 v4 UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateNanoID = (size = 21) => {
    // standard nanoid secure random alphabet string
    const alphabet = 'use_atleast_one_char_from_this_string_to_avoid_any_unsafe_chars_in_your_nanoids_23456789';
    let id = '';
    for (let i = 0; i < size; i++) {
      id += alphabet[(Math.random() * alphabet.length) | 0];
    }
    return id;
  };

  const generateULID = () => {
    // simple lexicographically sortable 26-char string
    const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let id = '';
    for (let i = 0; i < 26; i++) {
      id += chars[(Math.random() * chars.length) | 0];
    }
    return id;
  };

  const handleGenerate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      if (type === 'uuid') list.push(generateUUID());
      if (type === 'nanoid') list.push(generateNanoID());
      if (type === 'ulid') list.push(generateULID());
    }
    setOutput(list.join('\n'));
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">UUID / NanoID / ULID Generator</h2>
      <p className="tool-desc">Quickly generate cryptographically random unique identifier tokens in bulk.</p>

      <div className="json-controls">
        <div className="control-group">
          <label>ID Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="uuid">UUID v4</option>
            <option value="nanoid">NanoID</option>
            <option value="ulid">ULID</option>
          </select>
        </div>

        <div className="control-group">
          <label>Count:</label>
          <input
            type="number"
            min={1}
            max={100}
            className="regex-flags-input"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
      </div>

      <div className="editor-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="editor-box">
          <div className="editor-header">
            <span>Generated Tokens</span>
            {output && <button className="btn-text" onClick={() => navigator.clipboard.writeText(output)}>Copy All</button>}
          </div>
          <textarea
            className="code-textarea"
            style={{ minHeight: 250 }}
            readOnly
            value={output}
            placeholder="Click Generate to produce token rows..."
          />
        </div>
      </div>
    </div>
  );
}
