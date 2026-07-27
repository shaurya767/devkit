import { useState } from 'react';

function TreeNode({ label, value, isLast = true }) {
  const [collapsed, setCollapsed] = useState(false);

  const getType = (val) => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const type = getType(value);

  if (type === 'object') {
    const keys = Object.keys(value);
    return (
      <div className="tree-node">
        <span className="tree-toggle-arrow" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▶' : '▼'}
        </span>
        <span className="tree-key">{label}: </span>
        <span className="tree-bracket">{'{'}</span>
        {!collapsed && (
          <div className="tree-children" style={{ paddingLeft: 18, borderLeft: '1px dashed var(--border)' }}>
            {keys.map((k, i) => (
              <TreeNode key={k} label={k} value={value[k]} isLast={i === keys.length - 1} />
            ))}
          </div>
        )}
        <span className="tree-bracket">{'}'}{!isLast && ','}</span>
      </div>
    );
  }

  if (type === 'array') {
    return (
      <div className="tree-node">
        <span className="tree-toggle-arrow" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▶' : '▼'}
        </span>
        <span className="tree-key">{label}: </span>
        <span className="tree-bracket">{'['}</span>
        {!collapsed && (
          <div className="tree-children" style={{ paddingLeft: 18, borderLeft: '1px dashed var(--border)' }}>
            {value.map((item, i) => (
              <TreeNode key={i} label={i} value={item} isLast={i === value.length - 1} />
            ))}
          </div>
        )}
        <span className="tree-bracket">{']'}{!isLast && ','}</span>
      </div>
    );
  }

  // Primitive value rendering
  let valStr = String(value);
  let valClass = 'tree-value-string';
  if (type === 'number') valClass = 'tree-value-number';
  if (type === 'boolean') valClass = 'tree-value-bool';
  if (type === 'null') valClass = 'tree-value-null';

  if (type === 'string') {
    valStr = `"${value}"`;
  }

  return (
    <div className="tree-node-primitive" style={{ paddingLeft: 16 }}>
      <span className="tree-key">{label}: </span>
      <span className={valClass}>{valStr}</span>
      {!isLast && <span className="tree-comma">,</span>}
    </div>
  );
}

export default function JSONTreeViewer() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');

  const parseInput = () => {
    setError('');
    setParsed(null);
    if (!input.trim()) return;

    try {
      const p = JSON.parse(input);
      setParsed(p);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">JSON Tree Viewer</h2>
      <p className="tool-desc">Inspect complex JSON structures in a collapsible tree nodes interface.</p>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">
            <span>JSON String Input</span>
            <button className="btn btn-sm btn-primary" onClick={parseInput}>Parse to Tree</button>
          </div>
          <textarea
            className="code-textarea"
            placeholder="Paste your JSON objects here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box" style={{ minHeight: 400, overflowY: 'auto' }}>
          <div className="editor-header">Collapsible Tree nodes</div>
          <div className="tree-body-wrapper" style={{ padding: 18, fontFamily: 'monospace', fontSize: 13 }}>
            {parsed ? (
              <TreeNode label="Root" value={parsed} isLast={true} />
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Click Parse to generate interactive tree...</span>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-banner">❌ JSON Syntax Error: {error}</div>}
    </div>
  );
}
