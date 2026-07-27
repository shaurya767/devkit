import { useState, useMemo } from 'react';

export default function RegexTester() {
  const [regexStr, setRegexStr] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const matches = useMemo(() => {
    if (!regexStr || !text) return [];
    try {
      const regex = new RegExp(regexStr, flags);
      const allMatches = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          allMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Prevent infinite loops for zero-width matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(text);
        if (match) {
          allMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      return allMatches;
    } catch (e) {
      return null; // Invalid regex
    }
  }, [regexStr, flags, text]);

  const renderedText = useMemo(() => {
    if (!regexStr || !text || matches === null || matches.length === 0) return text;
    // Build highlighted string segments safely
    let lastIdx = 0;
    const segments = [];
    matches.forEach((m, i) => {
      if (m.index > lastIdx) {
        segments.push(text.slice(lastIdx, m.index));
      }
      segments.push(
        <mark key={i} className="regex-match-hl">
          {m.text}
        </mark>
      );
      lastIdx = m.index + m.text.length;
    });
    if (lastIdx < text.length) {
      segments.push(text.slice(lastIdx));
    }
    return segments;
  }, [regexStr, flags, text, matches]);

  return (
    <div className="tool-container">
      <h2 className="tool-title">Regex Expression Tester</h2>
      <p className="tool-desc">Test JavaScript regular expressions in real-time with highlighted matching groups.</p>

      <div className="regex-inputs">
        <div className="regex-input-row">
          <span className="regex-slash">/</span>
          <input
            type="text"
            className="regex-expression-input"
            placeholder="[a-zA-Z]+"
            value={regexStr}
            onChange={(e) => setRegexStr(e.target.value)}
          />
          <span className="regex-slash">/</span>
          <input
            type="text"
            className="regex-flags-input"
            placeholder="flags"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>

      {matches === null && <div className="error-banner">❌ Invalid Regular Expression Syntax</div>}

      <div className="editor-grid">
        <div className="editor-box">
          <div className="editor-header">Test Text</div>
          <textarea
            className="code-textarea"
            placeholder="Enter body text here to run matches on..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">Highlights</div>
          <div className="regex-highlight-preview code-textarea">
            {renderedText}
          </div>
        </div>
      </div>

      {matches && matches.length > 0 && (
        <div className="diff-output-box">
          <div className="editor-header">Matches Breakdown ({matches.length} found)</div>
          <div className="regex-breakdown-list">
            {matches.map((m, i) => (
              <div key={i} className="regex-match-item">
                <span className="match-num">Match {i + 1}:</span>
                <code className="match-code">"{m.text}"</code>
                <span className="match-index">Index: {m.index}</span>
                {m.groups.length > 0 && (
                  <span className="match-groups">Groups: {m.groups.map(g => `"${g}"`).join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
