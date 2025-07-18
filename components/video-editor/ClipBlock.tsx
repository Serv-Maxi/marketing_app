"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clip } from "@/lib/video-editor/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";

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

  const { updateClipTrim } = useTimelineStore();
  const [isResizing, setIsResizing] = useState<"start" | "end" | null>(null);
  const [originalClip, setOriginalClip] = useState<Clip | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const resizeStartX = useRef<number>(0);
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

  // Generate thumbnail from video
  useEffect(() => {
    const generateThumbnail = async () => {
      if (!videoRef.current) return;

      try {
        const video = videoRef.current;
        video.currentTime =
          clip.startTime + (clip.endTime - clip.startTime) / 2; // Middle of the clip

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
    setIsResizing(side);
    setOriginalClip(clip);
    resizeStartX.current = e.clientX;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !originalClip) return;

    const deltaX = e.clientX - resizeStartX.current;
    const deltaTime = deltaX / zoom;

    if (isResizing === "start") {
      const newStartTime = Math.max(0, originalClip.startTime + deltaTime);
      const newEndTime = Math.max(newStartTime + 0.1, originalClip.endTime);

      updateClipTrim(clip.id, newStartTime, newEndTime);
    } else {
      const newEndTime = Math.max(
        originalClip.startTime + 0.1,
        originalClip.endTime + deltaTime
      );

      updateClipTrim(clip.id, originalClip.startTime, newEndTime);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    setOriginalClip(null);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
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
        } ${isResizing ? "cursor-ew-resize" : ""}`}
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
      >
        <div className="absolute inset-0 p-1 flex flex-col">
          {thumbnailUrl && (
            <div className="flex justify-between items-start absolute bottom-0 left-1 right-0">
              {/* <span className="text-xs font-medium truncate">{clip.title}</span> */}
              <span className="text-[12px] font-semibold text-black relative z-10 pl-2 pb-1">
                {(clip.endTime - clip.startTime).toFixed(1)}s
              </span>
              <div
                className="absolute bottom-1 left-0 rounded-md"
                style={{
                  width: "100px",
                  height: "30px",
                  background:
                    "radial-gradient(100% 120% at 0% 120%, rgba(255, 255, 255, 0.8) 55%, rgba(0, 0, 0, 0))",
                }}
              ></div>
            </div>
          )}

          {/* Thumbnail */}
          <div className="rounded-md overflow-hidden">
            <div
              style={
                thumbnailUrl
                  ? {
                      backgroundImage: `url(${thumbnailUrl})`,
                      backgroundRepeat: "repeat",
                      backgroundSize: "55px",
                      height: "55px",
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
          </div>
        </div>

        {/* Hidden video element for thumbnail generation */}
        <video
          ref={videoRef}
          src={clip.src}
          className="hidden"
          muted
          playsInline
          onLoad={(e) => {
            const video = e.currentTarget;
            video.currentTime =
              clip.startTime + (clip.endTime - clip.startTime) / 2; // Middle of the clip

            console.log("Video loaded for thumbnail generation", video);
          }}
        />

        {/* Resize handles */}
        <div
          className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize bg-primary/70 hover:bg-primary rounded-l flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, "start")}
        >
          <div className="w-0.5 h-8 bg-white rounded"></div>
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize bg-primary/70 hover:bg-primary rounded-r flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, "end")}
        >
          <div className="w-0.5 h-8 bg-white rounded"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClipBlock;
