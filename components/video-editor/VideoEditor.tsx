"use client";
import React, { useEffect, useRef, useState } from "react";
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

  const { clips, initializeClips } = useTimelineStore();

  const videoRef = useRef<{ seekTo: (time: number) => void }>(null);

  // Initialize with sample clips
  useEffect(() => {
    // Example of clips with different video sources
    const sampleClipsWithTimes = [
      {
        id: "1",
        src: "/porttrait-1.mp4",
        startTime: 0,
        endTime: 10,
        title: "Intro Clip",
      },
      {
        id: "2",
        src: "/porttrait-2.mp4",
        startTime: 5,
        endTime: 15,
        title: "Main Content",
      },
      {
        id: "3",
        src: "/porttrait-3.mp4",
        startTime: 0,
        endTime: 8,
        title: "Outro",
      },
    ];

    // For clips with explicit times, calculate durations automatically
    const clipsWithDurations = sampleClipsWithTimes.map((clip) => ({
      ...clip,
      startTime: clip.startTime || 0,
      endTime: clip.endTime || 0,
      duration:
        clip.endTime && clip.startTime ? clip.endTime - clip.startTime : 0,
    }));

    initializeClips(clipsWithDurations);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Marketing Video Editor</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportDialogOpen(true)}
            >
              Export Video
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow">
          <div className="bg-card rounded-[24px] p-4 border border-border shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Assets</h2>

            <h3 className="text-sm font-medium mb-2">Add Videos</h3>
            <FileUpload />
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Clips</h3>
              <div className="text-sm text-muted-foreground">
                {clips.length} clips · {duration.toFixed(1)}s total
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-card rounded-[24px] overflow-hidden border border-border shadow-sm flex items-center justify-center">
            <div
              className="bg-black/90 transition-all duration-300 ease-in-out max-w-full max-h-full"
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
                volume={volume}
                isMuted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            </div>
          </div>
          <div className="bg-card rounded-[24px] p-4 border border-border shadow-sm flex flex-col gap-4">
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

        <div className="bg-card rounded-[24px] p-4 border border-border shadow-sm">
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
