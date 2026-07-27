import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function AESEncryptor() {
  const [input, setInput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = (encrypt) => {
    setError('');
    setOutput('');
    if (!input.trim() || !secretKey.trim()) {
      setError('Please provide input text and a secret key passphrase.');
      return;
    }

    try {
      if (encrypt) {
        setOutput(CryptoJS.AES.encrypt(input, secretKey).toString());
      } else {
        const bytes = CryptoJS.AES.decrypt(input, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
          setError('Failed to decrypt. Ensure your secret key passphrase is correct.');
        } else {
          setOutput(decrypted);
        }
      }
    } catch (err) {
      setError('Error during execution: ' + err.message);
    }
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">AES Encrypt / Decrypt</h2>
      <p className="tool-desc">Securely encrypt and decrypt message strings using Advanced Encryption Standard (AES).</p>

      <div className="json-controls">
        <div className="control-group" style={{ flex: 1 }}>
          <label>Passphrase:</label>
          <input
            type="text"
            className="regex-expression-input"
            placeholder="Secret Passphrase Key..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => handleAction(true)}>Encrypt</button>
          <button className="btn btn-primary" onClick={() => handleAction(false)}>Decrypt</button>
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
            placeholder="Plaintext to encrypt or Ciphertext to decrypt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">
            <span>Result Output</span>
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

      {error && <div className="error-banner">❌ {error}</div>}
    </div>
  );
}
