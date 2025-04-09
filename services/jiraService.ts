interface JiraSettings {
  email: string;
  apiToken: string;
  baseUrl: string;
  projectKey: string;
}

interface JiraIssuePayload {
  title: string;
  description: string;
  type: string;
  priority: string;
  screenshot?: string;
}

export class JiraService {
  private settings: JiraSettings;

  constructor(settings: JiraSettings) {
    this.settings = settings;
  }

  private getAuthHeaders(): Headers {
    const headers = new Headers();
    headers.append('Authorization', `Basic ${btoa(`${this.settings.email}:${this.settings.apiToken}`)}`);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return headers;
  }

  async createIssue(payload: JiraIssuePayload): Promise<any> {
    try {
      const response = await fetch(`${this.settings.baseUrl}/rest/api/2/issue/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          fields: {
            project: {
              key: this.settings.projectKey
            },
            summary: payload.title,
            description: payload.description,
            issuetype: {
              name: payload.type
            },
            priority: {
              name: payload.priority
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create Jira issue: ${errorData.errorMessages?.join(', ')}`);
      }

      const data = await response.json();
      
      // If there's a screenshot, attach it to the issue
      if (payload.screenshot) {
        await this.attachScreenshot(data.key, payload.screenshot);
      }

      return data;
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  private async attachScreenshot(issueKey: string, screenshot: string): Promise<void> {
    try {
      // Convert base64 screenshot to blob
      const base64Data = screenshot.split(',')[1];
      const binaryData = atob(base64Data);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', blob, 'screenshot.png');

      const response = await fetch(
        `${this.settings.baseUrl}/rest/api/2/issue/${issueKey}/attachments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.settings.email}:${this.settings.apiToken}`)}`,
            'X-Atlassian-Token': 'no-check'
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to attach screenshot to Jira issue');
      }
    } catch (error) {
      console.error('Error attaching screenshot:', error);
      throw error;
    }
  }

  async validateSettings(): Promise<boolean> {
    try {
      const response = await fetch(`${this.settings.baseUrl}/rest/api/2/myself`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating Jira settings:', error);
      return false;
    }
  }
} 