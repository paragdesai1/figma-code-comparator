// Extension Configuration
export const CONFIG = {
    DEBUG: process.env.NODE_ENV === 'development',
    MIN_OPACITY: 0,
    MAX_OPACITY: 1,
    DEFAULT_OPACITY: 0.5,
    ANIMATION_DURATION: 200, // ms
    TOOLTIP_DELAY: 500, // ms
    MIN_CONTROL_WIDTH: 40,
    MIN_CONTROL_HEIGHT: 40,
    GRID_SIZE: 8, // px
    SPLIT_HANDLE_WIDTH: 4, // px
} as const;

// Z-Index Layers
export const Z_INDEX = {
    BASE: 1000,
    OVERLAY: 1001,
    CONTROLS: 1002,
    TOOLTIP: 1003,
    MODAL: 1004,
} as const;

// Color Palette
export const COLORS = {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    GRAY: {
        50: '#F9FAFB',
        100: '#F0F0F0',
        200: '#E0E0E0',
        300: '#D1D1D1',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },
    OVERLAY: {
        BACKGROUND: 'rgba(0, 0, 0, 0.8)',
        TEXT: 'rgba(255, 255, 255, 0.9)',
    }
} as const;

// Media Queries
export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    SETTINGS: 'figma-comparator-settings',
    LAST_MODE: 'figma-comparator-last-mode',
    OPACITY: 'figma-comparator-opacity',
} as const;

// Event Names
export const EVENTS = {
    MODE_CHANGE: 'figma-comparator-mode-change',
    OPACITY_CHANGE: 'figma-comparator-opacity-change',
    FRAME_CHANGE: 'figma-comparator-frame-change',
    UI_TOGGLE: 'figma-comparator-ui-toggle',
} as const; 