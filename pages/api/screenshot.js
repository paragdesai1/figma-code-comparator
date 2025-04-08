export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    // Use ScreenshotOne API for fallback screenshots
    const screenshotOneKey = process.env.NEXT_PUBLIC_SCREENSHOTONE_KEY || 'demo';
    const screenshotUrl = `https://api.screenshotone.com/take?access_key=${screenshotOneKey}&url=${encodeURIComponent(url)}&full_page=true&format=png`;

    const response = await fetch(screenshotUrl);
    
    if (!response.ok) {
      throw new Error(`Screenshot API returned ${response.status}`);
    }

    // Forward the image response
    const imageBuffer = await response.buffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.send(imageBuffer);
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to capture screenshot' });
  }
} 