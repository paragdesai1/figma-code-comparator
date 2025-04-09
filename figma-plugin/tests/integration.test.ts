/// <reference types="@figma/plugin-typings" />
/// <reference types="jest" />

import { jest, describe, beforeEach, it, expect } from '@jest/globals';

type JestMockFn = ReturnType<typeof jest.fn>;

declare global {
  namespace NodeJS {
    interface Global {
      parent: {
        postMessage: JestMockFn;
      };
      figma: {
        ui: {
          postMessage: JestMockFn;
          onmessage: JestMockFn;
        };
        currentPage: {
          selection: any[];
        };
        notify: JestMockFn;
        closePlugin: JestMockFn;
        showUI: JestMockFn;
        base64Encode: JestMockFn;
        fileKey: string;
        on: JestMockFn;
      };
    }
  }
}

describe('Figma Plugin Integration', () => {
  let mockPostMessage: JestMockFn;
  let mockNotify: JestMockFn;
  let mockClosePlugin: JestMockFn;
  let mockExportAsync: JestMockFn;
  let onMessageHandler: (msg: any) => Promise<void>;

  beforeEach(() => {
    jest.resetModules();
    
    // Mock window.parent.postMessage for web app communication
    mockPostMessage = jest.fn();
    (global as any).parent = {
      postMessage: mockPostMessage
    };

    // Mock Figma's plugin API
    mockNotify = jest.fn();
    mockClosePlugin = jest.fn();
    mockExportAsync = jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));

    (global as any).figma = {
      ui: {
        postMessage: jest.fn(),
        onmessage: undefined
      },
      currentPage: {
        selection: []
      },
      notify: mockNotify,
      closePlugin: mockClosePlugin,
      showUI: jest.fn(),
      base64Encode: jest.fn().mockReturnValue('mock-base64'),
      fileKey: 'mock-file-key',
      on: jest.fn()
    };

    // Import the plugin module and get the message handler
    require('../src/plugin');
    onMessageHandler = (global as any).figma.ui.onmessage;
  });

  describe('Frame Export Integration', () => {
    it('should handle export-frames message', async () => {
      // Create mock frame
      const mockFrame = {
        type: 'FRAME',
        id: 'frame-123',
        name: 'Test Frame',
        width: 800,
        height: 600,
        exportAsync: mockExportAsync
      };

      // Set mock frame as selected
      (global as any).figma.currentPage.selection = [mockFrame];

      // Simulate web app sending export-frames message
      await onMessageHandler({ type: 'export-frames' });

      // Verify frame export was attempted
      expect(mockExportAsync).toHaveBeenCalledWith({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      });

      // Verify correct message was sent back to UI
      expect((global as any).figma.ui.postMessage).toHaveBeenCalledWith({
        type: 'export-result',
        payload: {
          frames: [{
            id: 'frame-123',
            name: 'Test Frame',
            width: 800,
            height: 600,
            imageUrl: expect.stringContaining('data:image/png;base64,')
          }]
        }
      });
    });

    it('should handle no frame selected', async () => {
      // Clear selection
      (global as any).figma.currentPage.selection = [];

      // Simulate web app sending export-frames message
      await onMessageHandler({ type: 'export-frames' });

      // Verify error notification
      expect(mockNotify).toHaveBeenCalledWith('Please select at least one frame to export');
      expect((global as any).figma.ui.postMessage).toHaveBeenCalledWith({
        type: 'export-result',
        error: 'No frames selected'
      });
    });

    it('should handle non-frame selection', async () => {
      // Set non-frame element as selected
      (global as any).figma.currentPage.selection = [{
        type: 'RECTANGLE',
        id: 'rect-123',
        name: 'Test Rectangle'
      }];

      // Simulate web app sending export-frames message
      await onMessageHandler({ type: 'export-frames' });

      // Verify error notification
      expect(mockNotify).toHaveBeenCalledWith('Please select at least one frame (not other elements)');
      expect((global as any).figma.ui.postMessage).toHaveBeenCalledWith({
        type: 'export-result',
        error: 'No frame nodes selected'
      });
    });

    it('should handle export error', async () => {
      // Create mock frame that throws on export
      const mockFrame = {
        type: 'FRAME',
        id: 'frame-123',
        name: 'Test Frame',
        width: 800,
        height: 600,
        exportAsync: jest.fn().mockRejectedValue(new Error('Export failed'))
      };

      // Set mock frame as selected
      (global as any).figma.currentPage.selection = [mockFrame];

      // Simulate web app sending export-frames message
      await onMessageHandler({ type: 'export-frames' });

      // Verify error handling
      expect(mockNotify).toHaveBeenCalledWith('Error processing message');
      expect((global as any).figma.ui.postMessage).toHaveBeenCalledWith({
        type: 'export-result',
        error: 'Failed to export frame "Test Frame": Export failed'
      });
    });
  });
}); 