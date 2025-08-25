"use client";
import React, { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AudioTrack } from "@/lib/video-editor/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { useAudioWaveform } from "@/hooks/video-editor/useAudioWaveform";
import Waveform from "./Waveform";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, X, RotateCcw, Scissors, Copy } from "lucide-react";

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

  const {
    updateAudioTrack,
    removeAudioTrack,
    updateAudioTrim,
    restoreAudioOriginalDuration,
    duplicateAudioTrack,
    setCutSelection,
    selectedCut,
  } = useTimelineStore();
  const { waveformData, isLoading } = useAudioWaveform(audioTrack.src);
  const [isResizing, setIsResizing] = useState<"start" | "end" | null>(null);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showControls, setShowControls] = useState(false);
  const [showCutIndicator, setShowCutIndicator] = useState(false);
  const [hoverCutPixels, setHoverCutPixels] = useState<number>(0);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const resizeStartX = useRef<number>(0);
  const isResizingRef = useRef<"start" | "end" | null>(null);
  const originalTrackRef = useRef<AudioTrack | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${(audioTrack.endTime - audioTrack.startTime) * zoom}px`,
    zIndex: isDragging ? 10 : 1,
  };

  const handleResizeStart = (e: React.MouseEvent, side: "start" | "end") => {
    e.stopPropagation();
    setIsResizing(side);
    // Store in refs for the event listeners
    isResizingRef.current = side;
    originalTrackRef.current = audioTrack;
    resizeStartX.current = e.clientX;

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    const currentIsResizing = isResizingRef.current;
    const currentOriginalTrack = originalTrackRef.current;

    if (!currentIsResizing || !currentOriginalTrack) {
      return;
    }

    const deltaX = e.clientX - resizeStartX.current;
    const deltaTime = deltaX / zoom;

    if (currentIsResizing === "start") {
      const newStartTime = Math.max(
        0,
        currentOriginalTrack.startTime + deltaTime
      );
      const newEndTime = Math.max(
        newStartTime + 0.1,
        currentOriginalTrack.endTime
      );

      updateAudioTrim(audioTrack.id, newStartTime, newEndTime);
    } else {
      const newEndTime = Math.max(
        currentOriginalTrack.startTime + 0.1,
        currentOriginalTrack.endTime + deltaTime
      );

      updateAudioTrim(
        audioTrack.id,
        currentOriginalTrack.startTime,
        newEndTime
      );
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    isResizingRef.current = null;
    originalTrackRef.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleVolumeChange = (value: number[]) => {
    updateAudioTrack(audioTrack.id, { volume: value[0] });
  };

  const handleRemove = () => {
    removeAudioTrack(audioTrack.id);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (!contextMenuOpen) {
      setShowControls(false);
      setShowCutIndicator(false);
    }
  };

  const handleRestore = () => {
    restoreAudioOriginalDuration(audioTrack.id);
    setContextMenuOpen(false);
  };

  const handleDuplicate = () => {
    duplicateAudioTrack(audioTrack.id);
    setContextMenuOpen(false);
  };

  const handleCut = () => {
    // Execute pending cut selection via timeline toolbar (handled globally)
    setContextMenuOpen(false);
    setShowCutIndicator(false);
  };

  const handleAudioClick = (e: React.MouseEvent) => {
    if (isResizing || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const relative = clickX / width;
    const time =
      audioTrack.startTime +
      (audioTrack.endTime - audioTrack.startTime) * relative;
    const min = audioTrack.startTime + 0.5;
    const max = audioTrack.endTime - 0.5;
    if (time >= min && time <= max) {
      setCutSelection(audioTrack.id, time, "audio");
      setShowCutIndicator(true);
      setHoverCutPixels(clickX);
    }
  };

  const handleAudioMouseMove = (e: React.MouseEvent) => {
    if (isResizing || isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    if (mouseX < 0) mouseX = 0;
    if (mouseX > rect.width) mouseX = rect.width;
    // Don't show cut indicator when hovering over trim handle zones
    const trimHandleZone = 8; // pixels matching w-2 (~8px)
    const nearLeft = mouseX <= trimHandleZone;
    const nearRight = mouseX >= rect.width - trimHandleZone;
    if (nearLeft || nearRight) {
      if (selectedCut?.audioId !== audioTrack.id) {
        setShowCutIndicator(false);
      }
      return;
    }
    setShowCutIndicator(true);
    setHoverCutPixels(mouseX);
  };

  const handleAudioMouseLeave = () => {
    if (selectedCut?.audioId !== audioTrack.id) {
      setShowCutIndicator(false);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={(node) => {
          setNodeRef(node);
          if (node) {
            blockRef.current = node;
          }
        }}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative h-12 rounded-md border-2 border-orange-500 bg-orange-500/20 cursor-grab ${
          isDragging ? "opacity-70 shadow-lg" : ""
        } ${isResizing ? "cursor-ew-resize" : ""} ${showCutIndicator ? "cursor-crosshair" : ""} group`}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          handleMouseLeave();
          handleAudioMouseLeave();
        }}
        onMouseMove={handleAudioMouseMove}
        onClick={handleAudioClick}
        onContextMenu={handleRightClick}
        tabIndex={0}
      >
        {/* Waveform Background */}
        <div className="absolute inset-0 rounded-md overflow-hidden">
          {isLoading ? (
            // Loading state with animated bars
            <div className="flex items-center h-full gap-0.5 px-2">
              {Array.from(
                {
                  length: Math.floor(
                    ((audioTrack.endTime - audioTrack.startTime) * zoom) / 3
                  ),
                },
                (_, i) => (
                  <div
                    key={i}
                    className="bg-orange-400/40 animate-pulse"
                    style={{
                      width: "2px",
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <Waveform
              peaks={waveformData?.peaks || []}
              width={(audioTrack.endTime - audioTrack.startTime) * zoom}
              height={48}
              startTime={audioTrack.startTime}
              endTime={audioTrack.endTime}
              duration={
                waveformData?.duration ||
                audioTrack.endTime - audioTrack.startTime
              }
              color="#ea580c"
              backgroundColor="rgba(249, 115, 22, 0.1)"
            />
          )}
        </div>

        {/* Cut indicator line */}
        {(showCutIndicator || selectedCut?.audioId === audioTrack.id) &&
          !isResizing && (
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
              style={{
                left:
                  selectedCut?.audioId === audioTrack.id
                    ? `${((selectedCut.time - audioTrack.startTime) / (audioTrack.endTime - audioTrack.startTime)) * 100}%`
                    : `${hoverCutPixels}px`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <Scissors className="h-3 w-3 text-red-500 bg-white rounded-full p-0.5" />
              </div>
            </motion.div>
          )}

        <div className="absolute inset-0 p-2 flex items-center justify-between z-10">
          {/* <div className="flex items-center gap-2 flex-1 min-w-0 bg-black/50 rounded px-2 py-1">
            <Volume2 className="h-3 w-3 text-orange-300 flex-shrink-0" />
            <span className="text-xs font-medium truncate text-white">
              {audioTrack.title}
            </span>
          </div> */}

          <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
            <span className="text-xs text-orange-200">
              {(audioTrack.endTime - audioTrack.startTime).toFixed(1)}s
            </span>

            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-orange-600/20 text-white"
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
          className="absolute left-0 top-0 bottom-0 w-2 bg-orange-600/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "start")}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2 bg-orange-600/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "end")}
        />

        {/* Trim overlay for visual feedback */}
        {audioTrack.originalDuration &&
          audioTrack.originalDuration >
            audioTrack.endTime - audioTrack.startTime && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60" />
          )}
      </motion.div>

      {/* Context Menu */}
      <DropdownMenu open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
        <DropdownMenuTrigger asChild>
          {/* Invisible trigger positioned at right-click location */}
          <div
            style={{
              position: "fixed",
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              width: 1,
              height: 1,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" side="bottom" align="start">
          <DropdownMenuItem
            onClick={handleDuplicate}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Audio
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleCut();
            }}
            className="cursor-pointer"
            disabled={!selectedCut || selectedCut.audioId !== audioTrack.id}
          >
            <Scissors className="mr-2 h-4 w-4" />
            Pending Cut
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleRestore} className="cursor-pointer">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore Original Duration
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              handleRemove();
              setContextMenuOpen(false);
            }}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <X className="mr-2 h-4 w-4" />
            Remove Audio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AnimatePresence>
  );
};

export default AudioBlock;
