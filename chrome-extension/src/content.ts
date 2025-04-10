// Constants
const OVERLAY_ID = 'figma-overlay';
const CONTROLS_ID = 'figma-controls';

// Types
interface FigmaFrame {
    id: string;
    name: string;
    width: number;
    height: number;
    imageUrl: string;
}

interface ModeConfig {
    id: string;
    label: string;
    showOpacity: boolean;
    labelTop?: boolean;
}

// Global state
let state = {
    mode: 'web',
    opacity: 0.5,
    isInitialized: false,
    isVisible: false,
    frames: [] as FigmaFrame[]
};

// UI Constants
const MODES: Record<string, ModeConfig> = {
    WEB: { id: 'web', label: 'Web View', showOpacity: false },
    FIGMA: { id: 'figma', label: 'Figma View', showOpacity: false },
    OVERLAY: { id: 'overlay', label: 'Overlay View', showOpacity: true },
    SPLIT: { id: 'split', label: 'Split View', showOpacity: true },
    BLEND: { id: 'blend', label: 'Blend-Diff View', showOpacity: true, labelTop: true },
    MEASURE: { id: 'measure', label: 'Measure View', showOpacity: true },
    DRAGGABLE: { id: 'draggable', label: 'Draggable View', showOpacity: true, labelTop: true },
};

function toggleUI() {
    console.log('Toggling UI, current state:', state);
    
    // Initialize if not already done
    if (!state.isInitialized) {
        console.log('Initializing comparison...');
        initializeComparison();
    }
    
    // Toggle visibility state
    state.isVisible = !state.isVisible;
    console.log('New visibility state:', state.isVisible);
    
    // Get UI elements
    const controls = document.getElementById(CONTROLS_ID);
    const overlay = document.getElementById(OVERLAY_ID);
    
    // Update visibility
    if (controls) {
        console.log('Updating controls visibility');
        controls.style.display = state.isVisible ? 'flex' : 'none';
    } else {
        console.log('Controls not found, creating...');
        createControlButtons();
    }
    
    if (overlay) {
        console.log('Updating overlay visibility');
        overlay.style.display = state.isVisible ? 'block' : 'none';
    } else {
        console.log('Overlay not found, creating...');
        getOverlay();
    }
}

