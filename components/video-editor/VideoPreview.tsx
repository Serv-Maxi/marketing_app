"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import ReactPlayer from "react-player";
import { Clip } from "@/lib/video-editor/types";

// Define proper types for ReactPlayer instance
interface ReactPlayerInstance {
  seekTo: (amount: number, type: "seconds" | "fraction") => void;
  pause: () => void;
  play: () => void;
  getCurrentTime: () => number;
}

interface VideoPreviewProps {
  isPlaying: boolean;
  currentClips: Clip[];
  volume?: number;
  isMuted?: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

interface VideoPreviewRef {
  seekTo: (time: number) => void;
}

const VideoPreview = forwardRef<VideoPreviewRef, VideoPreviewProps>(
  (
    {
      isPlaying,
      currentClips,
      volume = 1.0,
      isMuted = false,
      onTimeUpdate,
      onDurationChange,
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [timelinePosition, setTimelinePosition] = useState(0);
    const totalDuration = useRef<number>(0);
    const animationFrameRef = useRef<number | null>(null);

    // Helper function to safely seek to a time
    const safeSeekTo = (time: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(time, "seconds");
      }
    };

    // Calculate total duration of all clips
    useEffect(() => {
      if (currentClips.length > 0) {
        const duration = currentClips.reduce(
          (total, clip) => total + (clip.endTime - clip.startTime),
          0
        );
        totalDuration.current = duration;
        onDurationChange(duration);
      }
    }, [currentClips, onDurationChange]);

    // Find current clip based on timeline position
    const getCurrentClipInfo = useCallback(
      (timelineTime: number) => {
        let accumulatedTime = 0;
        for (let i = 0; i < currentClips.length; i++) {
          const clip = currentClips[i];
          const clipDuration = clip.endTime - clip.startTime;

          if (
            timelineTime >= accumulatedTime &&
            timelineTime < accumulatedTime + clipDuration
          ) {
            return {
              clipIndex: i,
              clip,
              clipRelativeTime: timelineTime - accumulatedTime,
              clipActualTime: clip.startTime + (timelineTime - accumulatedTime),
            };
          }
          accumulatedTime += clipDuration;
        }
        return null;
      },
      [currentClips]
    );

    // Update current clip when timeline position changes
    useEffect(() => {
      const clipInfo = getCurrentClipInfo(timelinePosition);
      if (clipInfo && clipInfo.clipIndex !== currentClipIndex) {
        setCurrentClipIndex(clipInfo.clipIndex);
        safeSeekTo(clipInfo.clipActualTime);
      }
    }, [timelinePosition, currentClipIndex, currentClips, getCurrentClipInfo]);

    // Handle when video ends
    const handleVideoEnded = useCallback(() => {
      console.log("Video ended, transitioning to next clip");

      // Move to next clip
      if (currentClipIndex < currentClips.length - 1) {
        const nextClipIndex = currentClipIndex + 1;

        setCurrentClipIndex(nextClipIndex);

        // Update timeline position
        let accumulatedTime = 0;
        for (let i = 0; i < nextClipIndex; i++) {
          accumulatedTime +=
            currentClips[i].endTime - currentClips[i].startTime;
        }
        setTimelinePosition(accumulatedTime);
        onTimeUpdate(accumulatedTime);
      } else {
        // Reached the end of all clips
        console.log("Reached end of all clips");
        onTimeUpdate(totalDuration.current);
      }
    }, [currentClipIndex, currentClips, onTimeUpdate]); // Handle progress updates from ReactPlayer
    const handleProgress = useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        if (!isPlaying) return;

        const currentClip = currentClips[currentClipIndex];
        if (!currentClip) return;

        const currentVideoTime = (event.target as HTMLVideoElement).currentTime;
        const videoDuration = (event.target as HTMLVideoElement).duration;

        console.log(
          `Clip ${currentClipIndex + 1}: currentTime=${currentVideoTime.toFixed(2)}, endTime=${currentClip.endTime}, duration=${videoDuration?.toFixed(2)}`
        );

        // Check if we've reached the end of the current clip
        // Use either the clip's endTime or 90% of video duration as trigger
        const clipEndTrigger = Math.min(
          currentClip.endTime,
          videoDuration * 0.9
        );

        if (currentVideoTime >= clipEndTrigger) {
          console.log("Transitioning to next clip...");

          // Move to next clip
          if (currentClipIndex < currentClips.length - 1) {
            const nextClipIndex = currentClipIndex + 1;

            setCurrentClipIndex(nextClipIndex);

            // Update timeline position
            let accumulatedTime = 0;
            for (let i = 0; i < nextClipIndex; i++) {
              accumulatedTime +=
                currentClips[i].endTime - currentClips[i].startTime;
            }
            setTimelinePosition(accumulatedTime);
            onTimeUpdate(accumulatedTime);
          } else {
            // Reached the end of all clips
            console.log("Reached end of all clips");
            onTimeUpdate(totalDuration.current);
          }
        } else {
          // Update timeline position within current clip
          const clipRelativeTime = currentVideoTime - currentClip.startTime;
          let accumulatedTime = 0;
          for (let i = 0; i < currentClipIndex; i++) {
            accumulatedTime +=
              currentClips[i].endTime - currentClips[i].startTime;
          }
          const newTimelinePosition = accumulatedTime + clipRelativeTime;
          setTimelinePosition(newTimelinePosition);
          onTimeUpdate(newTimelinePosition);
        }
      },
      [isPlaying, currentClipIndex, currentClips, onTimeUpdate]
    );

    // Remove the old time update loop
    useEffect(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }, []);

    // Expose seekTo method to parent component
    useImperativeHandle(
      ref,
      () => ({
        seekTo: (time: number) => {
          const clipInfo = getCurrentClipInfo(time);
          if (clipInfo) {
            setCurrentClipIndex(clipInfo.clipIndex);
            setTimelinePosition(time);
            safeSeekTo(clipInfo.clipActualTime);
          }
        },
      }),
      [getCurrentClipInfo]
    );

    // Get the current clip to display
    const activeClip = currentClips[currentClipIndex];

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {activeClip ? (
          <div className="w-full h-full relative">
            <ReactPlayer
              ref={playerRef}
              src={activeClip.src}
              playing={isPlaying}
              volume={volume}
              muted={isMuted}
              width="100%"
              height="100%"
              controls={false}
              onTimeUpdate={handleProgress}
              onEnded={handleVideoEnded}
              style={{
                objectFit: "contain",
              }}
            />

            {/* Clip indicator */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {activeClip.title} ({currentClipIndex + 1}/{currentClips.length})
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No video clips available</div>
        )}
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
