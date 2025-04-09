// Mock the webpack-injected HTML
(global as any).__html__ = '<div>Mock UI</div>';

// Re-export everything from the actual plugin
export * from '../../src/plugin'; 