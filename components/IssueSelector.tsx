import React, { useState, useRef, useEffect } from 'react';

interface IssueSelectorProps {
  isActive: boolean;
  onIssueCreate: (issue: IssueData) => void;
  onCancel: () => void;
}

interface IssueData {
  title: string;
  description: string;
  type: 'bug' | 'task' | 'improvement';
  priority: 'high' | 'medium' | 'low';
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  screenshot?: string;
}

export default function IssueSelector({ isActive, onIssueCreate, onCancel }: IssueSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'selecting' | 'creating'>('selecting');
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [issueData, setIssueData] = useState<Partial<IssueData>>({
    type: 'bug',
    priority: 'medium'
  });

  useEffect(() => {
    if (!isActive) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (selectionMode !== 'selecting') return;
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startPos || selectionMode !== 'selecting') return;

      const width = e.clientX - startPos.x;
      const height = e.clientY - startPos.y;

      setSelection({
        x: width > 0 ? startPos.x : e.clientX,
        y: height > 0 ? startPos.y : e.clientY,
        width: Math.abs(width),
        height: Math.abs(height)
      });
    };

    const handleMouseUp = async () => {
      if (!selection || selectionMode !== 'selecting') return;

      // Capture the selected area
      const screenshot = await captureScreenshot(selection);
      setIssueData(prev => ({ ...prev, coordinates: selection, screenshot }));
      setSelectionMode('creating');
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, selectionMode, startPos]);

  const captureScreenshot = async (area: { x: number; y: number; width: number; height: number }) => {
    const canvas = document.createElement('canvas');
    canvas.width = area.width;
    canvas.height = area.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a temporary div to hold the current view
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '100%';
    tempDiv.style.height = '100%';
    document.body.appendChild(tempDiv);

    // Use html2canvas or similar library to capture the area
    // For this example, we'll just return a placeholder
    const screenshot = canvas.toDataURL('image/png');
    document.body.removeChild(tempDiv);
    
    return screenshot;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection || !issueData.title || !issueData.description) return;

    onIssueCreate({
      ...issueData as IssueData,
      coordinates: selection
    });
    
    setSelectionMode('selecting');
    setSelection(null);
    setStartPos(null);
    setIssueData({
      type: 'bug',
      priority: 'medium'
    });
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Selection overlay */}
      {selectionMode === 'selecting' && (
        <div 
          ref={selectionRef}
          className="absolute inset-0 cursor-crosshair"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          {selection && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30"
              style={{
                left: selection.x,
                top: selection.y,
                width: selection.width,
                height: selection.height
              }}
            />
          )}
        </div>
      )}

      {/* Issue creation form */}
      {selectionMode === 'creating' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={issueData.title || ''}
                  onChange={e => setIssueData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={issueData.description || ''}
                  onChange={e => setIssueData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={issueData.type}
                    onChange={e => setIssueData(prev => ({ ...prev, type: e.target.value as IssueData['type'] }))}
                  >
                    <option value="bug">Bug</option>
                    <option value="task">Task</option>
                    <option value="improvement">Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={issueData.priority}
                    onChange={e => setIssueData(prev => ({ ...prev, priority: e.target.value as IssueData['priority'] }))}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSelectionMode('selecting');
                    setSelection(null);
                    onCancel();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 