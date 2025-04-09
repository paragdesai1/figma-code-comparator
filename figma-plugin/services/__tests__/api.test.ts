/**
 * @jest-environment jsdom
 */

import { createJiraIssue, uploadScreenshot } from '../api';

class MockResponse {
  private readonly _ok: boolean;
  private readonly _status: number;
  private readonly _data: any;

  constructor(data: any, init?: ResponseInit) {
    this._ok = init?.status ? init.status >= 200 && init.status < 300 : true;
    this._status = init?.status || 200;
    this._data = data;
  }

  get ok() {
    return this._ok;
  }

  get status() {
    return this._status;
  }

  async json() {
    return JSON.parse(this._data);
  }
}

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('createJiraIssue', () => {
    const mockPayload = {
      title: 'Test Issue',
      description: 'Test Description',
      screenshots: ['url1', 'url2'],
      differences: [
        { type: 'size', description: 'Size mismatch' }
      ]
    };

    it('should successfully create a Jira issue', async () => {
      const mockResponse = { issueKey: 'TEST-123' };
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockResolvedValueOnce(new MockResponse(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ issueKey: 'TEST-123' });
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        'http://localhost:3000/api/jira/issues',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPayload),
        }
      );
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to create issue';
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ error: errorMessage }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }));

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle network errors', async () => {
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockRejectedValueOnce(new Error('Network error'));

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('uploadScreenshot', () => {
    const mockImageData = new Uint8Array([1, 2, 3]);

    it('should successfully upload a screenshot', async () => {
      const mockResponse = { url: 'https://example.com/image.png' };
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockResolvedValueOnce(new MockResponse(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ url: 'https://example.com/image.png' });
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        'http://localhost:3000/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    it('should handle upload errors', async () => {
      const errorMessage = 'Failed to upload';
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ error: errorMessage }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }));

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle network errors during upload', async () => {
      mockFetch
        .mockResolvedValueOnce(new MockResponse(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockRejectedValueOnce(new Error('Network error'));

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });
}); 