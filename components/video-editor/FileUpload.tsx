"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, Video } from "lucide-react";
import { toast } from "sonner";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";

interface FileUploadProps {
  onVideoAdded?: (videoUrl: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onVideoAdded }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; url: string }[]
  >([]);
  const { clips, initializeClips } = useTimelineStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      const newFiles: { name: string; url: string }[] = [];

      for (const file of acceptedFiles) {
        // Create object URL for the file
        const videoUrl = URL.createObjectURL(file);
        newFiles.push({ name: file.name, url: videoUrl });

        // Call the callback if provided
        if (onVideoAdded) {
          onVideoAdded(videoUrl, file.name);
        }
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setUploading(false);

      toast.success(`Successfully uploaded ${acceptedFiles.length} video(s)`);
    },
    [onVideoAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    multiple: true,
  });

  const addVideoToTimeline = (videoUrl: string, fileName: string) => {
    const newClip = {
      id: Date.now().toString(),
      src: videoUrl,
      startTime: 0,
      endTime: 10, // Default 10 seconds, will be updated when video loads
      title: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
    };

    initializeClips([...clips, newClip]);
    toast.success(`Added "${fileName}" to timeline`);
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    URL.revokeObjectURL(fileToRemove.url); // Clean up memory
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">
            Drop the videos here...
          </p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Drag & drop videos here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports MP4, MOV, AVI, MKV, WebM
            </p>
          </div>
        )}
        {uploading && <p className="text-sm text-primary mt-2">Uploading...</p>}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Videos</h3>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded"
            >
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addVideoToTimeline(file.url, file.name)}
                className="text-xs"
              >
                Add to Timeline
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="p-1 h-auto text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
