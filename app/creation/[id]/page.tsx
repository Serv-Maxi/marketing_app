"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Creation, creationService, TasksService } from "@/services/database";

import { FileText, Image as ImageIcon, Video, LinkIcon } from "lucide-react";
import Image from "next/image";
import TextContent from "./_components/Text";
import Generating from "@/components/shared/generating";
import LoadingComponent from "@/components/shared/loading-component";

import ImageContent from "./_components/Image";
import VideoContent from "./_components/Video";

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

// Add type for the fetched content with relations

const CreationDetailPage = () => {
  const [selectedType, setSelectedType] = useState<ContentType>("TEXT");
  const [currentVariations, setCurrentVariations] = useState<{
    [key: string]: number;
  }>({});
  const [contentData, setContentData] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const { id } = useParams();

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

        // Simple task fetch by ID
        const task = await TasksService.getTaskById(id as string);

        if (task) {
          setTaskStatus(task.status);
          setSelectedType((task.type ?? "TEXT").toUpperCase() as ContentType);
        }

        // Fetch content with results (existing code)
        const contentWithResults = await creationService.getCreationWithResults(
          id as string
        );

        setSelectedType(
          (
            contentWithResults?.[0]?.task.type ?? "TEXT"
          ).toUpperCase() as ContentType
        );
        setContentData(contentWithResults);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Show loading state
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-8 bg-background">
        <div className="text-center py-12">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const currentData = mockData[selectedType];

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

  if (taskStatus === "On Queue") {
    return <Generating taskId={id as string} selectedContentType="Text" />;
  }

  const icons = {
    IMAGE: "/icons/type-video-white.svg",
    VIDEO: "/icons/type-video-white.svg",
    TEXT: "/icons/type-text-white.svg",
  };
  return (
    <div className="container mx-auto p-8 bg-background">
      {/* Header Card */}
      <Card className="p-8 bg-primary text-primary-foreground mb-8 shadow-none rounded-[24px]">
        <div className="flex items-center gap-4">
          <div className="rounded-[12px] overflow-hidden">
            <Image
              src={icons[selectedType]}
              width={126}
              height={113}
              alt="Detail Header"
            />
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

      {selectedType === "TEXT" && (
        <TextContent
          creation={contentData}
          navigateVariation={navigateVariation}
        />
      )}
      {selectedType === "IMAGE" && <ImageContent creation={contentData} />}
      {selectedType === "VIDEO" && <VideoContent creation={contentData} />}
    </div>
  );
};

export default CreationDetailPage;
