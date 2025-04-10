const fs = require('fs');
const path = require('path');

// Files to update
const FILES = {
    PACKAGE: path.join(__dirname, '../package.json'),
    MANIFEST: path.join(__dirname, '../manifest.json'),
    CHANGELOG: path.join(__dirname, '../../CHANGELOG.md')
};

// Read current version from package.json
const packageJson = JSON.parse(fs.readFileSync(FILES.PACKAGE, 'utf8'));
const currentVersion = packageJson.version;

// Update manifest.json
const manifestJson = JSON.parse(fs.readFileSync(FILES.MANIFEST, 'utf8'));
manifestJson.version = currentVersion;
fs.writeFileSync(FILES.MANIFEST, JSON.stringify(manifestJson, null, 2));

// Check if version exists in CHANGELOG.md
const changelog = fs.readFileSync(FILES.CHANGELOG, 'utf8');
if (!changelog.includes(`## [${currentVersion}]`)) {
    console.error(`Warning: Version ${currentVersion} not found in CHANGELOG.md`);
    console.error('Please update the changelog with the new version details.');
    process.exit(1);
}

console.log(`✓ Version ${currentVersion} synchronized across all files`); 