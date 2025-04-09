/// <reference types="@figma/plugin-typings" />

export function compareFrames(frame1: FrameNode, frame2: FrameNode) {
  return {
    widthDiff: Math.abs(frame1.width - frame2.width),
    heightDiff: Math.abs(frame1.height - frame2.height),
    scaleFactor: frame2.width / frame1.width
  };
} 