import { cn } from "@/lib/utils";
import { Copy, Edit, Link, Share } from "lucide-react";
import Image from "next/image";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
  type?: "text" | "image" | "video";
  mediaUrl?: string;
}

// Helper function to detect media type from content
const detectMediaType = (
  content: string
): { type: "text" | "image" | "video"; url?: string } => {
  // Check for image URLs
  const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const videoRegex = /\.(mp4|mov|avi|mkv|webm)$/i;

  // Check if content is a URL
  const urlRegex = /^https?:\/\/.+/;

  if (urlRegex.test(content)) {
    if (imageRegex.test(content)) {
      return { type: "image", url: content };
    } else if (videoRegex.test(content)) {
      return { type: "video", url: content };
    }
  }

  // Check for base64 images
  if (content.startsWith("data:image/")) {
    return { type: "image", url: content };
  }

  // Check for base64 videos
  if (content.startsWith("data:video/")) {
    return { type: "video", url: content };
  }

  return { type: "text" };
};

export function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const mediaInfo = message.type
    ? { type: message.type, url: message.mediaUrl }
    : detectMediaType(message.content);

  console.log("mediaInfo", mediaInfo);

  const renderContent = () => {
    switch (mediaInfo.type) {
      case "image":
        return (
          <div className="max-w-[300px] rounded-lg overflow-hidden">
            <Image
              src={mediaInfo.url || message.content}
              alt="Shared image"
              width={300}
              height={200}
              className="w-full h-auto object-cover"
            />
            {/* {message.content !== mediaInfo.url && (
              <p className="mt-2 text-sm">{message.content}</p>
            )} */}
          </div>
        );

      case "video":
        return (
          <div className="max-w-[400px] rounded-lg overflow-hidden">
            <video
              src={mediaInfo.url || message.content}
              controls
              className="w-full h-auto"
              style={{ maxHeight: "300px" }}
            >
              Your browser does not support the video tag.
            </video>
            {/* {message.content !== mediaInfo.url && (
              <p className="mt-2 text-sm">{message.content}</p>
            )} */}
          </div>
        );

      default:
        return <span>{message.content}</span>;
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex w-full my-2",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] px-4 py-1 rounded-2xl text-md transition font-medium leading-[1.75] font-[400]",
            isUser
              ? "bg-[#181818] text-white/90 rounded-[20px] px-[20px] py-[12px]"
              : "bg-transparent text-white rounded-bl-md border border-none shadow-none",
            mediaInfo.type !== "text" && "p-2"
          )}
          style={
            mediaInfo.type === "text"
              ? {
                  letterSpacing: "0.02em",
                  fontWeight: "500",
                }
              : {}
          }
        >
          {renderContent()}
        </div>
      </div>
      {!isUser && (
        <div className="flex gap-4 text-xs text-muted-foreground justify-start pl-4">
          <Copy size={18} />
          <Share size={18} />
          <Link size={18} />
          {message.type === "video" && <Edit size={18} />}
        </div>
      )}
    </div>
  );
}
