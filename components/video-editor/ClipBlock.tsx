"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clip } from "@/lib/video-editor/types";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <AnimatePresence>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative h-16 rounded-md border ${colorClass} cursor-grab ${
          isDragging ? "opacity-70 shadow-lg" : ""
        }`}
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
      <div className="absolute inset-0 p-2 flex flex-col">
        <div className="flex justify-between items-start">
          <span className="text-xs font-medium truncate">{clip.title}</span>
          <span className="text-xs text-muted-foreground">
            {(clip.endTime - clip.startTime).toFixed(1)}s
          </span>
        </div>

        {/* Thumbnail placeholder */}
        <div className="mt-1 h-6 w-full bg-muted/30 rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Clip {index + 1}
          </span>
        </div>
      </div>

      {/* Resize handles */}
      <div className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize bg-primary/50 rounded-l"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize bg-primary/50 rounded-r"></div>
    </motion.div>
    </AnimatePresence>
  );
};

export default ClipBlock;
