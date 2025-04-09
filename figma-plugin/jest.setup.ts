/// <reference types="@figma/plugin-typings" />
import { jest } from '@jest/globals';

declare module globalThis {
  var figma: FigmaMock;
  var fetch: jest.Mock;
  var __html__: string;
}

type FigmaMock = {
  closePlugin: jest.Mock;
  notify: jest.Mock;
  createRectangle: jest.Mock;
  createText: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  showUI: jest.Mock;
  base64Encode: jest.Mock;
  fileKey: string;
  ui: {
    postMessage: jest.Mock;
    onmessage: jest.Mock | undefined;
    show: jest.Mock;
    hide: jest.Mock;
    resize: jest.Mock;
    close: jest.Mock;
  };
  viewport: {
    scrollAndZoomIntoView: jest.Mock;
  };
  currentPage: {
    selection: any[];
  };
}

interface ExportSettingsImage {
  format: 'JPG' | 'PNG';
  contentsOnly?: boolean;
  useAbsoluteBounds?: boolean;
  suffix?: string;
  constraint?: {
    type: 'SCALE' | 'WIDTH' | 'HEIGHT';
    value: number;
  };
}

const mockFigma: FigmaMock = {
  closePlugin: jest.fn(),
  notify: jest.fn(),
  createRectangle: jest.fn(),
  createText: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  showUI: jest.fn(),
  base64Encode: jest.fn(),
  fileKey: 'mock-file-key',
  ui: {
    postMessage: jest.fn(),
    onmessage: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    resize: jest.fn(),
    close: jest.fn(),
  },
  viewport: {
    scrollAndZoomIntoView: jest.fn(),
  },
  currentPage: {
    selection: [],
  },
};

globalThis.__html__ = '<div>Mock Plugin UI</div>';
globalThis.figma = mockFigma;
globalThis.fetch = jest.fn(() => Promise.resolve(new Response()));

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.figma.currentPage.selection = [];
}); 