"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { creationService, TasksService, Creation } from "@/services/database";
import VideoContent from "../../[id]/_components/Video";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import LoadingComponent from "@/components/shared/loading-component";
import Generating from "@/components/shared/generating";

// Video only view page (no header, no regenerate button). Includes Copy Link.
const VideoOnlyViewPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [contentData, setContentData] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No ID provided");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const task = await TasksService.getTaskById(id as string);
        if (task) setTaskStatus(task.status);
        const contentWithResults = await creationService.getCreationWithResults(
          id as string
        );
        setContentData(contentWithResults.filter((c) => !!c.video_url));
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCopyLink = async () => {
    if (!id) return;
    try {
      setCopying(true);
      const url = `${window.location.origin}/creation/view/${id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy");
    } finally {
      setCopying(false);
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (taskStatus === "On Queue")
    return <Generating taskId={id as string} selectedContentType="Video" />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleCopyLink}
          disabled={copying}
          className="bg-secondary"
        >
          {copying ? "Copying..." : "Copy Link"}{" "}
          <Copy className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <VideoContent creation={contentData} />
    </div>
  );
};

export default VideoOnlyViewPage;
