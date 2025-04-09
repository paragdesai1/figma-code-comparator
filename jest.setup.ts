/// <reference types="@figma/plugin-typings" />
/// <reference types="jest" />
import { jest, beforeAll, beforeEach } from '@jest/globals';
import type { PluginAPI, PageNode, DocumentNode } from '@figma/plugin-typings';

// Define the webpack-injected HTML variable
declare global {
  namespace NodeJS {
    interface Global {
      __html__: string;
      figma: PluginAPI;
    }
  }
}

// Create a properly typed mock of the Figma API
const mockFigma: Partial<PluginAPI> = {
  ui: {
    postMessage: jest.fn(),
    onmessage: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    resize: jest.fn(),
    reposition: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn()
  },
  currentPage: {
    selection: [],
    appendChild: jest.fn(),
    type: 'PAGE',
    id: 'mock-page-id',
    name: 'Mock Page',
    visible: true,
    locked: false,
    children: [],
    clone: jest.fn(),
    remove: jest.fn(),
    parent: null,
    guides: [],
    backgrounds: [],
    fills: [],
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'CENTER',
    exportSettings: [],
    effects: [],
    effectStyleId: '',
    constraints: { horizontal: 'MIN', vertical: 'MIN' }
  } as unknown as PageNode,
  viewport: {
    scrollAndZoomIntoView: jest.fn(),
    center: { x: 0, y: 0 },
    zoom: 1,
    bounds: { x: 0, y: 0, width: 800, height: 600 }
  },
  notify: jest.fn(),
  createRectangle: jest.fn(),
  createFrame: jest.fn(),
  createText: jest.fn(),
  closePlugin: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  root: { type: 'DOCUMENT', children: [] } as unknown as DocumentNode,
  mixed: Symbol('mixed') as unknown as typeof figma.mixed,
  editorType: 'figma',
  showUI: jest.fn(),
  createComponent: jest.fn(),
  createPage: jest.fn(),
  currentUser: null,
  clientStorage: {
    getAsync: jest.fn(),
    setAsync: jest.fn()
  },
  getNodeById: jest.fn(),
  getStyleById: jest.fn(),
  importComponentByKeyAsync: jest.fn(),
  importStyleByKeyAsync: jest.fn(),
  loadFontAsync: jest.fn(),
  base64Encode: jest.fn(),
  fileKey: 'mock-file-key'
} as PluginAPI;

// Set up the global mocks
global.__html__ = '<div>Mock UI</div>';
global.figma = mockFigma;
global.fetch = jest.fn(() => Promise.resolve(new Response()));

// Set up test lifecycle hooks
beforeAll(() => {
  jest.resetModules();
});

beforeEach(() => {
  jest.clearAllMocks();
  global.figma.currentPage.selection = [];
}); 