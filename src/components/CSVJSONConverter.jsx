import { useState } from 'react';

export default function CSVJSONConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const csvToJSON = (csv) => {
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length === 0) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      headers.forEach((header, index) => {
        const val = currentline[index] ? currentline[index].trim().replace(/^["']|["']$/g, '') : '';
        obj[header] = isNaN(val) || val === '' ? val : Number(val);
      });
      result.push(obj);
    }
    return result;
  };

  const jsonToCSV = (jsonArray) => {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
    const headers = Object.keys(jsonArray[0]);
    const csvRows = [headers.join(',')];

    for (const row of jsonArray) {
      const values = headers.map(header => {
        const val = row[header] !== undefined ? row[header] : '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const convert = (toJS) => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      if (toJS) {
        const parsed = csvToJSON(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        let parsed;
        try {
          parsed = JSON.parse(input);
        } catch (e) {
          throw new Error('Input is not valid JSON syntax: ' + e.message);
        }
        if (!Array.isArray(parsed)) {
          throw new Error('Input JSON must be a valid Array of objects (e.g. [{"id": 1}])');
        }
        if (parsed.length > 0 && (typeof parsed[0] !== 'object' || parsed[0] === null)) {
          throw new Error('Input JSON must contain objects within the array.');
        }
        setOutput(jsonToCSV(parsed));
      }
    } catch (err) {
      setError(err.message || 'Check input syntax correctness');
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">CSV ↔ JSON Converter</h2>
      <p className="tool-desc">Convert data tables in CSV structure into JSON object arrays and vice-versa.</p>

      <div className="json-controls">
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => convert(true)}>CSV to JSON</button>
          <button className="btn btn-primary" onClick={() => convert(false)}>JSON Array to CSV</button>
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
            placeholder="Paste your CSV rows or raw JSON Array here..."
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
            placeholder="Converted table strings will appear here..."
            value={output}
          />
        </div>
      </div>

      {error && <div className="error-banner">❌ Conversion Error: {error}</div>}
    </div>
  );
}
