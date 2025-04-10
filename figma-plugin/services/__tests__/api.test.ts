import { createJiraIssue, uploadScreenshot } from '../api';

describe('API Service', () => {
  const mockFetch = global.fetch as jest.Mock;

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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
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
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage })
      });

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await createJiraIssue(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('uploadScreenshot', () => {
    const mockImageData = new Uint8Array([1, 2, 3]);

    it('should successfully upload a screenshot', async () => {
      const mockResponse = { url: 'https://example.com/image.png' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });

    it('should handle upload errors', async () => {
      const errorMessage = 'Failed to upload';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage })
      });

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle network errors during upload', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await uploadScreenshot(mockImageData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });
}); 