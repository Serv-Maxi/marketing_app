"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Edit,
  Copy,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  MoreHorizontal,
  LinkIcon,
} from "lucide-react";
import Image from "next/image";

// Mock data for demonstration
interface TextResult {
  platform: string;
  content: string;
  variations?: string[];
}

interface MediaResult {
  platform: string;
  content: string;
  resolution: string;
  imageUrl?: string;
  videoUrl?: string;
  duration?: string;
  variations?: Array<{
    imageUrl?: string;
    videoUrl?: string;
    content: string;
    duration?: string;
  }>;
}

interface ContentData {
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  results: TextResult[] | MediaResult[];
}

const mockData: Record<string, ContentData> = {
  TEXT: {
    type: "TEXT",
    title: "Social Media Campaign Text",
    description:
      "AI-generated text content for your marketing campaign across multiple platforms",
    icon: FileText,
    results: [
      {
        platform: "Facebook",
        content:
          "🚀 Discover the future of productivity with our revolutionary new app! Transform your daily workflow and achieve more than ever before. Join thousands of satisfied users who have already made the switch. #Productivity #Innovation #Success",
        variations: [
          "🌟 Ready to revolutionize your productivity? Our cutting-edge app is here to transform how you work! Experience seamless integration and powerful features. Join the productivity revolution today! #WorkSmart #Innovation",
          "💡 Boost your productivity to new heights! Our innovative app combines powerful features with intuitive design. See why professionals worldwide trust us with their workflow. Get started today! #Productivity #Professional",
        ],
      },
      {
        platform: "Instagram",
        content:
          "✨ Level up your productivity game! 📱 Our new app is changing how people work and achieve their goals. Swipe to see what makes us different! #ProductivityHack #WorkSmart #Success #Innovation",
        variations: [
          "🔥 Transform your workflow with our game-changing app! 💪 Join the productivity revolution and see real results. Your future self will thank you! #Productivity #Goals #Success",
          "⚡ Ready for a productivity breakthrough? Our app delivers results that speak for themselves. Discover what thousands of users already know! #ProductivityBoost #WorkFlow",
        ],
      },
    ],
  },
  IMAGE: {
    type: "IMAGE",
    title: "Visual Marketing Campaign",
    description:
      "AI-generated images with compelling text for your marketing campaigns",
    icon: ImageIcon,
    results: [
      {
        platform: "Instagram",
        imageUrl: "/video-1.mp4", // Using video as placeholder for image
        content:
          "🚀 Discover the future of productivity with our revolutionary new app! Transform your daily workflow and achieve more than ever before.",
        resolution: "9:16",
        variations: [
          {
            imageUrl: "/video-2.mp4",
            content:
              "🌟 Ready to revolutionize your productivity? Our cutting-edge app is here to transform how you work!",
          },
        ],
      },
      {
        platform: "Facebook",
        imageUrl: "/video-3.mp4",
        content:
          "💡 Boost your productivity to new heights! Our innovative app combines powerful features with intuitive design.",
        resolution: "16:9",
        variations: [
          {
            imageUrl: "/video-1.mp4",
            content:
              "✨ Level up your productivity game! Our new app is changing how people work and achieve their goals.",
          },
        ],
      },
    ],
  },
  VIDEO: {
    type: "VIDEO",
    title: "Video Marketing Campaign",
    description:
      "AI-generated videos with compelling content for your marketing campaigns",
    icon: Video,
    results: [
      {
        platform: "TikTok",
        videoUrl: "/video-1.mp4",
        content:
          "🚀 Discover the future of productivity with our revolutionary new app! Transform your daily workflow and achieve more than ever before.",
        duration: "15s",
        resolution: "9:16",
        variations: [
          {
            videoUrl: "/video-2.mp4",
            content:
              "🌟 Ready to revolutionize your productivity? Our cutting-edge app is here to transform how you work!",
            duration: "10s",
          },
        ],
      },
      {
        platform: "YouTube",
        videoUrl: "/video-3.mp4",
        content:
          "💡 Boost your productivity to new heights! Our innovative app combines powerful features with intuitive design.",
        duration: "20s",
        resolution: "16:9",
        variations: [
          {
            videoUrl: "/video-1.mp4",
            content:
              "✨ Level up your productivity game! Our new app is changing how people work and achieve their goals.",
            duration: "15s",
          },
        ],
      },
    ],
  },
};

