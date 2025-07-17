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
import { motion } from "framer-motion";

const VideoEditor = () => {
  // Using sonner toast directly
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(100); // 100px per second
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { clips, initializeClips } = useTimelineStore();

  const videoRef = useRef<{ seekTo: (time: number) => void }>(null);

  // Initialize with sample clips
  useEffect(() => {
    // Example of clips with explicit start and end times
    const sampleClipsWithTimes = [
      {
        id: "1",
        src: "/video-1.mp4",
        startTime: 0,
        endTime: 30,
        title: "Intro Clip",
      },
      {
        id: "2",
        src: "/video-1.mp4",
        startTime: 10,
        endTime: 20,
        title: "Main Content",
      },
      {
        id: "3",
        src: "/video-1.mp4",
        startTime: 20,
        endTime: 30,
        title: "Outro",
      },
    ];
    
    // Example of a clip without explicit start/end times
    // This will use the full video duration when loaded
    const sampleClipsWithoutTimes = [
      {
        id: "1",
        src: "/video-1.mp4",
        title: "Full Video",
      }
    ];

    // Choose which sample to use
    const sampleClips = sampleClipsWithTimes;

    // For clips with explicit times, calculate durations automatically
    const clipsWithDurations = sampleClips.map(clip => ({
      ...clip,
      startTime: clip.startTime || 0,
      endTime: clip.endTime || 0, // Will be updated when video loads if not provided
      duration: clip.endTime && clip.startTime ? clip.endTime - clip.startTime : 0 // Will be updated when video loads
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
          <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden border border-border shadow-sm">
            <VideoPreview
              ref={videoRef}
              isPlaying={isPlaying}
              currentClips={clips}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
            />
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm flex flex-col gap-4">
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
            <div className="mt-auto">
              <h3 className="text-sm font-medium mb-2">Clips</h3>
              <div className="text-sm text-muted-foreground">
                {clips.length} clips · {duration.toFixed(1)}s total
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
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
