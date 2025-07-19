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
import { Clip, AudioTrack } from "@/lib/video-editor/types";

interface VideoPreviewProps {
  isPlaying: boolean;
  currentClips: Clip[];
  audioTracks?: AudioTrack[];
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
      audioTracks = [],
      volume = 1.0,
      isMuted = false,
      onTimeUpdate,
      onDurationChange,
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [timelinePosition, setTimelinePosition] = useState(0);
    const totalDuration = useRef<number>(0);

    // Helper function to safely seek to a time
    const safeSeekTo = (time: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(time, "seconds");
      }
    };

    // Initialize audio elements
    useEffect(() => {
      audioRefs.current = audioTracks.map((track) => {
        const audio = document.createElement("audio");
        audio.src = track.src;
        audio.volume = track.volume;
        audio.muted = isMuted;
        audio.preload = "auto";
        return audio;
      });

      return () => {
        // Cleanup audio elements
        audioRefs.current.forEach((audio) => {
          audio.pause();
          audio.src = "";
        });
      };
    }, [audioTracks, isMuted]);

    // Handle audio playback state
    useEffect(() => {
      audioRefs.current.forEach((audio, index) => {
        const track = audioTracks[index];
        if (!track) return;

        audio.volume = track.volume;
        audio.muted = isMuted;

        if (isPlaying) {
          const currentTime = timelinePosition;
          if (currentTime >= track.startTime && currentTime <= track.endTime) {
            const audioTime = currentTime - track.startTime;
            audio.currentTime = audioTime;
            audio.play().catch(console.error);
          }
        } else {
          audio.pause();
        }
      });
    }, [isPlaying, timelinePosition, audioTracks, isMuted]);

    // Sync audio with timeline position
    useEffect(() => {
      audioRefs.current.forEach((audio, index) => {
        const track = audioTracks[index];
        if (!track) return;

        const currentTime = timelinePosition;
        if (currentTime >= track.startTime && currentTime <= track.endTime) {
          const audioTime = currentTime - track.startTime;
          if (Math.abs(audio.currentTime - audioTime) > 0.1) {
            audio.currentTime = audioTime;
          }
        } else {
          audio.pause();
        }
      });
    }, [timelinePosition, audioTracks]);

    // Calculate total duration from all clips
    useEffect(() => {
      if (currentClips.length > 0) {
        const totalDur = currentClips.reduce(
          (acc, clip) => acc + (clip.duration || 0),
          0
        );
        totalDuration.current = totalDur;
        onDurationChange(totalDur);
      }
    }, [currentClips, onDurationChange]);

    // Find current clip based on timeline position
    useEffect(() => {
      let accumulatedTime = 0;
      let foundIndex = 0;

      for (let i = 0; i < currentClips.length; i++) {
        const clipDuration = currentClips[i]?.duration || 0;
        if (
          timelinePosition >= accumulatedTime &&
          timelinePosition < accumulatedTime + clipDuration
        ) {
          foundIndex = i;
          break;
        }
        accumulatedTime += clipDuration;
      }

      setCurrentClipIndex(foundIndex);
    }, [timelinePosition, currentClips]);

    /**
     * Timeline position update handler
     * the time is from this field @currentTime - event.currentTarget.currentTime
     * Do not change this logic
     */

    const handleTimeUpdate = useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const playedSeconds = event.currentTarget.currentTime;
        if (isPlaying) {
          // Calculate timeline position
          let accumulatedTime = 0;
          const currentClip = currentClips[currentClipIndex];

          for (let i = 0; i < currentClipIndex; i++) {
            accumulatedTime += currentClips[i]?.duration || 0;
          }

          const timelinePos = accumulatedTime + playedSeconds;

          // WIP: cause music glitch
          // setTimelinePosition(timelinePos);

          onTimeUpdate(timelinePos);

          /**
           *  Next Clip Logic:
           *  Check if we need to switch to next clip
           *  need to ensure the duration is well defined
           *
           * if not, it will beack to the first clip
           */

          console.log(
            currentClipIndex,
            currentClips.length - 1,
            playedSeconds,
            currentClip.duration || 0
          );
          if (currentClip && playedSeconds >= (currentClip.duration || 0)) {
            console.log("B", currentClipIndex, currentClips.length - 1);
            if (currentClipIndex === currentClips.length - 1) {
              setCurrentClipIndex(0);
              safeSeekTo(0); // Reset to the start of the first clip
              setTimelinePosition(0);
              onTimeUpdate(0);
              audioRefs.current.forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
              });
              return;
            }
            if (currentClipIndex < currentClips.length - 1) {
              setCurrentClipIndex(currentClipIndex + 1);
            }
          }
        }
      },
      [isPlaying, currentClips, currentClipIndex, onTimeUpdate]
    );

    // Expose seekTo method
    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        setTimelinePosition(time);

        // Find which clip this time belongs to
        let accumulatedTime = 0;
        let targetClipIndex = 0;
        let seekTime = time;

        for (let i = 0; i < currentClips.length; i++) {
          const clipDuration = currentClips[i]?.duration || 0;
          if (
            time >= accumulatedTime &&
            time < accumulatedTime + clipDuration
          ) {
            targetClipIndex = i;
            seekTime = time - accumulatedTime;
            break;
          }
          accumulatedTime += clipDuration;
        }

        setCurrentClipIndex(targetClipIndex);
        safeSeekTo(seekTime);
      },
    }));

    // Handle clip changes
    useEffect(() => {
      if (currentClips[currentClipIndex]) {
        const currentClip = currentClips[currentClipIndex];
        let accumulatedTime = 0;

        for (let i = 0; i < currentClipIndex; i++) {
          accumulatedTime += currentClips[i]?.duration || 0;
        }

        const seekTime = timelinePosition - accumulatedTime;
        if (seekTime >= 0 && seekTime <= (currentClip.duration || 0)) {
          safeSeekTo(seekTime);
        }
      }
    }, [currentClipIndex, timelinePosition, currentClips]);

    const currentClip = currentClips[currentClipIndex];

    if (!currentClip) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">No video clips available</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {React.createElement(ReactPlayer as any, {
          ref: playerRef,
          src: currentClip.src,
          width: "100%",
          height: "100%",
          playing: isPlaying,
          volume: volume,
          muted: isMuted,
          onTimeUpdate: handleTimeUpdate,
          onError: (error: unknown) => {
            console.error("ReactPlayer error:", error);
          },
          onReady: () => {
            // Player is ready
          },
        })}
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
