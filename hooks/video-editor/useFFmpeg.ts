"use client";
import { useState, useCallback, useEffect } from "react";
import { Clip } from "@/lib/video-editor/types";

export const useFFmpeg = () => {
  const [isReady, setIsReady] = useState(false);
  const [useMockMode] = useState(true); // Always use mock mode for now

  // Initialize (just set ready state)
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log("Video processor ready (mock mode)");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Create mock video data that includes some metadata about the clips
  const createMockVideoData = useCallback((clips: Clip[]): Uint8Array => {
    const metadata = {
      clips: clips.map((clip) => ({
        title: clip.title,
        duration: clip.endTime - clip.startTime,
        src: clip.src,
      })),
      totalDuration: clips.reduce(
        (sum, clip) => sum + (clip.endTime - clip.startTime),
        0
      ),
      exportTimestamp: Date.now(),
      mockData: true,
    };

    // Convert metadata to bytes (in a real implementation, this would be video data)
    const jsonString = JSON.stringify(metadata);
    const encoder = new TextEncoder();
    const metadataBytes = encoder.encode(jsonString);

    // Create a larger mock file with some padding
    const totalSize = Math.max(metadataBytes.length + 1000, 50000); // At least 50KB
    const mockData = new Uint8Array(totalSize);

    // Add metadata at the beginning
    mockData.set(metadataBytes, 0);

    // Fill the rest with pseudo-random data to simulate video content
    for (let i = metadataBytes.length; i < totalSize; i++) {
      mockData[i] = Math.floor(Math.random() * 256);
    }

    return mockData;
  }, []);

  // Enhanced mock export function that creates a more realistic experience
  const mockExportVideo = useCallback(
    async (
      clips: Clip[],
      onProgress?: (progress: number) => void
    ): Promise<Blob | null> => {
      console.log("Processing video with", clips.length, "clips");

      try {
        // Reset progress
        if (onProgress) onProgress(0);

        // Simulate loading video files
        if (onProgress) onProgress(10);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate processing each clip
        for (let i = 0; i < clips.length; i++) {
          const clip = clips[i];
          console.log(`Processing clip ${i + 1}: ${clip.title}`);

          // Simulate processing time based on clip duration
          const processingTime = Math.min(
            (clip.endTime - clip.startTime) * 100,
            1000
          );
          await new Promise((resolve) => setTimeout(resolve, processingTime));

          // Report progress (10% for loading, 70% for processing clips, 20% for final steps)
          if (onProgress) {
            onProgress(10 + ((i + 1) / clips.length) * 70);
          }
        }

        // Simulate concatenation
        console.log("Concatenating clips...");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (onProgress) onProgress(85);

        // Simulate encoding
        console.log("Encoding final video...");
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (onProgress) onProgress(95);

        // Simulate final processing
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (onProgress) onProgress(100);

        // Create a mock video blob with metadata
        const mockVideoData = createMockVideoData(clips);
        const blob = new Blob([mockVideoData], { type: "video/mp4" });

        console.log("Video processing complete! Generated", blob.size, "bytes");
        return blob;
      } catch (error) {
        console.error("Error during video processing:", error);
        return null;
      }
    },
    [createMockVideoData]
  );

  const exportVideo = useCallback(
    async (
      clips: Clip[],
      onProgress?: (progress: number) => void
    ): Promise<Blob | null> => {
      if (!isReady || clips.length === 0) return null;

      return mockExportVideo(clips, onProgress);
    },
    [isReady, mockExportVideo]
  );

  return {
    isReady,
    exportVideo,
    isMockMode: useMockMode,
  };
};