type ContentType = "TEXT" | "IMAGE" | "VIDEO";

const CreationDetailPage = () => {
  const [selectedType, setSelectedType] = useState<ContentType>("TEXT");
  const [currentVariations, setCurrentVariations] = useState<{
    [key: string]: number;
  }>({});

  const currentData = mockData[selectedType];
  const IconComponent = currentData.icon;

  const handleAction = (
    action: string,
    platform?: string,
    content?: string
  ) => {
    console.log(`${action} action for ${platform}:`, content);
    // Implement actual functionality here
  };

  const navigateVariation = (platform: string, direction: "prev" | "next") => {
    const currentIndex = currentVariations[platform] || 0;
    const maxIndex =
      selectedType === "TEXT"
        ? mockData[selectedType].results.find((r) => r.platform === platform)
            ?.variations?.length || 0
        : mockData[selectedType].results.find((r) => r.platform === platform)
            ?.variations?.length || 0;

    let newIndex;
    if (direction === "next") {
      newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    }

    setCurrentVariations((prev) => ({
      ...prev,
      [platform]: newIndex,
    }));
  };

  const getCurrentContent = (platform: string) => {
    const result = currentData.results.find((r) => r.platform === platform);
    const variationIndex = currentVariations[platform] || 0;

    if (variationIndex === 0) {
      return result;
    }

    if (selectedType === "TEXT") {
      const textResult = result as TextResult;
      return {
        ...textResult,
        content:
          textResult?.variations?.[variationIndex - 1] || textResult?.content,
      };
    } else {
      const mediaResult = result as MediaResult;
      const variation = mediaResult?.variations?.[variationIndex - 1];
      return variation ? { ...mediaResult, ...variation } : mediaResult;
    }
  };

  const getTotalVariations = (platform: string) => {
    const result = currentData.results.find((r) => r.platform === platform);
    return (result?.variations?.length || 0) + 1;
  };

  return (
    <div className="container mx-auto p-8 bg-background">
      {/* Content Type Selector */}
      <div className="flex gap-4 mb-8">
        {(["TEXT", "IMAGE", "VIDEO"] as ContentType[]).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Header Card */}
      <Card className="p-8 bg-primary text-primary-foreground mb-8 shadow-none rounded-[24px]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-[16px]">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentData.title}</h1>
            <p className="text-primary-foreground/80 mt-2">
              {currentData.description}
            </p>
          </div>
          <div className="flex justify-end ml-auto">
            <Button className="bg-secondary">
              Copy Link <LinkIcon />
            </Button>
          </div>
        </div>
      </Card>

      {/* Content Results */}
      {selectedType === "TEXT" && (
        <Accordion type="single" collapsible className="space-y-4">
          {(currentData.results as TextResult[]).map((result) => (
            <AccordionItem
              key={result.platform}
              value={result.platform}
              className="border border-gray-200 rounded-[16px] overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-[24px] hover:no-underline bg-white">
                <span className="font-semibold text-[16px]">
                  {result.platform}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-white border-t">
                <div className="relative">
                  {/* Action Buttons */}
                  {/* Pagination */}
                  <div className="absolute top-0 right-0 flex items-center gap-[16px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            navigateVariation(result.platform, "prev")
                          }
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
                          onClick={() =>
                            navigateVariation(result.platform, "next")
                          }
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-0 bg-[#F8F3F9] p-[4px] rounded-[12px] overflow-hidden">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary text-[20px] !px-[4px]"
                        onClick={() =>
                          handleAction(
                            "edit",
                            result.platform,
                            getCurrentContent(result.platform)?.content
                          )
                        }
                      >
                        <Edit className="w-[24px] h-[24px]" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary text-[20px]"
                        onClick={() =>
                          handleAction(
                            "copy",
                            result.platform,
                            getCurrentContent(result.platform)?.content
                          )
                        }
                      >
                        <Copy className="w-[24px] h-[24px]" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary text-[20px]"
                        onClick={() => handleAction("reload", result.platform)}
                      >
                        <RotateCcw className="w-[24px] h-[24px]" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-[50px] mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {getCurrentContent(result.platform)?.content}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {(selectedType === "IMAGE" || selectedType === "VIDEO") && (
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
                <h3 className="text-lg font-semibold mb-4">
                  {result.platform}
                </h3>

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
                    {currentContent?.content}
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
      )}
    </div>
  );
};

export default CreationDetailPage;
