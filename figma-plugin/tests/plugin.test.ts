import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { ExportSettingsImage } from '@figma/plugin-typings';
import { exportFrameToImage, compareFrames, createJiraIssue } from '../src/plugin';

// Define types for testing
interface FrameNode {
  type: string;
  id: string;
  name: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  exportAsync?: jest.Mock;
}

interface JiraIssueData {
  title: string;
  description: string;
  type: 'bug' | 'task' | 'improvement';
  priority: 'high' | 'medium' | 'low';
}

describe('Figma Plugin', () => {
  beforeEach(() => {
    // Mock Figma's plugin API
    (global as any).figma = {
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
      base64Encode: jest.fn().mockReturnValue('mock-base64-data'),
      root: {
        children: []
      }
    };
  });

  describe('Frame Selection', () => {
    it('should handle single frame selection', () => {
      const mockFrame: FrameNode = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Test Frame',
        width: 100,
        height: 100
      };

      (global as any).figma.currentPage.selection = [mockFrame];
      
      expect((global as any).figma.currentPage.selection.length).toBe(1);
      expect((global as any).figma.currentPage.selection[0].name).toBe('Test Frame');
    });

    it('should validate frame selection', () => {
      const mockComponent: FrameNode = {
        type: 'COMPONENT',
        id: 'comp1',
        name: 'Test Component',
        width: 100,
        height: 100
      };

      (global as any).figma.currentPage.selection = [mockComponent];
      
      expect((global as any).figma.currentPage.selection[0].type).not.toBe('FRAME');
    });
  });

  describe('Export Functionality', () => {
    it('should export frame to image', async () => {
      const exportAsyncMock = jest.fn().mockResolvedValue(Buffer.from([1, 2, 3]));
      const mockFrame: FrameNode = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Test Frame',
        width: 100,
        height: 100,
        exportAsync: exportAsyncMock
      };

      const result = await exportFrameToImage(mockFrame as any);
      
      expect(exportAsyncMock).toHaveBeenCalledWith({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      } as ExportSettingsImage);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('imageUrl');
    });
  });

  describe('Comparison Features', () => {
    it('should compare two frames', () => {
      const frame1: FrameNode = {
        type: 'FRAME',
        id: 'frame1',
        name: 'Frame 1',
        width: 100,
        height: 100,
        x: 0,
        y: 0
      };

      const frame2: FrameNode = {
        type: 'FRAME',
        id: 'frame2',
        name: 'Frame 2',
        width: 100,
        height: 100,
        x: 0,
        y: 0
      };

      const result = compareFrames(frame1 as any, frame2 as any);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('size');
      expect(result).toHaveProperty('position');
      expect(result.size).toBe(false); // Same size
      expect(result.position).toBe(false); // Same position
    });
  });

  describe('Jira Integration', () => {
    it('should create Jira issue', async () => {
      const issueData: JiraIssueData = {
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

      // Mock fetch API
      const mockFetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        } as Response)
      );
      (global as any).fetch = mockFetch;

      const result = await createJiraIssue(issueData);
      
      expect(result).toBeDefined();
      expect(result.key).toBe('TEST-1');
      expect(mockFetch).toHaveBeenCalledWith(
        'YOUR_JIRA_API_ENDPOINT',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });
}); 