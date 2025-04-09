// Simple state
const state = {
  mode: 'figma',
  opacity: 0.5
};

const OVERLAY_ID = 'figma-overlay';
const CONTROLS_ID = 'figma-controls';

// Create basic overlay
function createOverlay() {
  const existingOverlay = document.getElementById(OVERLAY_ID);
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: ${state.opacity};
    pointer-events: none;
    z-index: 999999;
    transition: all 0.3s ease;
  `;

  document.body.appendChild(overlay);
  return overlay;
}

// Create controls with mode buttons and opacity slider
function createControls() {
  const existingControls = document.getElementById(CONTROLS_ID);
  if (existingControls) {
    existingControls.remove();
  }

  const controls = document.createElement('div');
  controls.id = CONTROLS_ID;
  controls.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000000;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  // Create mode buttons
  const modes = [
    {
      name: 'Browser',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12C9.5 11.32 9.56 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8 8M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8M12 2C6.47 2 2 6.5 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>
      </svg>`
    },
    {
      name: 'Code',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8.7 15.9L4.8 12L8.7 8.1C9.09 7.71 9.09 7.09 8.7 6.7C8.31 6.31 7.69 6.31 7.3 6.7L2.7 11.3C2.31 11.69 2.31 12.31 2.7 12.7L7.3 17.3C7.69 17.69 8.31 17.69 8.7 17.3C9.09 16.91 9.09 16.29 8.7 15.9ZM15.3 15.9L19.2 12L15.3 8.1C14.91 7.71 14.91 7.09 15.3 6.7C15.69 6.31 16.31 6.31 16.7 6.7L21.3 11.3C21.69 11.69 21.69 12.31 21.3 12.7L16.7 17.3C16.31 17.69 15.69 17.69 15.3 17.3C14.91 16.91 14.91 16.29 15.3 15.9Z" fill="currentColor"/>
      </svg>`
    },
    {
      name: 'Figma',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 5H9C7.34 5 6 6.34 6 8C6 9.66 7.34 11 9 11H15C16.66 11 18 9.66 18 8C18 6.34 16.66 5 15 5ZM15 9H9C8.45 9 8 8.55 8 8C8 7.45 8.45 7 9 7H15C15.55 7 16 7.45 16 8C16 8.55 15.55 9 15 9ZM15 11H9C7.34 11 6 12.34 6 14C6 15.66 7.34 17 9 17H15C16.66 17 18 15.66 18 14C18 12.34 16.66 11 15 11ZM15 15H9C8.45 15 8 14.55 8 14C8 13.45 8.45 13 9 13H15C15.55 13 16 13.45 16 14C16 14.55 15.55 15 15 15ZM9 17C7.34 17 6 18.34 6 20C6 21.66 7.34 23 9 23C10.66 23 12 21.66 12 20V17H9Z" fill="currentColor"/>
      </svg>`
    },
    {
      name: 'Split',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 4V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V4C2 2.9 2.9 2 4 2H16C17.1 2 18 2.9 18 4ZM13.5 12L16 9.5V4H4V20H16V14.5L13.5 12ZM22 6V18C22 19.1 21.1 20 20 20H19V18H20V6H19V4H20C21.1 4 22 4.9 22 6Z" fill="currentColor"/>
      </svg>`
    },
    {
      name: 'Blend',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
        <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" fill="currentColor"/>
        <path d="M12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="currentColor"/>
      </svg>`
    }
  ];

  modes.forEach(mode => {
    const button = document.createElement('div');
    button.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    `;

    const iconButton = document.createElement('button');
    iconButton.innerHTML = mode.icon;
    iconButton.title = mode.name;
    iconButton.style.cssText = `
      width: 40px;
      height: 40px;
      padding: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: ${state.mode === mode.name.toLowerCase() ? '#18A0FB' : '#F5F5F5'};
      color: ${state.mode === mode.name.toLowerCase() ? '#FFFFFF' : '#333333'};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;

    const label = document.createElement('span');
    label.textContent = mode.name;
    label.style.cssText = `
      font-size: 10px;
      color: #333333;
      text-align: center;
    `;

    button.appendChild(iconButton);
    button.appendChild(label);

    iconButton.addEventListener('mouseover', () => {
      if (state.mode !== mode.name.toLowerCase()) {
        iconButton.style.background = '#E8E8E8';
      }
    });

    iconButton.addEventListener('mouseout', () => {
      if (state.mode !== mode.name.toLowerCase()) {
        iconButton.style.background = '#F5F5F5';
      }
    });

    iconButton.addEventListener('click', () => {
      const newMode = mode.name.toLowerCase();
      state.mode = newMode;
      
      // Update all button styles
      controls.querySelectorAll('button').forEach(btn => {
        btn.style.background = btn === iconButton ? '#18A0FB' : '#F5F5F5';
        btn.style.color = btn === iconButton ? '#FFFFFF' : '#333333';
      });

      // Update overlay based on mode
      const overlay = document.getElementById(OVERLAY_ID);
      if (overlay) {
        switch (newMode) {
          case 'browser':
            overlay.style.display = 'none';
            break;
          case 'figma':
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            overlay.style.clipPath = 'none';
            break;
          case 'split':
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            overlay.style.clipPath = 'inset(0 50% 0 0)';
            break;
          case 'blend':
            overlay.style.display = 'block';
            overlay.style.opacity = state.opacity.toString();
            overlay.style.clipPath = 'none';
            break;
        }
      }

      // Show/hide opacity slider based on mode
      slider.style.display = newMode === 'browser' ? 'none' : 'block';
    });

    controls.appendChild(button);
  });

  // Create opacity slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '1';
  slider.step = '0.1';
  slider.value = state.opacity.toString();
  slider.style.cssText = `
    width: 100px;
    margin-left: 8px;
    accent-color: #18A0FB;
    display: ${state.mode === 'browser' ? 'none' : 'block'};
  `;

  slider.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    state.opacity = parseFloat(target.value);
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.style.opacity = state.opacity.toString();
    }
  });

  controls.appendChild(slider);
  document.body.appendChild(controls);
}

// Initialize everything
function initialize() {
  console.log('Initializing overlay and controls');
  createOverlay();
  createControls();
}

// Initialize when the content script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Basic message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  if (message.type === 'INIT_COMPARISON') {
    initialize();
    sendResponse({ success: true });
  }
  return true;
}); 