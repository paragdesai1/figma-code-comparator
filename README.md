# Figma vs Live Code Comparator

A web-based tool for visually comparing Figma designs with live developed pages. Useful for QA, design-to-dev handoff, and catching pixel-level discrepancies.

## 🔥 Features

- Import Figma designs via URL (no plugin required)
- View side-by-side, overlay, or pixel-diff comparisons
- Zoom, pan, and drag support for detailed inspection
- Visual diff using `pixelmatch` + ScreenshotOne API
- Deployable on [Render.com](https://render.com)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/paragdesai1/figma-code-comparator.git
cd figma-code-comparator
```

### 2. Set up environment

Create a `.env` file:

```env
NEXT_PUBLIC_SCREENSHOTONE_KEY=your_screenshotone_api_key
FIGMA_API_KEY=your_figma_api_key
```

> Get your ScreenshotOne key here: https://screenshotone.com  
> Get your Figma personal token from: https://www.figma.com/developers/api#access-tokens

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Deploying to Render

1. Push this repo to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service:
   - Select your repo
   - Set build command: `npm install && npm run build`
   - Set start command: `npm run start` (or `npm run dev` for testing)
   - Add environment variables from your `.env`

## 🧩 Tech Stack

- React + Tailwind
- Pixelmatch for visual diffing
- ScreenshotOne API for page screenshots
- Figma API for design frames

---

MIT License © 2025 [@paragdesai1](https://github.com/paragdesai1)