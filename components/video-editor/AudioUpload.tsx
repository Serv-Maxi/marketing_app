"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Music, Upload } from "lucide-react";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { AudioTrack } from "@/lib/video-editor/types";

const AudioUpload: React.FC = () => {
  const { addAudioTrack } = useTimelineStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const url = URL.createObjectURL(file);

        // Create audio element to get duration
        const audio = document.createElement("audio");
        audio.src = url;
        audio.addEventListener("loadedmetadata", () => {
          const duration = audio.duration;

          const newAudioTrack: AudioTrack = {
            id: Math.random().toString(36).substr(2, 9),
            src: url,
            startTime: 0,
            endTime: duration,
            duration: duration,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            volume: 1.0,
          };

          addAudioTrack(newAudioTrack);
        });
      });
    },
    [addAudioTrack]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-orange-500 bg-orange-500/10"
          : "border-muted-foreground/25 hover:border-orange-500/50"
      }`}
    >
      <input {...getInputProps()} />
      <Music className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
      {isDragActive ? (
        <p className="text-sm text-muted-foreground">
          Drop audio files here...
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag & drop audio files here, or click to select
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            <Upload className="h-4 w-4 mr-2" />
            Choose Audio Files
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports MP3, WAV, OGG, M4A, AAC, FLAC
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
