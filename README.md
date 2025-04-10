# Figma Code Comparator

A powerful tool for comparing Figma designs with live websites, inspired by Pixelay. This project consists of a Figma plugin and Chrome extension that work together to provide accurate visual comparison between designs and implementations.

## Features

- Compare Figma designs with live websites in real-time
- Multiple comparison modes:
  - Overlay with adjustable opacity
  - Split view with draggable divider
  - Difference highlighting
  - Side-by-side comparison
- Support for responsive design testing
- Built-in measurement tools and guides
- Works with any website (local development, staging, or production)

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

## Version Control

This project uses a comprehensive versioning system that allows for complete snapshots of the codebase to be saved and recalled. Each version (vx.x) captures the entire state of the project, making it easy to track changes and revert when needed.

### Saving a Version

To save the current state as a new version:
```bash
git saveversion vx.x
```
This will:
1. Add all changes to git
2. Create a commit with the message "Save version vx.x"
3. Create an annotated tag for that version

### Managing Versions

View all versions:
```bash
git tag -l          # List all version tags
git tag -n          # List versions with descriptions
```

Compare versions:
```bash
git diff vx.x vy.y  # Show differences between versions
```

### Reverting to a Version

To view a specific version:
```bash
git checkout vx.x
```

To revert to a specific version:
```bash
git reset --hard vx.x
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Pixelay Figma plugin
- Built with React, TypeScript, and Tailwind CSS
- Uses Figma Plugin API and Chrome Extension APIs