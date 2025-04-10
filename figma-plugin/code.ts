/// <reference types="@figma/plugin-typings" />

import { compareFrames } from './comparison';
import { createJiraIssue, uploadScreenshot } from './services/api';

interface PluginMessage {
  type: 'get-selection' | 'export-frames' | 'select-nodes';
  payload?: any;
}

interface UIMessage {
  type: 'selection-result' | 'export-result' | 'error';
  payload: any;
}

interface FrameInfo {
  id: string;
  name: string;
  width: number;
  height: number;
  imageUrl?: string;
}

// Show UI with a reasonable size
figma.showUI(__html__, { width: 400, height: 600 });

// Handle messages from the UI
figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    switch (msg.type) {
      case 'get-selection':
        handleFrameSelection();
        break;

      case 'export-frames':
        await handleFrameExport();
        break;

      case 'select-nodes':
        handleNodeSelection(msg.payload);
        break;
    }
  } catch (error: unknown) {
    figma.ui.postMessage({
      type: 'error',
      payload: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

// Handle frame selection
function handleFrameSelection() {
  const selection = figma.currentPage.selection;
  const frames = selection.filter(node => node.type === 'FRAME');
  
  if (frames.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      payload: 'Please select at least one frame to export'
    });
    return;
  }

  figma.ui.postMessage({
    type: 'selection-result',
    payload: {
      frames: frames.map(frame => ({
        id: frame.id,
        name: frame.name,
        width: frame.width,
        height: frame.height
      }))
    }
  });
}

// Handle frame export
async function handleFrameExport() {
  const selection = figma.currentPage.selection;
  const frames = selection.filter(node => node.type === 'FRAME');
  
  if (frames.length === 0) {
    throw new Error('No frames selected');
  }

  const exportedFrames: FrameInfo[] = [];

  // Export each frame as PNG
  for (const frame of frames) {
    try {
      const bytes = await frame.exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      });

      // Convert bytes to base64 for data URL
      const base64 = figma.base64Encode(bytes);
      const imageUrl = `data:image/png;base64,${base64}`;

      exportedFrames.push({
        id: frame.id,
        name: frame.name,
        width: frame.width,
        height: frame.height,
        imageUrl
      });
    } catch (error) {
      console.error(`Failed to export frame ${frame.name}:`, error);
    }
  }

  figma.ui.postMessage({
    type: 'export-result',
    payload: { frames: exportedFrames }
  });
}

// Handle node selection
function handleNodeSelection(nodeIds: string[]) {
  const nodes = nodeIds
    .map(id => figma.getNodeById(id))
    .filter((node): node is SceneNode => node !== null);
  
  if (nodes.length > 0) {
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
}

// Cleanup when the plugin is closed
figma.on('close', () => {
  // Add any cleanup code here
}); 