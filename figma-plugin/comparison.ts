interface ComparisonResult {
  differences: {
    type: 'size' | 'position' | 'color' | 'text' | 'missing';
    node1?: SceneNode;
    node2?: SceneNode;
    description: string;
  }[];
}

export async function compareFrames(frame1: FrameNode, frame2: FrameNode): Promise<ComparisonResult> {
  const differences: ComparisonResult['differences'] = [];

  // Compare basic properties
  if (frame1.width !== frame2.width || frame1.height !== frame2.height) {
    differences.push({
      type: 'size',
      node1: frame1,
      node2: frame2,
      description: `Size mismatch: ${frame1.name} (${frame1.width}x${frame1.height}) vs ${frame2.name} (${frame2.width}x${frame2.height})`
    });
  }

  // Create maps of nodes by name for efficient lookup
  const frame1Nodes = new Map<string, SceneNode>();
  const frame2Nodes = new Map<string, SceneNode>();

  frame1.findAll().forEach(node => {
    if (node.name) frame1Nodes.set(node.name, node);
  });

  frame2.findAll().forEach(node => {
    if (node.name) frame2Nodes.set(node.name, node);
  });

  // Compare nodes
  for (const [name, node1] of frame1Nodes) {
    const node2 = frame2Nodes.get(name);

    if (!node2) {
      differences.push({
        type: 'missing',
        node1: node1,
        description: `Node "${name}" exists in ${frame1.name} but not in ${frame2.name}`
      });
      continue;
    }

    // Compare positions
    if (node1.x !== node2.x || node1.y !== node2.y) {
      differences.push({
        type: 'position',
        node1: node1,
        node2: node2,
        description: `Position mismatch for "${name}": (${node1.x},${node1.y}) vs (${node2.x},${node2.y})`
      });
    }

    // Compare text content
    if (node1.type === 'TEXT' && node2.type === 'TEXT') {
      if (node1.characters !== node2.characters) {
        differences.push({
          type: 'text',
          node1: node1,
          node2: node2,
          description: `Text content mismatch for "${name}"`
        });
      }
    }

    // Compare fills (colors)
    if ('fills' in node1 && 'fills' in node2) {
      const fill1 = node1.fills as Paint[];
      const fill2 = node2.fills as Paint[];
      
      if (fill1.length > 0 && fill2.length > 0) {
        if (fill1[0].type === 'SOLID' && fill2[0].type === 'SOLID') {
          const color1 = fill1[0];
          const color2 = fill2[0];
          if (color1.color.r !== color2.color.r ||
              color1.color.g !== color2.color.g ||
              color1.color.b !== color2.color.b) {
            differences.push({
              type: 'color',
              node1: node1,
              node2: node2,
              description: `Color mismatch for "${name}"`
            });
          }
        }
      }
    }
  }

  // Check for nodes that exist in frame2 but not in frame1
  for (const [name, node2] of frame2Nodes) {
    if (!frame1Nodes.has(name)) {
      differences.push({
        type: 'missing',
        node2: node2,
        description: `Node "${name}" exists in ${frame2.name} but not in ${frame1.name}`
      });
    }
  }

  return { differences };
} 