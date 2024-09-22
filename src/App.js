import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'; 

const emojiMap = {
  'a': '🍎', 'b': '🍌', 'c': '🏎', 'd': '🚪', 'e': '👁', 'f': '👣', 'g': '😀', 'h': '🖐',
  'i': 'ℹ', 'j': '😂', 'k': '🥋', 'l': '✉', 'm': '🚹', 'n': '🌉', 'o': '👌', 'p': '🍍',
  'q': '👑', 'r': '👉', 's': '🎤', 't': '🚰', 'u': '☂', 'v': '🐍', 'w': '💧', 'x': '✖',
  'y': '☀', 'z': '🦓', 'A': '🏹', 'B': '🎈', 'C': '😎', 'D': '🎅', 'E': '🐘', 'F': '🌿',
  'G': '🌏', 'H': '🌪', 'I': '☃', 'J': '🍵', 'K': '🍴', 'L': '🚨', 'M': '📮', 'N': '🕹',
  'O': '📂', 'P': '🛩', 'Q': '⌨', 'R': '🔄', 'S': '🔬', 'T': '🐅', 'U': '🙃', 'V': '🐎',
  'W': '🌊', 'X': '🚫', 'Y': '❓', 'Z': '⏩', '0': '😁', '1': '😆', '2': '💵', '3': '🤣',
  '4': '☺', '5': '😊', '6': '😇', '7': '😡', '8': '🎃', '9': '😍', '+': '✅', '/': '🔪',
  '=': '🗒'
};

function App() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [encryptedEmojis, setEncryptedEmojis] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');
  const [manualEncryptedInput, setManualEncryptedInput] = useState('');
  const [isEncryptionView, setIsEncryptionView] = useState(true); // Toggle view
  

  const handleEncrypt = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(message, key).toString();
      const emojis = encrypted.split('').map(char => emojiMap[char] || char).join('');
      setEncryptedEmojis(emojis);
      setError('');
    } catch (err) {
      setError('Encryption failed. Please check your key and message.');
    }
  };

  const handleDecrypt = () => {
    try {
      let unemojified = manualEncryptedInput;
      for (const emoji in emojiMap) {
        unemojified = unemojified.replace(new RegExp(emojiMap[emoji], 'g'), emoji);
      }
      const bytes = CryptoJS.AES.decrypt(unemojified, decryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedMessage(decrypted);
      setError('');
    } catch (err) {
      setError('Decryption failed. Please check your key and encrypted message.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy the message.');
      });
  };

  const shareMessage = (text) => {
    if (navigator.share) {
      navigator.share({
        title: 'Encrypted Message',
        text,
      })
      .then(() => alert('Message shared successfully!'))
      .catch((error) => alert('Sharing failed: ' + error.message));
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  return (
  
    
     
    <div className="container">
      
      <div className="head">
        <h1>Emoji Encryption Messenger</h1>
      </div>
      
      <div className="toggle-buttons">
        <button
          className={isEncryptionView ? 'active' : ''}
          onClick={() => setIsEncryptionView(true)}
        >
          Encryption
        </button>
        <button
          className={!isEncryptionView ? 'active' : ''}
          onClick={() => setIsEncryptionView(false)}
        >
          Decryption
        </button>
      </div>

      <div className={`content ${isEncryptionView ? 'show-encryption' : 'show-decryption'}`}>
        {isEncryptionView ? (
          <div className="encryption-section">
            <h2>🔒Encryption</h2>
            <div>
              <label htmlFor="message-encrypt">Message:</label>
              <input
                type="text"
                id="message-encrypt"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="key-encrypt">🔑Key (Size: 16, 24, or 32 characters):</label>
              <input
                type="text"
                id="key-encrypt"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <button onClick={handleEncrypt}>Encrypt</button>

            {encryptedEmojis && (
              <div>
                <h3>Encrypted Message (Emojis):</h3>
                <p>{encryptedEmojis}</p>
                <button onClick={() => copyToClipboard(encryptedEmojis)}>Copy Encrypted Message</button>
                <button onClick={() => shareMessage(encryptedEmojis)}>Share Encrypted Message</button>
              </div>
            )}
          </div>
        ) : (
          <div className="decryption-section">
            <h2>🔓Decryption</h2>
            <div>
              <label htmlFor="encrypted-message-decrypt">Encrypted Message (Emojis):</label>
              <textarea
                id="encrypted-message-decrypt"
                value={manualEncryptedInput}
                onChange={(e) => setManualEncryptedInput(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="key-decrypt">🔑Decryption Key:</label>
              <input
                type="text"
                id="key-decrypt"
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
              />
            </div>
            <button onClick={handleDecrypt}>Decrypt</button>

            {decryptedMessage && (
              <div>
                <h3>Decrypted Message:</h3>
                <p>{decryptedMessage}</p>
                <button onClick={() => copyToClipboard(decryptedMessage)}>Copy Decrypted Message</button>
              </div>
            )}
          </div>
        )}
        
      </div>
      <footer className="footer">
        <p>Made in @{new Date().getFullYear()}</p>
      </footer>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
