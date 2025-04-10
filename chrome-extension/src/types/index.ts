// UI Mode Configuration
export interface ModeConfig {
    id: string;
    label: string;
    showOpacity: boolean;
    labelTop: boolean;
}

// Figma Frame Structure
export interface FigmaFrame {
    id: string;
    name: string;
    imageUrl: string;
    width: number;
    height: number;
}

// Extension Message Types
export type MessageType = 
    | 'TOGGLE_UI'
    | 'INIT_COMPARISON'
    | 'FIGMA_FRAMES'
    | 'CONTENT_READY'
    | 'UPDATE_MODE'
    | 'UPDATE_OPACITY';

export interface ExtensionMessage {
    type: MessageType;
    payload?: any;
}

// UI State Interface
export interface UIState {
    currentMode: string;
    opacity: number;
    splitPosition: number;
    isDragging: boolean;
    currentFrameIndex: number;
    isVisible: boolean;
}

// Constants
export const MODES = {
    FIGMA: { id: 'figma', label: 'Figma View', showOpacity: false, labelTop: true },
    WEB: { id: 'web', label: 'Web View', showOpacity: false, labelTop: true },
    MEASURE: { id: 'measure', label: 'Measure View', showOpacity: false, labelTop: true },
    OVERLAY: { id: 'overlay', label: 'Overlay View', showOpacity: true, labelTop: true },
    SPLIT: { id: 'split', label: 'Split View', showOpacity: false, labelTop: true },
    BLEND: { id: 'blend', label: 'Blend-Diff View', showOpacity: true, labelTop: true },
    DRAGGABLE: { id: 'draggable', label: 'Draggable View', showOpacity: true, labelTop: true }
} as const;

// Element IDs
export const UI_ELEMENT_IDS = {
    OVERLAY: 'figma-overlay',
    CONTROLS: 'figma-controls',
    MEASURE_GRID: 'measure-grid',
    SPLIT_HANDLE: 'split-handle'
} as const;

// Style Constants
export const UI_STYLES = {
    BUTTON: {
        DEFAULT: {
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            background: '#f0f0f0',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        HOVER: {
            background: '#e0e0e0',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
        },
        ACTIVE: {
            background: '#e0e0e0'
        }
    },
    TOOLTIP: {
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
    }
} as const; 