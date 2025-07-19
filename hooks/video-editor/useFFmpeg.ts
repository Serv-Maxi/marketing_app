"use client";
import { useState, useEffect, useCallback } from "react";
import { Clip } from "@/lib/video-editor/types";

export const useFFmpeg = () => {
  const [ffmpeg, setFFmpeg] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { toBlobURL } = await import("@ffmpeg/util");

        const ffmpegInstance = new FFmpeg();
        setFFmpeg(ffmpegInstance);

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        ffmpegInstance.on("log", ({ message }) => {
          console.log(message);
        });

        await ffmpegInstance.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });

        setIsReady(true);
      } catch (error) {
        console.warn("FFmpeg failed to load, using mock mode:", error);
        setIsMockMode(true);
        setIsReady(true);
      }
    };

    initFFmpeg();
  }, []);

  const exportVideo = useCallback(
    async (
      clips: Clip[],
      onProgress: (progress: number) => void
    ): Promise<Blob | null> => {
      if (isMockMode) {
        // Mock export simulation with trimmed clips
        const totalSteps = 20;

        for (let i = 0; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          onProgress((i / totalSteps) * 100);
        }

        // Create a mock video blob that represents the trimmed clips
        const canvas = document.createElement("canvas");
        canvas.width = 854;
        canvas.height = 480;
        const ctx = canvas.getContext("2d")!;

        // Black background
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text showing clip information
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Exported Video", canvas.width / 2, 100);

        ctx.font = "16px Arial";
        ctx.fillText(`${clips.length} clips merged`, canvas.width / 2, 140);

        const totalDuration = clips.reduce(
          (sum, clip) => sum + (clip.endTime - clip.startTime),
          0
        );
        ctx.fillText(
          `Total duration: ${totalDuration.toFixed(1)}s`,
          canvas.width / 2,
          170
        );

        // Draw clip representations
        let yPos = 220;
        clips.forEach((clip, index) => {
          const duration = clip.endTime - clip.startTime;
          ctx.fillText(
            `Clip ${index + 1}: ${clip.startTime.toFixed(1)}s - ${clip.endTime.toFixed(1)}s (${duration.toFixed(1)}s)`,
            canvas.width / 2,
            yPos
          );
          yPos += 30;
        });

        // Convert canvas to blob
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/png");
        });
      }

      try {
        const { fetchFile } = await import("@ffmpeg/util");

        // Process each clip with trimming using FFmpeg
        const processedClips: string[] = [];

        for (let i = 0; i < clips.length; i++) {
          const clip = clips[i];
          const inputFileName = `input_${i}.mp4`;
          const outputFileName = `trimmed_${i}.mp4`;

          // Write input file
          await ffmpeg.writeFile(inputFileName, await fetchFile(clip.src));

          // Trim the clip using FFmpeg
          const duration = clip.endTime - clip.startTime;
          await ffmpeg.exec([
            "-i",
            inputFileName,
            "-ss",
            clip.startTime.toString(),
            "-t",
            duration.toString(),
            "-c",
            "copy",
            outputFileName,
          ]);

          processedClips.push(outputFileName);
          onProgress(((i + 1) / clips.length) * 50); // First 50% for processing
        }

        // Create concat file
        const concatContent = processedClips
          .map((filename) => `file '${filename}'`)
          .join("\n");

        await ffmpeg.writeFile("concat.txt", concatContent);

        // Concatenate all clips
        await ffmpeg.exec([
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "concat.txt",
          "-c",
          "copy",
          "output.mp4",
        ]);

        onProgress(100);

        // Read the output file
        const data = await ffmpeg.readFile("output.mp4");
        return new Blob([data], { type: "video/mp4" });
      } catch (error) {
        console.error("Export error:", error);
        throw error;
      }
    },
    [ffmpeg, isMockMode]
  );

  return {
    isReady,
    exportVideo,
    isMockMode,
  };
};
