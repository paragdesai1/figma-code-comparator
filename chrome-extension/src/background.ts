let figmaConnection: { connected: boolean; tabId?: number } = {
  connected: false
};

// Single message listener for all extension messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  switch (message.type) {
    case 'checkConnection':
      sendResponse({ connected: figmaConnection.connected });
      return false;
      
    case 'START_COMPARISON':
      // Notify content script to initialize comparison UI
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          console.log('Sending INIT_COMPARISON to tab:', tabs[0].id);
          chrome.tabs.sendMessage(tabs[0].id, { type: 'INIT_COMPARISON' }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, error: 'No active tab found' });
        }
      });
      return true;

    case 'FIGMA_FRAMES':
      // Forward frames to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          console.log('Forwarding frames to content script:', message.frames);
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'FIGMA_FRAMES',
            frames: message.frames
          }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, error: 'No active tab found' });
        }
      });
      return true;

    case 'figma-frames':
      // Forward the frames to the active tab's content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, {
            type: 'figma-frames',
            frames: message.frames
          }, response => {
            console.log('Content script response:', response);
            sendResponse(response);
          });
        } else {
          console.error('No active tab found');
          sendResponse({ success: false, error: 'No active tab found' });
        }
      });
      
      // Required for async response
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

// Listen for messages from the Figma plugin
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('Received external message:', message, 'from:', sender);
  
  switch (message.type) {
    case 'figmaConnect':
      figmaConnection.connected = true;
      figmaConnection.tabId = sender.tab?.id;
      sendResponse({ success: true });
      
      // Notify popup about connection
      chrome.runtime.sendMessage({
        type: 'connectionUpdate',
        connected: true
      });
      break;
    
    case 'send-to-extension':
      // Validate frame data
      if (!message.frames || !Array.isArray(message.frames)) {
        console.error('Invalid frame data received:', message);
        sendResponse({ success: false, error: 'Invalid frame data' });
        return true;
      }

      console.log('Received frames from Figma:', message.frames);

      // Forward frames to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          console.log('Forwarding frames to content script:', message.frames);
          chrome.tabs.sendMessage(activeTab.id, {
            type: 'FIGMA_FRAMES',
            frames: message.frames
          }, (response) => {
            console.log('Content script response:', response);
            sendResponse({ success: true });
          });
        } else {
          console.error('No active tab found');
          sendResponse({ success: false, error: 'No active tab found' });
        }
      });
      return true;

    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
  return true;
});

// Function to handle capturing and comparing differences
async function handleCaptureDifferences() {
  try {
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    // Capture the current tab
    const screenshot = await chrome.tabs.captureVisibleTab();

    // Send the screenshot to the content script for overlay
    chrome.tabs.sendMessage(tab.id, {
      type: 'UPDATE_OVERLAY',
      payload: { imageUrl: screenshot }
    });

  } catch (error) {
    console.error('Error capturing differences:', error);
  }
}

chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) return;
    
    chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_UI'
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}); 