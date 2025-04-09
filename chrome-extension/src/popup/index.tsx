import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function Popup() {
  const [isComparing, setIsComparing] = useState(false);

  const startComparison = () => {
    setIsComparing(true);
    chrome.runtime.sendMessage({ type: 'START_COMPARISON' });
  };

  return (
    <div className="popup-container">
      <h1>Figma Design Comparator</h1>
      
      <div className="instructions">
        <p>Compare your Figma designs with live websites:</p>
        <ol>
          <li>Open your Figma design</li>
          <li>Navigate to the website you want to compare</li>
          <li>Click "Start Comparison" below</li>
        </ol>
      </div>

      <button 
        className="start-button"
        onClick={startComparison}
        disabled={isComparing}
      >
        {isComparing ? 'Comparison Active' : 'Start Comparison'}
      </button>

      {isComparing && (
        <div className="controls-info">
          <p>Controls are now available on the webpage:</p>
          <ul>
            <li>Use the opacity slider to adjust overlay visibility</li>
            <li>Toggle the overlay on/off</li>
            <li>Capture differences to compare</li>
          </ul>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
); 