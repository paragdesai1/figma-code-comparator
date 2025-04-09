import { NextApiRequest, NextApiResponse } from 'next';

interface JiraCredentials {
  email: string;
  apiToken: string;
  baseUrl: string;
}

interface JiraIssue {
  summary: string;
  description: string;
  projectKey: string;
  issueType: string;
  priority?: string;
  labels?: string[];
  attachments?: string[];
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  screenshot?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { credentials, issue }: { credentials: JiraCredentials; issue: JiraIssue } = req.body;

  try {
    const response = await createJiraIssue(credentials, issue);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create Jira issue', error });
  }
}

async function createJiraIssue(credentials: JiraCredentials, issue: JiraIssue) {
  const auth = Buffer.from(`${credentials.email}:${credentials.apiToken}`).toString('base64');

  // Create the issue
  const issueResponse = await fetch(`${credentials.baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        project: {
          key: issue.projectKey
        },
        summary: issue.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: issue.description
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Coordinates: X: ${issue.coordinates?.x}, Y: ${issue.coordinates?.y}, Width: ${issue.coordinates?.width}, Height: ${issue.coordinates?.height}`
                }
              ]
            }
          ]
        },
        issuetype: {
          name: issue.issueType
        },
        priority: issue.priority ? {
          name: issue.priority
        } : undefined,
        labels: issue.labels
      }
    })
  });

  const issueData = await issueResponse.json();

  // If there's a screenshot, attach it
  if (issue.screenshot) {
    const formData = new FormData();
    formData.append('file', dataURItoBlob(issue.screenshot), 'screenshot.png');

    await fetch(`${credentials.baseUrl}/rest/api/3/issue/${issueData.key}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'X-Atlassian-Token': 'no-check'
      },
      body: formData
    });
  }

  return issueData;
}

function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
} 