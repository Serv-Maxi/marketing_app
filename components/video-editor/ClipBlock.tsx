"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clip } from "@/lib/video-editor/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { Button } from "@/components/ui/button";
import { RotateCcw, Scissors } from "lucide-react";

interface ClipBlockProps {
  clip: Clip;
  index: number;
  zoom: number;
}

const ClipBlock: React.FC<ClipBlockProps> = ({ clip, index, zoom }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clip.id });

  const { updateClipTrim, restoreClipOriginalDuration, cutClip } =
    useTimelineStore();
  const [isResizing, setIsResizing] = useState<"start" | "end" | null>(null);
  const [originalClip, setOriginalClip] = useState<Clip | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showCutIndicator, setShowCutIndicator] = useState(false);
  const [cutPosition, setCutPosition] = useState<number>(0);
  const resizeStartX = useRef<number>(0);
  const isResizingRef = useRef<"start" | "end" | null>(null);
  const originalClipRef = useRef<Clip | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${(clip.endTime - clip.startTime) * zoom}px`,
    zIndex: isDragging ? 10 : 1,
  };

  // Generate a color based on the clip index for visual distinction
  const colors = [
    "bg-blue-500/20 border-blue-500",
    "bg-green-500/20 border-green-500",
    "bg-purple-500/20 border-purple-500",
    "bg-amber-500/20 border-amber-500",
    "bg-pink-500/20 border-pink-500",
  ];

  const colorClass = colors[index % colors.length];

  // Calculate if clip is trimmed
  const originalDuration =
    clip.originalDuration || clip.endTime - clip.startTime;
  const isTrimmed = clip.startTime > 0 || clip.endTime < originalDuration;
  const trimPercentage =
    ((clip.endTime - clip.startTime) / originalDuration) * 100;

  // Generate thumbnail from video
  useEffect(() => {
    const generateThumbnail = async () => {
      if (!videoRef.current) return;

      try {
        const video = videoRef.current;
        video.currentTime =
          clip.startTime + (clip.endTime - clip.startTime) / 2;

        video.addEventListener(
          "loadeddata",
          () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0);

              const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.7);
              setThumbnailUrl(thumbnailDataUrl);
            }
          },
          { once: true }
        );
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    };

    generateThumbnail();
  }, [clip.src, clip.startTime, clip.endTime]);

  const handleResizeStart = (e: React.MouseEvent, side: "start" | "end") => {
    e.stopPropagation();
    console.log("Starting resize:", side, "for clip:", clip.id);
    setIsResizing(side);
    setOriginalClip(clip);
    // Also store in refs for the event listeners
    isResizingRef.current = side;
    originalClipRef.current = clip;
    resizeStartX.current = e.clientX;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    const currentIsResizing = isResizingRef.current;
    const currentOriginalClip = originalClipRef.current;

    if (!currentIsResizing || !currentOriginalClip) {
      return;
    }

    const deltaX = e.clientX - resizeStartX.current;
    const deltaTime = deltaX / zoom;

    if (currentIsResizing === "start") {
      const newStartTime = Math.max(
        0,
        currentOriginalClip.startTime + deltaTime
      );
      const newEndTime = Math.max(
        newStartTime + 0.1,
        currentOriginalClip.endTime
      );

      updateClipTrim(clip.id, newStartTime, newEndTime);
    } else {
      const newEndTime = Math.max(
        currentOriginalClip.startTime + 0.1,
        currentOriginalClip.endTime + deltaTime
      );

      updateClipTrim(clip.id, currentOriginalClip.startTime, newEndTime);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    setOriginalClip(null);
    isResizingRef.current = null;
    originalClipRef.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleRestoreOriginal = () => {
    restoreClipOriginalDuration(clip.id);
  };

  const handleClipClick = (e: React.MouseEvent) => {
    // Only handle click if not resizing and not dragging
    if (isResizing || isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clipWidth = rect.width;

    // Calculate the time position of the click
    const relativePosition = clickX / clipWidth;
    const cutTime =
      clip.startTime + (clip.endTime - clip.startTime) * relativePosition;

    // Don't cut too close to the edges (minimum 0.5 seconds from each edge)
    const minCutTime = clip.startTime + 0.5;
    const maxCutTime = clip.endTime - 0.5;

    if (cutTime >= minCutTime && cutTime <= maxCutTime) {
      cutClip(clip.id, cutTime);
    }
  };

  const handleClipMouseMove = (e: React.MouseEvent) => {
    if (isResizing || isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const clipWidth = rect.width;

    // Show cut indicator when mouse is not near edges
    const edgeThreshold = 20; // pixels
    const isNearEdge =
      mouseX < edgeThreshold || mouseX > clipWidth - edgeThreshold;

    if (!isNearEdge) {
      setShowCutIndicator(true);
      setCutPosition(mouseX);
    } else {
      setShowCutIndicator(false);
    }
  };

  const handleClipMouseLeave = () => {
    setShowCutIndicator(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative h-16 rounded-md border ${colorClass} cursor-grab ${
          isDragging ? "opacity-70 shadow-lg" : ""
        } ${isResizing ? "cursor-ew-resize" : ""} group`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.3,
          delay: isDragging ? 0 : index * 0.05,
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          setShowControls(false);
          handleClipMouseLeave();
        }}
        onMouseMove={handleClipMouseMove}
        onClick={handleClipClick}
      >
        {/* Left resize handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 bg-primary/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "start")}
        />

        {/* Right resize handle */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 bg-primary/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "end")}
        />

        <div className="absolute inset-0 p-1 flex flex-col">
          {/* Thumbnail background */}
          <div className="rounded-md overflow-hidden relative flex-1">
            <div
              className="w-full h-full"
              style={
                thumbnailUrl
                  ? {
                      backgroundImage: `url(${thumbnailUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "repeat",
                    }
                  : {}
              }
            >
              {!thumbnailUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>

            {/* Trim indicator overlay */}
            {isTrimmed && (
              <div className="absolute inset-0 bg-black/20 border-2 border-yellow-400 rounded">
                <div className="absolute top-1 left-1 text-xs bg-yellow-400 text-black px-1 rounded">
                  {trimPercentage.toFixed(0)}%
                </div>
              </div>
            )}

            {/* Cut indicator line */}
            {showCutIndicator && !isResizing && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20"
                style={{ left: `${cutPosition}px` }}
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <Scissors className="h-3 w-3 text-red-500 bg-white rounded-full p-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Duration and controls */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] font-semibold text-foreground">
              {(clip.endTime - clip.startTime).toFixed(1)}s
            </span>

            {/* Control buttons - only show on hover */}
            {showControls && (
              <div className="flex gap-1">
                {/* Cut instruction */}
                {showCutIndicator && (
                  <span className="text-[8px] text-red-500 font-medium">
                    Click to cut
                  </span>
                )}

                {/* Restore button */}
                {isTrimmed && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={handleRestoreOriginal}
                    title="Restore original duration"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hidden video for thumbnail generation */}
        <video
          ref={videoRef}
          src={clip.src}
          className="hidden"
          muted
          playsInline
          onLoadedData={() => {
            // Trigger thumbnail generation
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ClipBlock;
