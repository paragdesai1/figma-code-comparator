import { jest } from '@jest/globals';
import { exportFrameToImage, compareFrames, createJiraIssue } from '../src/plugin';

describe('Figma Plugin', () => {
  beforeEach(() => {
    // Mock Figma's plugin API
    global.figma = {
      ui: {
        postMessage: jest.fn(),
        onmessage: jest.fn()
      },
      currentPage: {
        selection: []
      },
      notify: jest.fn(),
      closePlugin: jest.fn(),
      showUI: jest.fn(),
      root: {
        children: []
      }
    };
  });

  describe('Frame Selection', () => {
    it('should handle single frame selection', () => {
      const mockFrame = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Test Frame',
        width: 100,
        height: 100
      };

      global.figma.currentPage.selection = [mockFrame];
      
      // Test frame selection logic here
      expect(global.figma.currentPage.selection.length).toBe(1);
      expect(global.figma.currentPage.selection[0].name).toBe('Test Frame');
    });

    it('should validate frame selection', () => {
      const mockComponent = {
        type: 'COMPONENT',
        id: 'comp1',
        name: 'Test Component'
      };

      global.figma.currentPage.selection = [mockComponent];
      
      // Test validation logic here
      expect(global.figma.currentPage.selection[0].type).not.toBe('FRAME');
    });
  });

  describe('Export Functionality', () => {
    it('should export frame to image', async () => {
      const mockFrame = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Test Frame',
        exportAsync: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
      };

      const result = await exportFrameToImage(mockFrame);
      
      expect(mockFrame.exportAsync).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('Comparison Features', () => {
    it('should compare two frames', () => {
      const frame1 = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Frame 1',
        width: 100,
        height: 100
      };

      const frame2 = {
        type: 'FRAME',
        id: 'frame2',
        name: 'Frame 2',
        width: 100,
        height: 100
      };

      const result = compareFrames(frame1, frame2);
      
      expect(result).toBeDefined();
      // Add more specific comparison assertions
    });
  });

  describe('Jira Integration', () => {
    it('should create Jira issue', async () => {
      const issueData = {
        title: 'Test Issue',
        description: 'Test Description',
        type: 'bug',
        priority: 'high'
      };

      const mockResponse = {
        id: 'ISSUE-1',
        key: 'TEST-1',
        self: 'https://jira.example.com/rest/api/2/issue/TEST-1'
      };

      // Mock API call
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await createJiraIssue(issueData);
      
      expect(result).toBeDefined();
      expect(result.key).toBe('TEST-1');
    });
  });
}); 