// pages/api/figma-thumbnail.js

export default async function handler(req, res) {
  const { fileKey } = req.query;
  const token = process.env.FIGMA_API_KEY;

  if (!fileKey || !token) {
    return res.status(400).json({ error: 'Missing fileKey or token' });
  }

  try {
    const figmaRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!figmaRes.ok) {
      const errorText = await figmaRes.text();
      return res.status(figmaRes.status).json({ error: errorText });
    }

    const figmaJson = await figmaRes.json();
    const thumbnailUrl = figmaJson.thumbnailUrl || figmaJson.preview_url;

    if (!thumbnailUrl) {
      return res.status(404).json({ error: 'No thumbnail found in Figma file.' });
    }

    res.status(200).json({ thumbnailUrl });
  } catch (error) {
    console.error('Figma API fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
