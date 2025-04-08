// Enhanced Figma vs Live Code Comparison Web Interface
// Now supports zoom/pan, drag-to-pan, keyboard shortcuts, and pixel diff highlighting

import React, { useState, useRef, useEffect } from 'react';
import pixelmatch from 'pixelmatch';

export default function DesignCompare() {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [figmaImageUrl, setFigmaImageUrl] = useState('');
  const [comparisonReady, setComparisonReady] = useState(false);
  const [viewMode, setViewMode] = useState('side-by-side');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollStart = useRef({ left: 0, top: 0 });

  const extractFileKey = (url) => {
    const match = url.match(/figma.com\/file\/([a-zA-Z0-9]+)\//);
    return match ? match[1] : null;
  };

  const handleCompare = async () => {
    const fileKey = extractFileKey(figmaUrl);
    if (!fileKey) return alert('Invalid Figma URL');

    try {
      const res = await fetch(`/api/figma-thumbnail?fileKey=${fileKey}`);
      const data = await res.json();
      if (data?.thumbnailUrl) {
        setFigmaImageUrl(data.thumbnailUrl);
        setComparisonReady(true);
      }
    } catch (err) {
      console.error('Figma API error:', err);
      alert('Failed to fetch Figma frame.');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || viewMode !== 'diff' || !figmaImageUrl || !liveUrl) return;

    const loadImagesAndDrawDiff = async () => {
      const screenshotOneKey = process.env.NEXT_PUBLIC_SCREENSHOTONE_KEY || 'demo';
      const [designImg, liveImg] = await Promise.all([
        loadImage(figmaImageUrl),
        loadImage(`https://api.screenshotone.com/take?access_key=${screenshotOneKey}&url=${encodeURIComponent(liveUrl)}&full_page=true&format=png`),
      ]);

      const width = Math.max(designImg.width, liveImg.width);
      const height = Math.max(designImg.height, liveImg.height);

      canvas.width = width;
      canvas.height = height;

      const designCanvas = document.createElement('canvas');
      const liveCanvas = document.createElement('canvas');
      designCanvas.width = liveCanvas.width = width;
      designCanvas.height = liveCanvas.height = height;

      const designCtx = designCanvas.getContext('2d');
      const liveCtx = liveCanvas.getContext('2d');
      designCtx.drawImage(designImg, 0, 0);
      liveCtx.drawImage(liveImg, 0, 0);

      const designData = designCtx.getImageData(0, 0, width, height);
      const liveData = liveCtx.getImageData(0, 0, width, height);
      const diffData = ctx.createImageData(width, height);

      pixelmatch(
        designData.data,
        liveData.data,
        diffData.data,
        width,
        height,
        { threshold: 0.1 }
      );

      ctx.putImageData(diffData, 0, 0);
    };

    loadImagesAndDrawDiff();
  }, [viewMode, figmaImageUrl, liveUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'diff') return;
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.1, 3));
      if (e.key === '-' || e.key === '_') setZoom((z) => Math.max(z - 0.1, 0.5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 3));
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    const wrapper = canvasWrapperRef.current;
    scrollStart.current = { left: wrapper.scrollLeft, top: wrapper.scrollTop };
    wrapper.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const wrapper = canvasWrapperRef.current;
    wrapper.scrollLeft = scrollStart.current.left - dx;
    wrapper.scrollTop = scrollStart.current.top - dy;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    canvasWrapperRef.current.style.cursor = 'grab';
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Figma vs Live Code Comparator</h1>
      <div className="space-y-4">
        <input className="border p-2 w-full" value={figmaUrl} onChange={(e) => setFigmaUrl(e.target.value)} placeholder="Enter Figma file URL" />
        <input className="border p-2 w-full" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="Enter Live page URL" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCompare}>Compare</button>
      </div>

      {comparisonReady && (
        <div className="mt-6 space-y-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${viewMode === 'side-by-side' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('side-by-side')}
            >
              Side by Side
            </button>
            <button
              className={`px-4 py-2 rounded ${viewMode === 'diff' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setViewMode('diff')}
            >
              Diff View
            </button>
          </div>

          {viewMode === 'side-by-side' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4">
                <h2 className="text-lg font-semibold mb-2">Figma Design</h2>
                <div className="overflow-auto max-h-[800px]">
                  <img
                    src={figmaImageUrl}
                    alt="Figma Design"
                    className="max-w-full"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <div className="border p-4">
                <h2 className="text-lg font-semibold mb-2">Live Page</h2>
                <div className="overflow-auto max-h-[800px]">
                  {liveUrl && (
                    <img
                      src={`https://api.screenshotone.com/take?access_key=${process.env.NEXT_PUBLIC_SCREENSHOTONE_KEY || 'demo'}&url=${encodeURIComponent(liveUrl)}&full_page=true&format=png`}
                      alt="Live Page"
                      className="max-w-full"
                      crossOrigin="anonymous"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'diff' && (
            <div className="w-full border">
              <h2 className="text-lg font-semibold mb-2">Visual Diff</h2>
              <div
                ref={canvasWrapperRef}
                className="overflow-auto border w-full h-[800px] cursor-grab"
                onWheel={handleWheelZoom}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                  <canvas ref={canvasRef} />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Zoom: {Math.round(zoom * 100)}% (Scroll, Drag, + / -)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}