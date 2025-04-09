interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CreateJiraIssuePayload {
  title: string;
  description: string;
  screenshots: string[];
  differences: {
    type: string;
    description: string;
  }[];
}

const NEXT_APP_URL = 'http://localhost:3000'; // We'll make this configurable later

async function checkServerConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${NEXT_APP_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function createJiraIssue(payload: CreateJiraIssuePayload): Promise<ApiResponse<{ issueKey: string }>> {
  try {
    const isServerRunning = await checkServerConnection();
    if (!isServerRunning) {
      return {
        success: false,
        error: 'Cannot connect to the server. Please ensure the Next.js app is running on http://localhost:3000'
      };
    }

    const response = await fetch(`${NEXT_APP_URL}/api/jira/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create Jira issue'
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function uploadScreenshot(imageData: Uint8Array): Promise<ApiResponse<{ url: string }>> {
  try {
    const isServerRunning = await checkServerConnection();
    if (!isServerRunning) {
      return {
        success: false,
        error: 'Cannot connect to the server. Please ensure the Next.js app is running on http://localhost:3000'
      };
    }

    const formData = new FormData();
    const blob = new Blob([imageData], { type: 'image/png' });
    formData.append('file', blob, 'screenshot.png');

    const response = await fetch(`${NEXT_APP_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to upload screenshot'
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
} 