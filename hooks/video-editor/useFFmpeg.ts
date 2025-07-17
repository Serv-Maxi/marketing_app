"use client";
import { useState, useCallback } from 'react';
import { Clip } from '@/lib/video-editor/types';

/**
 * Mock implementation of FFmpeg for demonstration purposes
 * This avoids the issues with FFmpeg.wasm in Next.js
 */
export const useFFmpeg = () => {
  const [isReady] = useState(true); // Always ready in mock mode

  // Mock export video function that simulates processing
  const exportVideo = useCallback(
    async (
      clips: Clip[],
      onProgress?: (progress: number) => void
    ): Promise<Blob | null> => {
      if (clips.length === 0) return null;

      try {
        // Reset progress
        if (onProgress) onProgress(0);
        
        // Simulate processing each clip
        for (let i = 0; i < clips.length; i++) {
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Report progress
          if (onProgress) {
            onProgress((i + 1) / clips.length * 50);
          }
        }

        // Simulate concatenation
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (onProgress) onProgress(75);

        // Simulate final processing
        await new Promise(resolve => setTimeout(resolve, 500));
        if (onProgress) onProgress(100);

        // Create a simple mock video blob
        // In a real implementation, this would be the processed video
        const mockVideoData = new Uint8Array([0, 1, 2, 3, 4]); // Mock video data
        return new Blob([mockVideoData], { type: 'video/mp4' });
      } catch (error) {
        console.error('Error during video export:', error);
        return null;
      }
    },
    []
  );

  return { isReady, exportVideo };
};
