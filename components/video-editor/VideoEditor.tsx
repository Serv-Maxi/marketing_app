"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import VideoPreview from "./VideoPreview";
import Timeline from "./Timeline";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
// Import toast when needed
// import { toast } from 'sonner';
import ExportDialog from "./ExportDialog";
import PlayPauseButton from "./PlayPauseButton";
import TimeDisplay from "./TimeDisplay";
import FileUpload from "./FileUpload";
import AudioUpload from "./AudioUpload";
import { motion } from "framer-motion";
import { VolumeX, Volume2 } from "lucide-react";

const VideoEditor = () => {
  // Using sonner toast directly
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(100); // 100px per second
  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [isMuted, setIsMuted] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  const { clips, audioTracks, initializeClips } = useTimelineStore();

  // Read query params to support deep-linking from creation page
  const searchParams = useMemo(
    () =>
      new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      ),
    []
  );
  const incomingVideoUrl = searchParams.get("videoUrl");
  const incomingTitle = searchParams.get("title") || "Imported Clip";
  const incomingRatio =
    (searchParams.get("ratio") as "16:9" | "9:16" | null) || null;

  const videoRef = useRef<{ seekTo: (time: number) => void }>(null);

  // Utility function to get video duration
  const getVideoDuration = (src: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        resolve(video.duration);
      };

      video.onerror = () => {
        reject(new Error(`Failed to load video: ${src}`));
      };

      video.src = src;
    });
  };

  // Initialize with incoming clip if provided, else sample clips
  useEffect(() => {
    const init = async () => {
      // Set aspect ratio if provided
      if (incomingRatio === "16:9" || incomingRatio === "9:16") {
        setAspectRatio(incomingRatio);
      }

      // If a video URL is provided via query, seed it as a single clip
      if (incomingVideoUrl) {
        try {
          const actualDuration = await getVideoDuration(incomingVideoUrl).catch(
            () => 10
          );
          const clip = {
            id: `import_${Date.now()}`,
            src: incomingVideoUrl,
            startTime: 0,
            endTime: actualDuration,
            duration: actualDuration,
            originalDuration: actualDuration,
            title: incomingTitle,
          } as const;
          initializeClips([clip]);
          return;
        } catch (e) {
          console.error("Failed to load incoming video:", e);
          // fall through to samples
        }
      }

      // Fallback to samples
      const sampleClipsWithTimes = [
        {
          id: "1",
          src: "/porttrait-1.mp4",
          startTime: 0,
          endTime: 6.9,
          title: "Intro Clip",
        },
        { id: "2", src: "/porttrait-2.mp4", title: "Main Content" },
        { id: "3", src: "/porttrait-4.mp4", title: "Outro" },
      ];

      try {
        const clipsWithDurations = await Promise.all(
          sampleClipsWithTimes.map(async (clip) => {
            let actualDuration = 10;
            try {
              actualDuration = await getVideoDuration(clip.src);
            } catch {}
            return {
              ...clip,
              startTime: clip.startTime ?? 0,
              endTime: clip.endTime ?? actualDuration,
              duration:
                (clip.endTime ?? actualDuration) - (clip.startTime ?? 0),
              originalDuration: actualDuration,
            };
          })
        );
        initializeClips(clipsWithDurations);
      } catch (error) {
        console.error("Error initializing clips:", error);
        const fallbackClips = sampleClipsWithTimes.map((clip) => ({
          ...clip,
          startTime: clip.startTime || 0,
          endTime: clip.endTime || 10,
          duration: (clip.endTime || 10) - (clip.startTime || 0),
          originalDuration: 10,
        }));
        initializeClips(fallbackClips);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeClips]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 h-full"
      >
        <div className="w-full bg-white fixed shadow-md z-[20] top-0 left-0 p-[24px] flex justify-between items-center">
          <h1 className="text-2xl font-bold">Video Editor</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setIsExportDialogOpen(true)}
            >
              Export Video
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow mt-[12px]">
          <div className="bg-card rounded-[12px] p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Assets</h2>

            <h3 className="text-sm font-medium mb-2">Add Videos</h3>
            <FileUpload />
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Add Audio</h3>
              <AudioUpload />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Clips</h3>
              <div className="text-sm text-muted-foreground">
                {clips.length} clips · {duration.toFixed(1)}s total
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-card rounded-[12px] overflow-hidden border-2 border-primary flex items-center justify-center">
            <div
              className="bg-black/90 transition-all duration-300 ease-in-out max-w-full max-h-[560px]"
              style={{
                aspectRatio: aspectRatio === "16:9" ? "16/9" : "9/16",
                width: aspectRatio === "16:9" ? "100%" : "auto",
                height: aspectRatio === "9:16" ? "100%" : "auto",
              }}
            >
              <VideoPreview
                ref={videoRef}
                isPlaying={isPlaying}
                currentClips={clips}
                audioTracks={audioTracks}
                volume={volume}
                isMuted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            </div>
          </div>
          <div className="bg-card rounded-[12px] p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Controls</h2>
            <div className="flex items-center gap-2">
              <PlayPauseButton
                isPlaying={isPlaying}
                onClick={handlePlayPause}
              />
              <TimeDisplay currentTime={currentTime} duration={duration} />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Timeline Zoom</h3>
              <Slider
                defaultValue={[zoom]}
                min={50}
                max={500}
                step={10}
                onValueChange={handleZoomChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>50px/s</span>
                <span>500px/s</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Screen Ratio</h3>
              <div className="flex gap-2">
                <Button
                  variant={aspectRatio === "16:9" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio("16:9")}
                  className="flex-1 text-white"
                >
                  16:9 Landscape
                </Button>
                <Button
                  variant={aspectRatio === "9:16" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio("9:16")}
                  className="flex-1 text-white"
                >
                  9:16 Portrait
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Audio Controls</h3>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMuteToggle}
                  className="p-2"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <Slider
                    defaultValue={[volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    disabled={isMuted}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-[12px] p-4">
          <Timeline
            clips={clips}
            currentTime={currentTime}
            duration={duration}
            zoom={zoom}
            onSeek={handleSeek}
          />
        </div>
      </motion.div>

      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        clips={clips}
      />

      <Toaster />
    </div>
  );
};

export default VideoEditor;
