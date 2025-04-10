import '@testing-library/jest-dom';
import { jest, beforeEach } from '@jest/globals';

type JestFn = ReturnType<typeof jest.fn>;

// Define types for our mocks
interface FigmaMock {
  ui: {
    postMessage: JestFn;
    onmessage: JestFn;
  };
  closePlugin: JestFn;
  notify: JestFn;
  showUI: JestFn;
  root: {
    children: any[];
  };
  currentPage: {
    selection: any[];
  };
  getNodeById?: JestFn;
}

// Mock the Figma plugin API
const figmaMock: FigmaMock = {
  ui: {
    postMessage: jest.fn(),
    onmessage: jest.fn(),
  },
  closePlugin: jest.fn(),
  notify: jest.fn(),
  showUI: jest.fn(),
  root: {
    children: [],
  },
  currentPage: {
    selection: [],
  },
  getNodeById: jest.fn(),
};

declare global {
  interface Window {
    fetch: JestFn;
  }
  // eslint-disable-next-line no-var
  var figma: FigmaMock;
  // eslint-disable-next-line no-var
  var __html__: string;
}

// Assign mocks to global object
globalThis.figma = figmaMock;
globalThis.__html__ = '';

// Mock fetch API
beforeEach(() => {
  Object.defineProperty(globalThis, 'fetch', {
    value: jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      } as Response)
    ),
    writable: true,
  });
}); 