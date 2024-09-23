import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


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
 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [encryptedEmojis, setEncryptedEmojis] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');
  const [manualEncryptedInput, setManualEncryptedInput] = useState('');
  const [isEncryptionView, setIsEncryptionView] = useState(true); 
  const headerRef = useRef(null);


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

/**Encryption process**/
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

/**Decryption process**/
  const handleDecrypt = () => {
    try {
      let unemojified = manualEncryptedInput;
      for (const emoji in emojiMap) {
        unemojified = unemojified.replace(new RegExp(emojiMap[emoji], 'g'), emoji);
      }
      const bytes = CryptoJS.AES.decrypt(unemojified, decryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Invalid decryption key or corrupted message.');
      }
  
      setDecryptedMessage(decrypted);
      setError('');  
    } catch (err) {
      
      setError('Decryption failed. Invalid key or Message.');
    }
  };
  
/**Clipborad**/
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy the message.');
      });
  };

/**Share Message**/
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


  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      header.style.animation = 'moveHeader 10s linear infinite';
    }
   

    return () => {
      if (header) {
        header.style.animation = ''; 
      }
    };
  }, []); 

  
  return (
  <div className="container">
      <header className="header" ref={headerRef}>
        <h1>Emoji Encryption Messenger</h1>
      </header>

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
             <div>
              <label htmlFor="message-encrypt">Message</label>
              <input
                type="text"
                placeholder='E.g: "Hello world"'
                id="message-encrypt"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
      <div>
        <label htmlFor="key-encrypt">Enter Key</label>
        <div className="password-container">
         
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="password"
            id="key-encrypt"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility} 
            className="eye-icon"
          />
        
          
        </div>
      </div>
            <button onClick={handleEncrypt}>Encrypt</button>

            {encryptedEmojis && (
              <div>
                <h3>Encrypted Message (Emojis)</h3>
                <p>{encryptedEmojis}</p>
                <button onClick={() => copyToClipboard(encryptedEmojis)}>
                  Copy message
                </button>

                <button onClick={() => shareMessage(encryptedEmojis)}>
                  Share message
                </button>
              </div>
            )}
            
            {error && <p style={{ color: 'red' }}>{error}</p>} 
          </div>

        ) : (
          <div className="decryption-section">
            
            <div>
              <label htmlFor="encrypted-message-decrypt">Message in Emojis</label>
              <textarea
                id="encrypted-message-decrypt"
                placeholder="Message in Emojis"
                value={manualEncryptedInput}
                onChange={(e) => setManualEncryptedInput(e.target.value)}
              />
            </div>
          <div>
          <label htmlFor="key-decrypt">Enter Key</label>
         <div className="password-container">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="password"
            id="key-decrypt"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
          />
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility} 
            className="eye-icon"
          />
        </div>
      </div>
            <button onClick={handleDecrypt}>Decrypt</button>

            {decryptedMessage && (
              <div>
                <h4>Decrypted Message:</h4>
                <p>{decryptedMessage}</p>
                <button onClick={() => copyToClipboard(decryptedMessage)}>Copy Decrypted Message</button>
              </div>
            )}
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
        
      </div>
      <footer className="footer">
        <p>Made in @{new Date().getFullYear()}</p>
      </footer>

     
    </div>
  );
}

export default App;
