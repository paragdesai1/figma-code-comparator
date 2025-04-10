# Figma Code Comparator

A Chrome extension for comparing Figma designs with live websites, inspired by Pixelay. This tool helps developers and designers ensure pixel-perfect implementation of designs.

## Features

- Compare Figma designs with live websites in real-time
- Multiple comparison modes with enhanced UI controls:
  - Figma view for design reference
  - Web view for implementation
  - Measure mode with grid overlay
  - Overlay mode with adjustable opacity
  - Split view with draggable divider
  - Blend-diff view for highlighting differences
  - Draggable mode for precise positioning
- Intuitive control panel with:
  - Mode-specific tooltips
  - Smooth hover transitions
  - Visual feedback on active states
  - Responsive opacity controls
- Support for responsive design testing
- Built-in measurement tools and guides
- Works with any website (local development, staging, or production)

## Project Structure

```
figma-code-comparator/
├── chrome-extension/     # Chrome extension code
│   ├── manifest.json    # Extension manifest
│   ├── src/            # Source code
│   │   ├── content.ts  # Content script for overlay
│   │   ├── popup.tsx   # Extension popup
│   │   └── types/      # TypeScript types
│   └── public/         # Static assets
└── web/                # Web interface (Next.js)
    └── pages/          # Application pages
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/figma-code-comparator.git
   cd figma-code-comparator
   ```

2. Install dependencies:
   ```bash
   # Install Chrome extension dependencies
   cd chrome-extension
   npm install

   # Install web interface dependencies
   cd ../web
   npm install
   ```

3. Build the project:
   ```bash
   # Build Chrome extension
   cd chrome-extension
   npm run build

   # Build web interface
   cd ../web
   npm run build
   ```

### Development Setup

1. Load the Chrome extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-extension` directory

2. Start the web interface:
   ```bash
   cd web
   npm run dev
   ```

## Usage

1. Navigate to your Figma design in Chrome
2. Click the Figma Code Comparator extension icon
3. Choose your comparison mode
4. Use the overlay controls to adjust the view

## Features

- Drag the split view divider to compare different parts of the design
- Use the opacity slider in overlay mode
- Enable measurement guides to check spacing and alignment
- Switch between comparison modes to find differences

## Version History

### v1.2.0
- Enhanced UI controls with improved visual feedback
- Added smooth hover transitions and tooltips
- Implemented consistent button styling across modes
- Updated documentation to reflect UI changes

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

Please review our [Security Policy](SECURITY.md) for guidelines on reporting vulnerabilities and best practices.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Pixelay Figma plugin
- Built with React, TypeScript, and Tailwind CSS
- Uses Figma Plugin API and Chrome Extension APIs