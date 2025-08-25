"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clip } from "@/lib/video-editor/types";
import { useTimelineStore } from "@/hooks/video-editor/useTimeline";
import { useFFmpeg } from "@/hooks/video-editor/useFFmpeg";
import { AlertCircle, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clips: Clip[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  clips,
}) => {
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  // Using sonner toast directly
  const { isReady, exportVideo, isMockMode } = useFFmpeg();
  const { audioTracks } = useTimelineStore();

  const handleExport = async () => {
    if (!isReady || clips.length === 0) {
      toast.error("Export failed", {
        description: "FFmpeg is not ready or no clips are available.",
      });
      return;
    }

    if (isMockMode) {
      toast.info("Using mock export mode", {
        description: "FFmpeg failed to load, using fallback export simulation.",
      });
    }

    setExportStatus("processing");
    setExportProgress(0);

    try {
      const result = await exportVideo(
        clips,
        (progress) => {
          setExportProgress(progress);
        },
        audioTracks
      );

      if (result) {
        // Create URL from blob
        const url = URL.createObjectURL(result);
        setVideoUrl(url);
        setExportStatus("success");
        toast.success("Export successful", {
          description: "Your video has been exported successfully.",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("error");
      toast.error("Export failed", {
        description: "There was an error exporting your video.",
      });
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `marketing-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetExport = () => {
    setExportStatus("idle");
    setExportProgress(0);
    setVideoUrl(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && exportStatus === "processing") {
      // Prevent closing while processing
      return;
    }

    if (!newOpen) {
      // Reset when closing
      resetExport();
    }

    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
          <DialogDescription>
            Combine your clips into a single video file.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {exportStatus === "idle" && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  Ready to export {clips.length} clip{clips.length !== 1 && "s"}{" "}
                  {audioTracks.length > 0 && (
                    <>
                      + {audioTracks.length} audio track
                      {audioTracks.length !== 1 && "s"}
                    </>
                  )}{" "}
                  (
                  {clips
                    .reduce(
                      (total, clip) => total + (clip.endTime - clip.startTime),
                      0
                    )
                    .toFixed(1)}
                  s video)
                </p>
              </div>
            </div>
          )}

          {exportStatus === "processing" && (
            <div className="space-y-4">
              <p className="text-sm">Processing video...</p>
              <Progress value={exportProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {exportProgress}%
              </p>
            </div>
          )}

          {exportStatus === "success" && (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <p>Your video has been exported successfully!</p>
              {videoUrl && (
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {exportStatus === "error" && (
            <div className="space-y-4 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <p>There was an error exporting your video.</p>
              <Button variant="outline" onClick={resetExport}>
                Try Again
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between">
          {exportStatus === "idle" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={!isReady || clips.length === 0}
              >
                Export
              </Button>
            </>
          )}

          {exportStatus === "processing" && (
            <Button disabled className="w-full">
              Processing...
            </Button>
          )}

          {exportStatus === "success" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
