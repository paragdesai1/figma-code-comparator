import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface ComparisonState {
  figmaDesign: string | null;
  websiteUrl: string | null;
  comparisonMode: 'overlay' | 'split' | 'diff' | 'side-by-side';
  opacity: number;
  figmaFrameId: string | null;
  figmaAccessToken: string | null;
}

declare global {
  interface Window {
    onFigmaMessage?: (pluginMessage: any) => void;
  }
}

export default function Home() {
  const [comparisonState, setComparisonState] = useState<ComparisonState>({
    figmaDesign: null,
    websiteUrl: null,
    comparisonMode: 'overlay',
    opacity: 0.5,
    figmaFrameId: null,
    figmaAccessToken: null,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<any>(null);

  useEffect(() => {
    // Set up Figma plugin message listener
    window.onFigmaMessage = (pluginMessage: any) => {
      if (pluginMessage.type === 'frame-selected') {
        setSelectedFrame(pluginMessage.frame);
        setComparisonState(prev => ({
          ...prev,
          figmaFrameId: pluginMessage.frame.id
        }));
      }
    };

    return () => {
      window.onFigmaMessage = undefined;
    };
  }, []);

  const connectToFigma = async () => {
    try {
      // This will trigger the Figma plugin to open the frame selector
      window.parent.postMessage({ pluginMessage: { type: 'select-frame' } }, '*');
    } catch (error) {
      console.error('Failed to connect to Figma:', error);
    }
  };

  const renderFigmaFrame = () => {
    if (!selectedFrame) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            Connect to Figma plugin to import design
          </p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={connectToFigma}
          >
            Connect to Figma
          </button>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{selectedFrame.name}</h3>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setSelectedFrame(null)}
          >
            Disconnect
          </button>
        </div>
        <div 
          className="bg-white rounded-lg shadow"
          style={{
            width: selectedFrame.width,
            height: selectedFrame.height,
            maxWidth: '100%',
            maxHeight: '600px',
            overflow: 'auto'
          }}
        >
          {/* Figma frame will be rendered here */}
          <iframe
            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(selectedFrame.url)}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Figma Code Comparator</title>
        <meta name="description" content="Compare Figma designs with live websites" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Figma Code Comparator
        </h1>

        {!isConnected && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8">
            <p className="font-bold">Extension Not Connected</p>
            <p>Please install and enable the Chrome extension to use the comparator.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Figma Design</h2>
            {renderFigmaFrame()}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Website URL</h2>
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Enter website URL"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setComparisonState(prev => ({
                  ...prev,
                  websiteUrl: e.target.value
                }))}
              />
              <button 
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => {/* TODO: Implement website loading */}}
              >
                Load Website
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Comparison Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comparison Mode
              </label>
              <select
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={comparisonState.comparisonMode}
                onChange={(e) => setComparisonState(prev => ({
                  ...prev,
                  comparisonMode: e.target.value as ComparisonState['comparisonMode']
                }))}
              >
                <option value="overlay">Overlay</option>
                <option value="split">Split View</option>
                <option value="diff">Difference</option>
                <option value="side-by-side">Side by Side</option>
              </select>
            </div>

            {comparisonState.comparisonMode === 'overlay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overlay Opacity: {comparisonState.opacity * 100}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={comparisonState.opacity}
                  onChange={(e) => setComparisonState(prev => ({
                    ...prev,
                    opacity: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Comparison View</h2>
          <div className="border rounded-lg h-96 flex items-center justify-center bg-gray-50">
            {selectedFrame && comparisonState.websiteUrl ? (
              <div className="relative w-full h-full">
                {/* Comparison view will be implemented here */}
                <p className="text-gray-500">Comparison view coming soon...</p>
              </div>
            ) : (
              <p className="text-gray-500">
                Connect both Figma design and website to start comparison
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 