import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { handleDownload } from "@/lib/download";
import { Creation } from "@/services/database";
import { Download } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface VideoContent {
  creation: Creation[];
}
const VideoContent = ({ creation }: VideoContent) => {
  return (
    <div className="grid grid-cols-1">
      {creation.map((result, i) => {
        return <ListCard key={i} result={result} />;
      })}
    </div>
  );
};

const ListCard = ({ result }: { result: Creation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const downloadVideo = async (videoUrl: string, filename: string) => {
    setIsLoading(true);
    try {
      // Prefer mp4 extension for video downloads
      await handleDownload(videoUrl, filename, "mp4");
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const handleEditVideo = () => {
    if (!result.video_url) return;
    const params = new URLSearchParams();
    params.set("videoUrl", result.video_url);
    if (result.title) params.set("title", result.title);
    if (result.task?.aspect_ratio)
      params.set("ratio", result.task.aspect_ratio);
    router.push(`/editor?${params.toString()}`);
  };

  return (
    <Card
      key={result.platform}
      className="p-6 bg-white shadow-none rounded-[24px] relative"
    >
      <div className="flex justify-end gap-[16px]">
        <Button onClick={handleEditVideo} disabled={!result.video_url}>
          Edit Video
        </Button>
      </div>

      {/* Media Container */}
      <div className="relative mb-4 mt-3">
        <div
          className={`relative ${result.task.aspect_ratio === "9:16" ? "aspect-[9/16]" : "aspect-video"} bg-gray-100 rounded-[16px] overflow-hidden`}
        >
          {/* Video Player */}
          {result.video_url ? (
            <video
              src={result.video_url}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              No video available
            </div>
          )}

          {/* Download */}
          <div
            className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-[8px] cursor-pointer"
            onClick={() =>
              result.video_url && downloadVideo(result.video_url, "Untitled")
            }
          >
            {isLoading ? <Spinner variant="circle" /> : <Download />}
          </div>
        </div>
      </div>
      <h3>{result.title}</h3>
    </Card>
  );
};

export default VideoContent;
