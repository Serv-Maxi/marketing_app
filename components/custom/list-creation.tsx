import Image from "next/image";
import { Card } from "../ui/card";
import { MoveRight } from "lucide-react";
import { Database } from "@/lib/database.types";
import { formatDateShort } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormData } from "@/types/form";

type Creation = Database["public"]["Tables"]["contents"]["Row"];

interface ListCreationProps {
  creation?: Creation;
}

// Helper function to get content type icon
const getContentTypeIcon = (contentType: string) => {
  switch (contentType?.toLowerCase()) {
    case "video":
      return "/icons/type-video.svg";
    case "image":
      return "/icons/type-image.svg";
    case "text":
      return "/icons/type-text.svg";
    default:
      return "/icons/type-text.svg";
  }
};

// Helper function to get content type from content_data
const getContentType = (contentData: unknown): string => {
  if (contentData && typeof contentData === "object" && contentData !== null) {
    const data = contentData as Partial<FormData>;
    return data.contentType || "text";
  }
  return "text";
};

export const ListCreation = ({ creation }: ListCreationProps) => {
  const router = useRouter();

  // If no creation data, show skeleton/placeholder
  if (!creation) {
    return (
      <Card className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px] animate-pulse">
        <div className="flex items-center gap-[12px]">
          <div className="rounded-[12px] bg-gray-200 w-[60px] h-[56px]"></div>
          <div className="flex flex-col justify-center space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="bg-gray-200 w-6 h-6 rounded"></div>
      </Card>
    );
  }

  const contentType = getContentType(creation.content_data);
  const icon = getContentTypeIcon(contentType);

  const handleClick = () => {
    router.push(`/creation/detail/${creation.id}`);
  };

  return (
    <Card
      className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px] cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center gap-[12px]">
        <div className="rounded-[12px]">
          <Image
            src={icon}
            width={60}
            height={56}
            alt={`${contentType} icon`}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-[14px] text-[#4D4D4D] font-medium">
            {creation.title}
          </h3>
          <p className="text-[12px] text-[#4D4D4D]">
            {formatDateShort(creation.created_at)}
          </p>
        </div>
      </div>
      <div className="text-gray-400 hover:text-gray-600 transition-colors">
        <MoveRight size={20} />
      </div>
    </Card>
  );
};
