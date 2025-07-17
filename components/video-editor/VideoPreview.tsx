"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import ReactPlayer from "react-player";
import { Clip } from "@/lib/video-editor/types";

// Define proper types for ReactPlayer instance
interface ReactPlayerInstance {
  seekTo: (amount: number, type: "seconds" | "fraction") => void;
  pause: () => void;
  play: () => void;
}

// Define proper types for ReactPlayer since the library's types are incomplete
interface CustomReactPlayerProps {
  src: string;
  playing?: boolean;
  width?: string | number;
  height?: string | number;
  onProgress?: (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => void;
  // Add onTimeUpdate prop that takes an event parameter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTimeUpdate?: (event: any) => void;
  // Add onDuration prop to get total video duration
  onDuration?: (duration: number) => void;
  progressInterval?: number;
  controls?: boolean;
  muted?: boolean;
  ref?: React.Ref<ReactPlayerInstance>;
}

// Create a properly typed component by casting
const TypedReactPlayer =
  ReactPlayer as unknown as React.ForwardRefExoticComponent<CustomReactPlayerProps>;

interface VideoPreviewProps {
  isPlaying: boolean;
  currentClips: Clip[];
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

interface VideoPreviewRef {
  seekTo: (time: number) => void;
}

const VideoPreview = forwardRef<VideoPreviewRef, VideoPreviewProps>(
  ({ isPlaying, currentClips, onTimeUpdate, onDurationChange }, ref) => {
    // Using any type for ReactPlayer ref because the type definitions are incomplete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const currentClip = useRef<Clip | null>(null);
    const totalDuration = useRef<number>(0);

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

    // Expose seekTo method to parent component
    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (playerRef.current) {
          // Find which clip contains the target time
          let accumulatedTime = 0;
          for (const clip of currentClips) {
            const clipDuration = clip.endTime - clip.startTime;
            if (time < accumulatedTime + clipDuration) {
              // This is the clip we need to seek to
              const clipTime = time - accumulatedTime + clip.startTime;
              playerRef.current.seekTo(clipTime, "seconds");
              break;
            }
            accumulatedTime += clipDuration;
          }
        }
      },
    }));

    // Update current clip reference when clips change
    useEffect(() => {
      if (currentClips.length > 0) {
        currentClip.current = currentClips[0];
      }
    }, [currentClips]);



    // Type-safe wrapper for onTimeUpdate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTimeUpdate = (event: any) => {
      // Log the event to help debug
      console.log("TimeUpdate event:", event);

      if (!activeClip) return;
      
      // Get the current video element from the event
      const videoElement = event.target;
      
      if (videoElement && typeof videoElement.currentTime === 'number') {
        // Use the actual currentTime from the video element
        const currentVideoTime = videoElement.currentTime;
        console.log("Current video time:", currentVideoTime);
        
        // Check if we've reached the end of the clip
        if (currentVideoTime >= activeClip.endTime) {
          console.log("Reached end of clip at time", currentVideoTime, ", clip end time:", activeClip.endTime);
          
          // Stop playback when we reach the end time
          if (isPlaying && playerRef.current) {
            // Force the player to pause
            playerRef.current.pause();
            // Send the final time update with the end time
            onTimeUpdate(activeClip.endTime);
          }
          return;
        }
        
        // Call the parent's onTimeUpdate with the current time
        onTimeUpdate(currentVideoTime);
      } else if (event && typeof event.timeStamp === "number") {
        // Fallback to using timeStamp if currentTime is not available
        const timeInSeconds = event.timeStamp / 1000;
        onTimeUpdate(timeInSeconds);
      }
    };

    // Get the current clip to display
    const activeClip = currentClips.length > 0 ? currentClips[0] : null;

    return (
      <div className="relative w-full h-full bg-black/90 flex items-center justify-center">
        {activeClip ? (
          <div className="w-full h-full">
            <TypedReactPlayer
              ref={playerRef}
              src={activeClip.src}
              playing={isPlaying}
              width="100%"
              height="100%"
              onTimeUpdate={handleTimeUpdate}
              onDuration={(duration) => {
                console.log("Video duration:", duration);
                onDurationChange(duration);
              }}
              controls={false}
              muted={false}
            />
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
