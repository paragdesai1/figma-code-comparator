/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { FrameNode } from '@figma/plugin-typings';
import { exportFrameToImage, compareFrames } from '../src/plugin';

describe('Plugin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportFrameToImage', () => {
    it('should export frame data correctly', async () => {
      const mockFrame: Partial<FrameNode> = {
        id: 'test-frame',
        name: 'Test Frame',
        width: 100,
        height: 100,
        type: 'FRAME',
        exportAsync: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
      };

      const result = await exportFrameToImage(mockFrame as FrameNode);

      expect(result).toEqual({
        id: 'test-frame',
        name: 'Test Frame',
        width: 100,
        height: 100,
        imageUrl: expect.any(String)
      });
      expect(mockFrame.exportAsync).toHaveBeenCalledWith({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      });
    });
  });

  describe('compareFrames', () => {
    it('should compare frames correctly', () => {
      const frame1: Partial<FrameNode> = { width: 100, height: 100 };
      const frame2: Partial<FrameNode> = { width: 200, height: 200 };

      const result = compareFrames(frame1 as FrameNode, frame2 as FrameNode);

      expect(result).toEqual({
        widthDiff: 100,
        heightDiff: 100,
        scaleFactor: 2
      });
    });
  });
}); 