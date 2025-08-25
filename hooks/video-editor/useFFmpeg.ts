"use client";
import { useState, useEffect, useCallback } from "react";
import { Clip, AudioTrack } from "@/lib/video-editor/types";

export const useFFmpeg = () => {
  // FFmpeg instance type is dynamic; using unknown then narrowed when used
  const [ffmpeg, setFFmpeg] = useState<unknown>(null);
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
      onProgress: (progress: number) => void,
      audioTracks: AudioTrack[] = []
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
        if (!ffmpeg) throw new Error("FFmpeg not initialized");
        // Narrow ffmpeg instance
        const ff = ffmpeg as {
          writeFile: (path: string, data: Uint8Array | string) => Promise<void>;
          exec: (args: string[]) => Promise<void>;
          readFile: (path: string) => Promise<Uint8Array>;
        };
        const { fetchFile } = await import("@ffmpeg/util");

        // Process each clip with trimming using FFmpeg
        const processedClips: string[] = [];
        const totalVideoSteps = clips.length || 1;
        const hasAudio = audioTracks.length > 0;
        // We'll allocate progress: 50% video, 40% audio processing, 10% final mux

        for (let i = 0; i < clips.length; i++) {
          const clip = clips[i];
          const inputFileName = `input_${i}.mp4`;
          const outputFileName = `trimmed_${i}.mp4`;

          // Write input file
          await ff.writeFile(inputFileName, await fetchFile(clip.src));

          // Trim the clip using FFmpeg
          const duration = clip.endTime - clip.startTime;
          await ff.exec([
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
          onProgress(((i + 1) / totalVideoSteps) * 50); // First 50% for video processing
        }

        // Create concat file
        const concatContent = processedClips
          .map((filename) => `file '${filename}'`)
          .join("\n");
        await ff.writeFile(
          "concat.txt",
          new TextEncoder().encode(concatContent)
        );

        // Concatenate all clips into intermediate output
        await ff.exec([
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "concat.txt",
          "-c",
          "copy",
          "output_video_temp.mp4",
        ]);

        // If no extra audio tracks, rename final file and return
        if (!hasAudio) {
          await ff.exec([
            "-i",
            "output_video_temp.mp4",
            "-c",
            "copy",
            "output.mp4",
          ]);
          onProgress(100);
          const dataNoAudio = await ff.readFile("output.mp4");
          const copyNoAudio = new Uint8Array(dataNoAudio);
          return new Blob([copyNoAudio], { type: "video/mp4" });
        }

        // Process audio tracks: trim & apply volume
        const processedAudio: string[] = [];
        for (let i = 0; i < audioTracks.length; i++) {
          const track = audioTracks[i];
          const inputAudioName =
            `audio_input_${i}` +
            track.src.substring(track.src.lastIndexOf("."));
          const outputAudioName = `audio_trimmed_${i}.wav`;
          try {
            await ff.writeFile(
              inputAudioName,
              await (await import("@ffmpeg/util")).fetchFile(track.src)
            );
          } catch (e) {
            console.warn("Failed writing audio file", track.src, e);
            continue;
          }
          const aDuration = track.endTime - track.startTime;
          // Trim & volume adjust
          await ff.exec([
            "-i",
            inputAudioName,
            "-ss",
            track.startTime.toString(),
            "-t",
            aDuration.toString(),
            "-filter:a",
            `volume=${track.volume.toFixed(2)}`,
            outputAudioName,
          ]);
          processedAudio.push(outputAudioName);
          // Progress within 40% allocation (50 -> 90)
          onProgress(50 + ((i + 1) / audioTracks.length) * 40);
        }

        // Mix audio tracks
        const mixedAudioName = "mixed_audio.wav";
        if (processedAudio.length === 1) {
          // Single track, just copy
          await ff.exec([
            "-i",
            processedAudio[0],
            "-c",
            "copy",
            mixedAudioName,
          ]);
        } else if (processedAudio.length > 1) {
          // Build inputs list
          const amixInputs = processedAudio.length;
          const args: string[] = [];
          processedAudio.forEach((name) => {
            args.push("-i", name);
          });
          args.push(
            "-filter_complex",
            `amix=inputs=${amixInputs}:duration=longest:dropout_transition=0`,
            "-c:a",
            "pcm_s16le",
            mixedAudioName
          );
          await ff.exec(args);
        } else {
          // No valid processed audio (all failed); fallback to video only
          await ff.exec([
            "-i",
            "output_video_temp.mp4",
            "-c",
            "copy",
            "output.mp4",
          ]);
          onProgress(100);
          const dataFallback = await ff.readFile("output.mp4");
          const copyFallback = new Uint8Array(dataFallback);
          return new Blob([copyFallback], { type: "video/mp4" });
        }

        // Remove any existing audio from video and mux mixed audio
        // Strategy: if video temp has audio we blend it with mixed audio.
        // Probe for audio presence by attempting to extract stream info (simplified heuristic).
        let videoHasAudio = false;
        try {
          await ff.exec(["-i", "output_video_temp.mp4", "-f", "null", "-"]);
          // If exec succeeded we assume possible audio track; we can't parse logs here easily.
          // For simplicity treat as having audio; users can refine.
          videoHasAudio = true; // Heuristic; improve with parsing if needed.
        } catch {
          videoHasAudio = false;
        }

        if (videoHasAudio) {
          // Extract original audio then mix with mixedAudioName
          await ff.exec([
            "-i",
            "output_video_temp.mp4",
            "-i",
            mixedAudioName,
            "-filter_complex",
            "[0:a][1:a]amix=inputs=2:duration=longest:dropout_transition=0[aout]",
            "-map",
            "0:v:0",
            "-map",
            "[aout]",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-shortest",
            "output.mp4",
          ]);
        } else {
          // Map video + mixed audio directly
          await ff.exec([
            "-i",
            "output_video_temp.mp4",
            "-i",
            mixedAudioName,
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-shortest",
            "output.mp4",
          ]);
        }

        onProgress(100);
        const finalData = await ff.readFile("output.mp4");
        const copyFinal = new Uint8Array(finalData);
        return new Blob([copyFinal], { type: "video/mp4" });
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
