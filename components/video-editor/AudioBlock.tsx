"use client";
import React, { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AudioTrack } from "@/lib/video-editor/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioBlockProps {
  audioTrack: AudioTrack;
  index: number;
  zoom: number;
}

const AudioBlock: React.FC<AudioBlockProps> = ({ audioTrack, index, zoom }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: audioTrack.id });

  const { updateAudioTrack, removeAudioTrack } = useTimelineStore();
  const [isResizing, setIsResizing] = useState<"start" | "end" | null>(null);
  const [originalTrack, setOriginalTrack] = useState<AudioTrack | null>(null);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const resizeStartX = useRef<number>(0);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${(audioTrack.endTime - audioTrack.startTime) * zoom}px`,
    zIndex: isDragging ? 10 : 1,
  };

  const handleResizeStart = (e: React.MouseEvent, side: "start" | "end") => {
    e.stopPropagation();
    setIsResizing(side);
    setOriginalTrack(audioTrack);
    resizeStartX.current = e.clientX;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !originalTrack) return;

    const deltaX = e.clientX - resizeStartX.current;
    const deltaTime = deltaX / zoom;

    if (isResizing === "start") {
      const newStartTime = Math.max(0, originalTrack.startTime + deltaTime);
      const newEndTime = Math.max(newStartTime + 0.1, originalTrack.endTime);

      updateAudioTrack(audioTrack.id, {
        startTime: newStartTime,
        endTime: newEndTime,
      });
    } else {
      const newEndTime = Math.max(
        originalTrack.startTime + 0.1,
        originalTrack.endTime + deltaTime
      );

      updateAudioTrack(audioTrack.id, { endTime: newEndTime });
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    setOriginalTrack(null);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleVolumeChange = (value: number[]) => {
    updateAudioTrack(audioTrack.id, { volume: value[0] });
  };

  const handleRemove = () => {
    removeAudioTrack(audioTrack.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative h-12 rounded-md border-2 border-orange-500 bg-orange-500/20 cursor-grab ${
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
        <div className="absolute inset-0 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Volume2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
            <span className="text-xs font-medium truncate text-orange-800">
              {audioTrack.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-orange-700">
              {(audioTrack.endTime - audioTrack.startTime).toFixed(1)}s
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-orange-600/20"
              onClick={(e) => {
                e.stopPropagation();
                setShowVolumeControl(!showVolumeControl);
              }}
            >
              {audioTrack.volume > 0 ? (
                <Volume2 className="h-3 w-3" />
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-red-600/20"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Volume Control Popup */}
        {showVolumeControl && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 p-2 rounded-md w-32 z-20">
            <div className="flex items-center gap-2">
              <VolumeX className="h-3 w-3 text-white" />
              <Slider
                value={[audioTrack.volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <Volume2 className="h-3 w-3 text-white" />
            </div>
            <div className="text-xs text-white text-center mt-1">
              {Math.round(audioTrack.volume * 100)}%
            </div>
          </div>
        )}

        {/* Resize handles */}
        <div
          className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize bg-orange-600/70 hover:bg-orange-600 rounded-l flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, "start")}
        >
          <div className="w-0.5 h-6 bg-white rounded"></div>
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize bg-orange-600/70 hover:bg-orange-600 rounded-r flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, "end")}
        >
          <div className="w-0.5 h-6 bg-white rounded"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioBlock;
