// Test overlay for Figma frame
async function testFigmaOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Create iframe to embed Figma
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/VN801FaugcLPamAF605HB5/Untitled?node-id=24-6318';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: white;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: white;
        color: black;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000000;
    `;

    closeButton.onclick = () => overlay.remove();

    overlay.appendChild(iframe);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
}

// Initialize test
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Figma Overlay';
    testButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999998;
        padding: 10px;
        background: #18A0FB;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    
    testButton.onclick = testFigmaOverlay;
    document.body.appendChild(testButton);
}); 