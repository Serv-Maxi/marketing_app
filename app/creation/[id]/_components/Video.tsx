import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Creation } from "@/services/database";
import { ChevronLeft, ChevronRight, Copy, Edit, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ImageContent {
  creation: Creation[];
  navigateVariation: (val: string, arg: "prev" | "next") => void;
}
const ImageContent = ({ creation, navigateVariation }: ImageContent) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(currentData.results as MediaResult[]).map((result) => {
        const currentContent = getCurrentContent(
          result.platform
        ) as MediaResult;

        return (
          <Card
            key={result.platform}
            className="p-6 bg-white shadow-none rounded-[24px]"
          >
            <h3 className="text-lg font-semibold mb-4">{result.platform}</h3>

            {/* Media Container */}
            <div className="relative mb-4">
              <div
                className={`relative ${result.resolution === "9:16" ? "aspect-[9/16]" : "aspect-video"} bg-gray-100 rounded-[16px] overflow-hidden`}
              >
                {selectedType === "IMAGE" ? (
                  <Image
                    src={currentContent?.imageUrl || "/video-1.mp4"}
                    alt="Generated content"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <video
                      src={currentContent?.videoUrl || "/video-1.mp4"}
                      className="w-full h-full object-cover"
                      muted
                    />
                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    {/* Video Duration */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {currentContent?.duration || "15s"}
                    </div>
                    {/* More Options */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content Text */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {currentContent?.content}
                </Markdown>
              </p>
            </div>

            {/* Action Buttons and Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-primary/5 border-primary/20"
                  onClick={() =>
                    handleAction(
                      "edit",
                      result.platform,
                      currentContent?.content
                    )
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-primary/5 border-primary/20"
                  onClick={() =>
                    handleAction(
                      "copy",
                      result.platform,
                      currentContent?.content
                    )
                  }
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("reload", result.platform)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => navigateVariation(result.platform, "prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {(currentVariations[result.platform] || 0) + 1}/
                  {getTotalVariations(result.platform)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => navigateVariation(result.platform, "next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ImageContent;
