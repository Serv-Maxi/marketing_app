import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimeRulerSeekBar from "./TimeRulerSeekBar";
import ClipBlock from "./ClipBlock";
import AudioBlock from "./AudioBlock";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { Button } from "@/components/ui/button";
import { Clip } from "@/lib/video-editor/types";

interface TimelineProps {
  clips: Clip[];
  currentTime: number;
  duration: number;
  zoom: number;
  onSeek: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  clips,
  currentTime,
  duration,
  zoom,
  onSeek,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    reorderClips,
    audioTracks,
    selectedCut,
    executeCutSelection,
    clearCutSelection,
  } = useTimelineStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle scrolling when playhead reaches edge of visible area
  useEffect(() => {
    if (!timelineRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const playheadPosition = currentTime * zoom;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // If playhead is near the right edge, scroll right
    if (playheadPosition > scrollLeft + containerWidth - 100) {
      container.scrollLeft = playheadPosition - containerWidth + 100;
    }

    // If playhead is near the left edge, scroll left
    if (playheadPosition < scrollLeft + 100) {
      container.scrollLeft = Math.max(0, playheadPosition - 100);
    }
  }, [currentTime, zoom]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || isDragging) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX =
      e.clientX - rect.left + (containerRef.current?.scrollLeft || 0);
    const clickedTime = offsetX / zoom;

    if (clickedTime >= 0 && clickedTime <= duration) {
      onSeek(clickedTime);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = clips.findIndex((clip) => clip.id === active.id);
      const newIndex = clips.findIndex((clip) => clip.id === over.id);

      reorderClips(oldIndex, newIndex);
    }

    setIsDragging(false);
  };

  const totalWidth = Math.max(duration * zoom, 500);

  return (
    <div className="flex flex-col h-64">
      {selectedCut && (
        <div className="flex items-center gap-2 mb-2 bg-muted/40 border border-border rounded-md px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Pending {selectedCut.kind === "audio" ? "audio" : "clip"} cut at{" "}
            {selectedCut.time.toFixed(2)}s
          </span>
          <Button size="sm" variant="destructive" onClick={executeCutSelection}>
            Cut
          </Button>
          <Button size="sm" variant="ghost" onClick={clearCutSelection}>
            Cancel
          </Button>
        </div>
      )}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div
          ref={timelineRef}
          className="relative h-full"
          style={{ width: `${totalWidth}px` }}
          onClick={handleTimelineClick}
        >
          <TimeRulerSeekBar
            duration={duration}
            currentTime={currentTime}
            zoom={zoom}
            onSeek={onSeek}
          />

          <div className="mt-8 space-y-4">
            {/* Video Clips Track */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Video Clips
              </h3>
              <DndContext
                sensors={sensors}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={clips.map((clip) => clip.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      className="flex flex-row"
                      layout
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    >
                      {clips.map((clip, index) => (
                        <ClipBlock
                          key={clip.id}
                          clip={clip}
                          index={index}
                          zoom={zoom}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </div>

            {/* Audio Tracks */}
            {audioTracks.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2">
                  Audio Tracks
                </h3>
                <div className="flex flex-row">
                  {audioTracks.map((audioTrack, index) => (
                    <AudioBlock
                      key={audioTrack.id}
                      audioTrack={audioTrack}
                      index={index}
                      zoom={zoom}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
