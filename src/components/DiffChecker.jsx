import { useState } from 'react';
import { diffWords, diffLines } from 'diff';

export default function DiffChecker() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffMode, setDiffMode] = useState('lines'); // lines, words
  const [diffResult, setDiffResult] = useState([]);

  const compareText = () => {
    const fn = diffMode === 'lines' ? diffLines : diffWords;
    const diff = fn(original, modified);
    setDiffResult(diff);
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Code Diff Checker</h2>
      <p className="tool-desc">Compare two text inputs or blocks of code and highlight the differences.</p>

      <div className="json-controls">
        <div className="control-group">
          <label>Compare Mode:</label>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${diffMode === 'lines' ? 'active' : ''}`}
              onClick={() => setDiffMode('lines')}
            >
              Lines
            </button>
            <button
              className={`toggle-btn ${diffMode === 'words' ? 'active' : ''}`}
              onClick={() => setDiffMode('words')}
            >
              Words
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={compareText}>Compare Texts</button>
      </div>

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">Original Text</div>
          <textarea
            className="code-textarea"
            placeholder="Enter original text..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
        </div>
        <div className="editor-box">
          <div className="editor-header">Modified Text</div>
          <textarea
            className="code-textarea"
            placeholder="Enter modified text..."
            value={modified}
            onChange={(e) => setModified(e.target.value)}
          />
        </div>
      </div>

      {diffResult.length > 0 && (
        <div className="diff-output-box">
          <div className="editor-header">Comparison Result</div>
          <pre className="diff-pre">
            {diffResult.map((part, index) => {
              const className = part.added
                ? 'diff-added'
                : part.removed
                ? 'diff-removed'
                : 'diff-unchanged';
              return (
                <span key={index} className={className}>
                  {part.value}
                </span>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
}
