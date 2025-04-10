# Contributing to Figma Code Comparator

Thank you for your interest in contributing! This guide will help you maintain consistency across the project.

## Development Setup

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Chrome browser
   - Figma desktop app
   - VSCode (recommended)

2. **Recommended VSCode Extensions**
   - ESLint
   - Prettier
   - TypeScript Next
   - Auto Rename Tag
   - Code Spell Checker
   - Color Highlight
   - Path Intellisense
   - Tailwind CSS IntelliSense

3. **Initial Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/figma-code-comparator.git
   cd figma-code-comparator/chrome-extension

   # Install dependencies
   npm install
   
   # Setup pre-commit hooks
   npm run prepare
   ```

## Development Workflow

1. **Before Starting**
   - Ensure you're on the latest version: `git pull`
   - Create a new branch: `git checkout -b feature/your-feature`

2. **During Development**
   - Run in development mode: `npm run dev`
   - Format code: `npm run format`
   - Check types: `npm run type-check`
   - Run tests: `npm test`

3. **Before Committing**
   - Lint code: `npm run lint`
   - Fix lint issues: `npm run lint:fix`
   - Ensure version sync: `npm run sync-version`

## Project Structure

- `src/types/` - TypeScript interfaces and types
- `src/config/` - Constants and configurations
- `src/components/` - React components
- `src/utils/` - Utility functions
- `src/styles/` - CSS and style definitions

## Coding Standards

1. **TypeScript**
   - Use strict mode
   - Define types for all variables
   - Avoid `any` type
   - Use interfaces for object shapes

2. **React**
   - Use functional components
   - Implement proper prop types
   - Follow hooks rules
   - Keep components focused

3. **Styling**
   - Use Tailwind CSS classes
   - Follow color palette in `constants.ts`
   - Maintain consistent spacing
   - Use defined breakpoints

4. **Version Control**
   - Write clear commit messages
   - Update CHANGELOG.md
   - Sync version numbers
   - Tag releases properly

## Making Changes

1. **Code Style**
   - EditorConfig handles basic formatting
   - Prettier enforces consistent style
   - ESLint catches potential issues
   - Follow existing patterns

2. **UI Changes**
   - Match existing design patterns
   - Use constants from `constants.ts`
   - Test responsive behavior
   - Consider accessibility

3. **Documentation**
   - Update README.md if needed
   - Add JSDoc comments
   - Update CHANGELOG.md
   - Document breaking changes

## Submitting Changes

1. **Before Pull Request**
   - Run all tests
   - Update documentation
   - Check version numbers
   - Review CHANGELOG.md

2. **Pull Request Process**
   - Use clear PR title
   - Describe changes made
   - Reference related issues
   - Add screenshots if UI changes

## Version Management

1. **Updating Version**
   ```bash
   # Update version in package.json
   npm version patch|minor|major

   # Sync version across files
   npm run sync-version
   ```

2. **Creating Release**
   ```bash
   # Tag version
   git tag -a vX.X.X -m "Version X.X.X: Description"

   # Push changes
   git push origin vX.X.X
   ```

## Need Help?

- Review existing issues
- Check documentation
- Ask for clarification
- Follow code examples

Thank you for contributing and maintaining our high standards of consistency! 