function createControlButtons() {
    const controls = document.createElement('div');
    controls.id = CONTROLS_ID;
    controls.className = 'design-controls';
    controls.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        display: ${state.isVisible ? 'flex' : 'none'};
        flex-direction: column;
        gap: 16px;
        z-index: 999999;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create mode control group first
    const modeGroup = document.createElement('div');
    modeGroup.className = 'design-controls__group';

    const modeLabel = document.createElement('h6');
    modeLabel.className = 'design-controls__label';
    modeLabel.textContent = `Mode: ${MODES[state.mode.toUpperCase() as keyof typeof MODES].label}`;
    modeLabel.style.cssText = `
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        color: #333;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'design-controls__buttons';
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
    `;

    // SVG icons for each mode
    const modeIcons: Record<keyof typeof MODES, string> = {
        FIGMA: '<svg width="40" height="58" viewBox="0 0 40 58" xmlns="http://www.w3.org/2000/svg"><path d="M0 10.85c0 3.796 1.937 7.136 4.87 9.075A10.86 10.86 0 000 29a10.86 10.86 0 004.87 9.075A10.86 10.86 0 000 47.15C0 53.155 4.89 58 10.833 58c5.998 0 10.932-4.89 10.932-10.949V37.028a10.702 10.702 0 007.255 2.822h.196C35.172 39.85 40 34.992 40 29a10.86 10.86 0 00-4.87-9.075A10.86 10.86 0 0040 10.85C40 4.858 35.172 0 29.216 0H10.784C4.828 0 0 4.858 0 10.85zm29.216 7.3c4.006 0 7.255-3.268 7.255-7.3 0-4.031-3.248-7.299-7.255-7.299h-7.451V18.15h7.45zm-10.98 3.55h-7.452c-4.006 0-7.254 3.27-7.254 7.3 0 4.031 3.249 7.3 7.255 7.3h7.451V21.7zm3.529 7.3c0 4.031 3.248 7.3 7.255 7.3h.196c4.006 0 7.255-3.269 7.255-7.3s-3.248-7.3-7.255-7.3h-.196c-4.007 0-7.255 3.269-7.255 7.3zm-10.98 10.85h7.45v7.201c0 4.073-3.329 7.398-7.402 7.398-4.02 0-7.304-3.28-7.304-7.3 0-4.03 3.249-7.299 7.255-7.299zm7.45-36.299V18.15h-7.45c-4.007 0-7.256-3.268-7.256-7.3 0-4.031 3.249-7.299 7.255-7.299h7.451z" fill-rule="evenodd"></path></svg>',
        WEB: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 17.162L2 18V5.028L14 0v2.507L4 6.697v10.465zm16-8.156v8.635l-8 3.352v-8.635l8-3.352zM22 6l-12 5.028V24l12-5.028V6zM8 9.697l10-4.19V3L6 8.028V21l2-.838V9.697z"></path></svg>',
        SPLIT: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10.935v2.131l-8 3.947v-2.23L21.64 12 16 9.21V6.987l8 3.948zM8 14.783L2.36 12 8 9.21V6.987l-8 3.948v2.131l8 3.947v-2.23zM15.047 4h-2.078L8.958 20h2.073l4.016-16z"></path></svg>',
        DRAGGABLE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 13v4l-6-5 6-5v4h3v2H6zm9-2v2h3v4l6-5-6-5v4h-3zm-4-6v14h2V5h-2z"></path></svg>',
        BLEND: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 2v20L2 2h20zm2-2H0v24h24V0z"></path></svg>',
        OVERLAY: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 9l10 7.675-4.236.71 2.66 5.423L19.983 24l-2.675-5.474L14 21.389V9zM7 2h5V0H7v2zm7 0h3v3h2V0h-5v2zM2 5V2h3V0H0v5h2zm-2 7h2V7H0v5zm5 5H2v-3H0v5h5v-2zM17 7v1.781l2 1.535V7h-2zM7 19h5v-2H7v2z"></path></svg>',
        MEASURE: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 3v5h-1V5h-2v3h-1V5h-2v5h-1V5h-2v3h-1V5h-2v3h-1V5H9v5H8V5H6v3H5V5H2v14h22v2H0V3h24zM10 17v-6H8.859c0 .91-.809 1.07-1.701 1.111v1h1.488V17H10zm5.078-.985v.958H19v-1.306h-1.826c.822-.74 1.722-1.627 1.722-2.782 0-1.146-.763-1.885-1.941-1.885-.642 0-1.288.204-1.833.656l.424 1.148c.352-.279.715-.524 1.168-.524.486 0 .754.255.754.717-.011.774-.861 1.527-2.39 3.018z"></path></svg>'
    };

    Object.values(MODES).forEach(mode => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = `
            position: relative;
            display: inline-block;
        `;

        const button = document.createElement('button');
        button.className = `design-controls__button${state.mode === mode.id ? ' design-controls__button--active' : ''}`;
        button.innerHTML = modeIcons[mode.id.toUpperCase() as keyof typeof MODES];
        button.style.cssText = `
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 4px;
            background: ${state.mode === mode.id ? '#e0e0e0' : '#f0f0f0'};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            padding: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        `;

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'design-controls__tooltip';
        tooltip.textContent = mode.label;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            margin-bottom: 4px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.background = '#e0e0e0';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
            tooltip.style.opacity = '1';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = state.mode === mode.id ? '#e0e0e0' : '#f0f0f0';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            tooltip.style.opacity = '0';
        });

        button.addEventListener('click', () => {
            state.mode = mode.id;
            modeLabel.textContent = `Mode: ${mode.label}`;
            updateComparisonMode();
            
            // Update active state of all buttons
            buttonsContainer.querySelectorAll('.design-controls__button').forEach((btn: Element) => {
                btn.classList.remove('design-controls__button--active');
                (btn as HTMLElement).style.background = '#f0f0f0';
            });
            button.classList.add('design-controls__button--active');
            button.style.background = '#e0e0e0';
            
            // Show/hide opacity slider based on mode
            opacityGroup.style.display = mode.showOpacity ? 'block' : 'none';
        });

        buttonWrapper.appendChild(tooltip);
        buttonWrapper.appendChild(button);
        buttonsContainer.appendChild(buttonWrapper);
    });

    modeGroup.appendChild(modeLabel);
    modeGroup.appendChild(buttonsContainer);

    // Create opacity control group second
    const opacityGroup = document.createElement('div');
    opacityGroup.className = 'design-controls__group controls__group--collapseable';
    opacityGroup.style.display = MODES[state.mode.toUpperCase() as keyof typeof MODES].showOpacity ? 'block' : 'none';
    
    const opacityLabel = document.createElement('h6');
    opacityLabel.className = 'design-controls__label';
    opacityLabel.textContent = 'Overlay Opacity';
    opacityLabel.style.cssText = `
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        color: #333;
    `;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'design-controls__slider';
    sliderContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.id = 'opacity';
    opacitySlider.name = 'opacity';
    opacitySlider.min = '0.01';
    opacitySlider.max = '1';
    opacitySlider.step = '0.01';
    opacitySlider.value = String(state.opacity);
    opacitySlider.className = 'design-controls__range';
    opacitySlider.style.cssText = `
        width: 100px;
        margin: 0;
        -webkit-appearance: none;
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        outline: none;
    `;

    const opacityValue = document.createElement('span');
    opacityValue.className = 'design-controls__value';
    opacityValue.textContent = `${Math.round(state.opacity * 100)}%`;
    opacityValue.style.cssText = `
        font-size: 12px;
        color: #666;
        min-width: 36px;
    `;

    opacitySlider.addEventListener('input', () => {
        state.opacity = Number(opacitySlider.value);
        opacityValue.textContent = `${Math.round(state.opacity * 100)}%`;
        updateComparisonMode();
    });

    sliderContainer.appendChild(opacitySlider);
    sliderContainer.appendChild(opacityValue);
    opacityGroup.appendChild(opacityLabel);
    opacityGroup.appendChild(sliderContainer);

    // Add groups to controls in new order
    controls.appendChild(modeGroup);
    controls.appendChild(opacityGroup);

    document.body.appendChild(controls);
    return controls;
}

