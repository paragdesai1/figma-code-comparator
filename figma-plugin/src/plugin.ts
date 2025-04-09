interface JiraIssueData {
  title: string;
  description: string;
  type: 'bug' | 'task' | 'improvement';
  priority: 'high' | 'medium' | 'low';
}

interface FrameData {
  id: string;
  name: string;
  width: number;
  height: number;
  imageUrl: string;
}

interface PluginMessage {
  type: 'export-frames' | 'send-to-extension' | 'create-jira-issue' | 'export-result';
  payload?: {
    frames: FrameData[];
  };
  frames?: FrameData[];
  issueData?: JiraIssueData;
  error?: string;
}

/**
 * Exports a Figma frame to an image and returns frame data
 */
export async function exportFrameToImage(frame: FrameNode): Promise<FrameData> {
  try {
    console.log('Starting frame export for:', frame.name, {
      id: frame.id,
      type: frame.type,
      width: frame.width,
      height: frame.height
    });
    
    const settings: ExportSettingsImage = {
      format: 'PNG',
      constraint: { type: 'SCALE', value: 2 }
    };
    
    console.log('Exporting frame with settings:', settings);
    const imageData = await frame.exportAsync(settings);
    console.log('Frame exported, image data size:', imageData.length);
    
    // Convert image data to base64
    const base64Image = figma.base64Encode(imageData);
    console.log('Image converted to base64, length:', base64Image.length);
    
    const frameData: FrameData = {
      id: frame.id,
      name: frame.name,
      width: frame.width,
      height: frame.height,
      imageUrl: `data:image/png;base64,${base64Image}`
    };
    
    console.log('Frame data prepared:', {
      id: frameData.id,
      name: frameData.name,
      width: frameData.width,
      height: frameData.height,
      imageUrlLength: frameData.imageUrl.length
    });
    
    return frameData;
  } catch (error) {
    console.error('Error in exportFrameToImage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to export frame "${frame.name}": ${errorMessage}`);
  }
}

/**
 * Compares two Figma frames and returns the differences
 */
export function compareFrames(frame1: any, frame2: any) {
  // Validate frames
  if (!frame1 || !frame2) {
    throw new Error('Both frames must be provided for comparison');
  }

  // Compare basic properties
  const differences = {
    size: frame1.width !== frame2.width || frame1.height !== frame2.height,
    position: frame1.x !== frame2.x || frame1.y !== frame2.y,
    // Add more comparison points as needed
  };

  return differences;
}

/**
 * Creates a Jira issue with the provided data
 */
export async function createJiraIssue(issueData: JiraIssueData) {
  try {
    const response = await fetch('YOUR_JIRA_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your authentication headers here
      },
      body: JSON.stringify({
        fields: {
          project: { key: 'YOUR_PROJECT_KEY' },
          summary: issueData.title,
          description: issueData.description,
          issuetype: { name: issueData.type },
          priority: { name: issueData.priority }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Jira issue');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    throw error;
  }
}

// Add event handlers for the plugin UI
figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    console.log('Plugin received raw message:', msg);
    console.log('Message type:', msg?.type);
    console.log('Message structure:', {
      hasType: 'type' in msg,
      type: msg?.type,
      keys: Object.keys(msg || {})
    });
    
    if (!msg || !msg.type) {
      throw new Error('Invalid message format: missing type');
    }
    
    if (msg.type === 'export-frames') {
      console.log('Starting export-frames process...');
      const selection = figma.currentPage.selection;
      console.log('Current selection:', {
        count: selection.length,
        types: selection.map(node => node.type),
        names: selection.map(node => node.name)
      });
      
      // Check if any frames are selected
      if (selection.length === 0) {
        console.log('No frames selected');
        figma.notify('Please select at least one frame to export');
        figma.ui.postMessage({ type: 'export-result', error: 'No frames selected' });
        return;
      }

      // Filter for only frame nodes
      const frames = selection.filter(node => node.type === 'FRAME') as FrameNode[];
      console.log('Found frames:', {
        count: frames.length,
        frames: frames.map(f => ({ name: f.name, id: f.id, type: f.type }))
      });
      
      if (frames.length === 0) {
        console.log('No frame nodes in selection');
        figma.notify('Please select at least one frame (not other elements)');
        figma.ui.postMessage({ type: 'export-result', error: 'No frame nodes selected' });
        return;
      }

      // Export all selected frames
      console.log('Starting export of frames...');
      const frameDataPromises = frames.map(frame => exportFrameToImage(frame));
      
      console.log('Waiting for all frame exports to complete...');
      const frameData = await Promise.all(frameDataPromises);
      
      if (!frameData || frameData.length === 0) {
        throw new Error('No frame data was generated during export');
      }
      
      console.log('All frames exported:', {
        count: frameData.length,
        frames: frameData.map(f => ({
          name: f.name,
          id: f.id,
          dimensions: `${f.width}x${f.height}`,
          hasImageUrl: !!f.imageUrl,
          imageUrlLength: f.imageUrl.length
        }))
      });

      // Validate frame data before sending
      const validFrames = frameData.every(frame => 
        frame &&
        typeof frame.id === 'string' &&
        typeof frame.name === 'string' &&
        typeof frame.width === 'number' &&
        typeof frame.height === 'number' &&
        typeof frame.imageUrl === 'string' &&
        frame.imageUrl.startsWith('data:image/png;base64,')
      );

      if (!validFrames) {
        throw new Error('Some frames failed validation');
      }

      // Send frame data to UI
      const message: PluginMessage = {
        type: 'export-result',
        payload: {
          frames: frameData
        }
      };
      
      console.log('Preparing to send message to UI:', {
        type: message.type,
        frameCount: frameData.length,
        frames: frameData.map(f => ({
          name: f.name,
          id: f.id,
          hasImageUrl: !!f.imageUrl,
          imageUrlLength: f.imageUrl.length
        }))
      });
      
      console.log('Sending postMessage to UI...');
      figma.ui.postMessage(message);
      console.log('Message sent to UI');
      
      figma.notify(`Successfully exported ${frames.length} frame${frames.length > 1 ? 's' : ''}`);
    }

    if (msg.type === 'send-to-extension') {
      try {
        // Validate frames before sending
        if (!msg.frames || !Array.isArray(msg.frames)) {
          throw new Error('No frames provided to send to extension');
        }

        // Validate each frame has required properties
        const validFrames = msg.frames.every(frame => 
          frame &&
          typeof frame.id === 'string' &&
          typeof frame.name === 'string' &&
          typeof frame.width === 'number' &&
          typeof frame.height === 'number' &&
          typeof frame.imageUrl === 'string'
        );

        if (!validFrames) {
          throw new Error('Invalid frame data');
        }

        // Send frame data to UI for extension with a different message type
        figma.ui.postMessage({
          type: 'frames-ready-for-extension',
          frames: msg.frames
        });
        
        console.log('Sent frames to extension:', {
          frameCount: msg.frames.length,
          frames: msg.frames.map(f => ({
            name: f.name,
            id: f.id,
            hasImageUrl: !!f.imageUrl
          }))
        });
        
        figma.notify('Frames sent to Chrome extension');
      } catch (error) {
        console.error('Error sending frames to extension:', error);
        figma.notify('Error sending frames to extension');
        figma.ui.postMessage({
          type: 'export-result',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    }

    if (msg.type === 'create-jira-issue' && msg.issueData) {
      try {
        const result = await createJiraIssue(msg.issueData);
        figma.ui.postMessage({
          type: 'jira-issue-created',
          issue: result
        });
        figma.notify('Jira issue created successfully');
      } catch (error) {
        figma.notify('Error creating Jira issue');
        console.error(error);
      }
    }
  } catch (error) {
    console.error('Error in plugin message handler:', error);
    figma.notify('Error processing message');
    figma.ui.postMessage({
      type: 'export-result',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}; 