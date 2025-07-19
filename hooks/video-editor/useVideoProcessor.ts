"use client";
import { useState, useCallback } from "react";
import { Clip } from "@/lib/video-editor/types";

export const useVideoProcessor = () => {
  const [isReady, setIsReady] = useState(true);

  const processVideo = useCallback(
    async (
      clips: Clip[],
      onProgress: (progress: number) => void
    ): Promise<Blob | null> => {
      try {
        // Create a canvas for video processing
        const canvas = document.createElement("canvas");
        canvas.width = 854;
        canvas.height = 480;
        const ctx = canvas.getContext("2d")!;

        // Create a MediaRecorder to capture the canvas
        const stream = canvas.captureStream(30); // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        return new Promise((resolve, reject) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            resolve(blob);
          };

          mediaRecorder.onerror = (event) => {
            reject(new Error("MediaRecorder error"));
          };

          mediaRecorder.start();

          // Process each clip
          let processedClips = 0;
          const processClip = async (clip: Clip, index: number) => {
            return new Promise<void>((clipResolve) => {
              const video = document.createElement("video");
              video.src = clip.src;
              video.muted = true;

              video.onloadeddata = () => {
                video.currentTime = clip.startTime;

                video.ontimeupdate = () => {
                  if (video.currentTime >= clip.endTime) {
                    processedClips++;
                    onProgress((processedClips / clips.length) * 100);
                    clipResolve();
                    return;
                  }

                  // Draw the video frame to canvas
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                };

                video.play();
              };
            });
          };

          // Process clips sequentially
          const processAllClips = async () => {
            for (let i = 0; i < clips.length; i++) {
              await processClip(clips[i], i);
            }
            mediaRecorder.stop();
          };

          processAllClips();
        });
      } catch (error) {
        console.error("Video processing error:", error);
        return null;
      }
    },
    []
  );

  return {
    isReady,
    processVideo,
    isMockMode: false,
  };
};