function getOverlay(): HTMLElement {
    let overlay = document.getElementById(OVERLAY_ID) as HTMLElement;
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999998;
            display: ${state.isVisible ? 'block' : 'none'};
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}

function updateOverlay(frame: FigmaFrame) {
    const overlay = getOverlay();
    overlay.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = frame.imageUrl;
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;
    
    overlay.appendChild(img);
}

function updateComparisonMode() {
    const overlay = getOverlay();
    
    switch (state.mode) {
        case MODES.WEB.id:
            overlay.style.display = 'none';
            break;
            
        case MODES.FIGMA.id:
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            break;
            
        case MODES.SPLIT.id:
            overlay.style.display = 'block';
            overlay.style.clipPath = 'inset(0 50% 0 0)';
            overlay.style.opacity = '1';
            break;
            
        case MODES.OVERLAY.id:
        case MODES.MEASURE.id:
        case MODES.BLEND.id:
            overlay.style.display = 'block';
            overlay.style.clipPath = 'none';
            overlay.style.opacity = String(state.opacity);
            break;
            
        case MODES.DRAGGABLE.id:
            overlay.style.display = 'block';
            overlay.style.clipPath = 'none';
            overlay.style.opacity = String(state.opacity);
            // Additional draggable functionality can be added here
            break;
    }
}

function initializeComparison() {
    if (state.isInitialized) {
        console.log('UI already initialized');
        return;
    }
    
    createControlButtons();
    getOverlay();
    state.isInitialized = true;
    
    if (state.frames.length > 0) {
        updateOverlay(state.frames[0]);
        updateComparisonMode();
    }
}

// Message handling
function handleMessage(event: MessageEvent) {
    const message = event.data;
    console.log('Received window message:', message);
    
    switch (message.type) {
        case 'INIT_COMPARISON':
            initializeComparison();
            // Send response back
            event.source?.postMessage({ type: 'INIT_COMPARISON_DONE' }, { targetOrigin: '*' });
            break;
            
        case 'FIGMA_FRAMES':
            if (!Array.isArray(message.frames) || message.frames.length === 0) {
                console.error('Invalid frames data received');
                return;
            }
            
            state.frames = message.frames;
            if (!state.isInitialized) {
                initializeComparison();
            }
            updateOverlay(state.frames[0]);
            updateComparisonMode();
            
            // Send response back
            event.source?.postMessage({ type: 'FRAMES_RECEIVED' }, { targetOrigin: '*' });
            break;
    }
}

// Chrome extension message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received chrome message:', message);
    
    switch (message.type) {
        case 'TOGGLE_UI':
            console.log('Handling TOGGLE_UI message');
            toggleUI();
            if (state.frames.length === 0) {
                console.log('No frames loaded yet');
            }
            sendResponse({ success: true, visible: state.isVisible });
            break;
            
        case 'INIT_COMPARISON':
            console.log('Handling INIT_COMPARISON message');
            initializeComparison();
            sendResponse({ success: true });
            break;
            
        case 'FIGMA_FRAMES':
            console.log('Handling FIGMA_FRAMES message', message.frames);
            if (!Array.isArray(message.frames) || message.frames.length === 0) {
                console.error('Invalid frames data received');
                sendResponse({ success: false, error: 'Invalid frames data' });
                return;
            }
            
            state.frames = message.frames;
            if (!state.isInitialized) {
                initializeComparison();
            }
            updateOverlay(state.frames[0]);
            updateComparisonMode();
            sendResponse({ success: true });
            break;
            
        default:
            console.warn('Unknown message type:', message.type);
            sendResponse({ success: false, error: 'Unknown message type' });
    }
    
    return true; // Required for async response
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    window.addEventListener('message', handleMessage);
    
    // Ensure we're ready to receive messages
    chrome.runtime.sendMessage({ type: 'CONTENT_READY' }, (response) => {
        console.log('Content script ready, response:', response);
    });
}); 