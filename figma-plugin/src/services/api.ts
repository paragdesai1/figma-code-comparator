interface JiraIssueData {
  title: string;
  description: string;
  type: 'bug' | 'task' | 'improvement';
  priority: 'high' | 'medium' | 'low';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createJiraIssue(issueData: JiraIssueData): Promise<ApiResponse<{ issueKey: string }>> {
  try {
    const response = await fetch('http://localhost:3000/api/jira/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to create Jira issue'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export async function uploadScreenshot(imageData: Uint8Array): Promise<ApiResponse<{ url: string }>> {
  try {
    const formData = new FormData();
    const blob = new Blob([imageData], { type: 'image/png' });
    formData.append('file', blob, 'screenshot.png');

    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to upload screenshot'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
} 