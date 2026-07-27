import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hmacKey, setHmacKey] = useState('');
  const [md5, setMd5] = useState('');
  const [sha1, setSha1] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');

  const [hmacMd5, setHmacMd5] = useState('');
  const [hmacSha1, setHmacSha1] = useState('');
  const [hmacSha256, setHmacSha256] = useState('');

  useEffect(() => {
    if (!input) {
      setMd5(''); setSha1(''); setSha256(''); setSha512('');
      setHmacMd5(''); setHmacSha1(''); setHmacSha256('');
      return;
    }

    setMd5(CryptoJS.MD5(input).toString());
    setSha1(CryptoJS.SHA1(input).toString());
    setSha256(CryptoJS.SHA256(input).toString());
    setSha512(CryptoJS.SHA512(input).toString());

    if (hmacKey) {
      setHmacMd5(CryptoJS.HmacMD5(input, hmacKey).toString());
      setHmacSha1(CryptoJS.HmacSHA1(input, hmacKey).toString());
      setHmacSha256(CryptoJS.HmacSHA256(input, hmacKey).toString());
    } else {
      setHmacMd5(''); setHmacSha1(''); setHmacSha256('');
    }
  }, [input, hmacKey]);

  return (
    <div className="tool-container">
      <h2 className="tool-title">Hash & HMAC Generator</h2>
      <p className="tool-desc">Generate cryptographic hash digests and HMAC codes locally in real-time.</p>

      <div className="jwt-layout">
        <div className="editor-box full-width">
          <div className="editor-header">Input Data String</div>
          <textarea
            className="code-textarea single-line-height"
            placeholder="Type your raw input string here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box full-width">
          <div className="editor-header">HMAC Secret Key (Optional)</div>
          <input
            type="text"
            className="regex-expression-input"
            style={{ margin: 16 }}
            placeholder="Enter key to calculate HMAC codes..."
            value={hmacKey}
            onChange={(e) => setHmacKey(e.target.value)}
          />
        </div>

        {input && (
          <div className="diff-output-box">
            <div className="editor-header">Cryptographic Digests</div>
            <div className="regex-breakdown-list" style={{ maxHeight: 'none' }}>
              <div className="regex-match-item">
                <span className="match-num" style={{ width: 80 }}>MD5:</span>
                <code className="match-code">{md5}</code>
              </div>
              <div className="regex-match-item">
                <span className="match-num" style={{ width: 80 }}>SHA-1:</span>
                <code className="match-code">{sha1}</code>
              </div>
              <div className="regex-match-item">
                <span className="match-num" style={{ width: 80 }}>SHA-256:</span>
                <code className="match-code">{sha256}</code>
              </div>
              <div className="regex-match-item">
                <span className="match-num" style={{ width: 80 }}>SHA-512:</span>
                <code className="match-code">{sha512}</code>
              </div>

              {hmacKey && (
                <>
                  <div className="regex-match-item" style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <span className="match-num" style={{ width: 120 }}>HMAC-MD5:</span>
                    <code className="match-code">{hmacMd5}</code>
                  </div>
                  <div className="regex-match-item">
                    <span className="match-num" style={{ width: 120 }}>HMAC-SHA1:</span>
                    <code className="match-code">{hmacSha1}</code>
                  </div>
                  <div className="regex-match-item">
                    <span className="match-num" style={{ width: 120 }}>HMAC-SHA256:</span>
                    <code className="match-code">{hmacSha256}</code>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
