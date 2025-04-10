# Figma Code Comparator

A powerful tool for comparing Figma designs with live websites, inspired by Pixelay. This project consists of a Figma plugin and Chrome extension that work together to provide accurate visual comparison between designs and implementations.

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

## Version History

### v1.2.0
- Enhanced UI controls with improved visual feedback
- Added smooth hover transitions and tooltips
- Implemented consistent button styling across modes
- Updated documentation to reflect UI changes

## Project Structure

```
figma-code-comparator/
├── chrome-extension/     # Chrome extension code
│   ├── manifest.json    # Extension manifest
│   ├── background.js    # Background script
│   ├── content.js       # Content script for overlay
│   └── popup.html       # Extension popup
├── figma-plugin/        # Figma plugin code
│   ├── manifest.json    # Plugin manifest
│   ├── code.ts         # Plugin main code
│   └── ui.html         # Plugin UI
└── web/                 # Web interface (Next.js)
    └── pages/
        └── index.tsx    # Main comparison interface
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser
- Figma desktop app

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

   # Install Figma plugin dependencies
   cd ../figma-plugin
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

   # Build Figma plugin
   cd ../figma-plugin
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

2. Import the Figma plugin:
   - Open Figma desktop app
   - Go to Plugins > Development > Import plugin from manifest
   - Select the `figma-plugin/manifest.json` file

3. Start the web interface:
   ```bash
   cd web
   npm run dev
   ```

## Usage

1. In Figma:
   - Select the frames or components you want to compare
   - Run the Figma Code Comparator plugin
   - Click "Export Selection" to prepare the designs for comparison

2. In Chrome:
   - Navigate to the website you want to compare
   - Click the Figma Code Comparator extension icon
   - Choose your comparison mode
   - Use the overlay controls to adjust the view

3. Features:
   - Drag the split view divider to compare different parts of the design
   - Use the opacity slider in overlay mode
   - Enable measurement guides to check spacing and alignment
   - Switch between comparison modes to find differences

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

When contributing, please ensure all changes maintain synchronization across:
- Version numbers in package.json and manifest.json
- UI/Design elements and controls
- Documentation and README
- Code implementation and comments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Pixelay Figma plugin
- Built with React, TypeScript, and Tailwind CSS
- Uses Figma Plugin API and Chrome Extension APIs