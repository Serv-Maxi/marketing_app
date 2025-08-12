"use client";
import Image from "next/image";
import { Card } from "../ui/card";

export type ContentType = "TEXT" | "IMAGE" | "VIDEO";

interface ContentTypeProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentType = ({ selectedType, onTypeChange }: ContentTypeProps) => {
  const contentTypes = [
    {
      id: "TEXT" as ContentType,
      title: "Text",
      description: "Create your text creation",
      icon: "/icons/type-text.svg",
    },
    {
      id: "IMAGE" as ContentType,
      title: "Image",
      description: "Create your image creation",
      icon: "/icons/type-image.svg",
    },
    {
      id: "VIDEO" as ContentType,
      title: "Video",
      description: "Create your video creation",
      icon: "/icons/type-video.svg",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-[16px]">
      {contentTypes.map((type) => (
        <Card
          key={type.id}
          className={`shadow-none flex items-center py-[24px] rounded-[18px] gap-[8px] h-[74px] p-[10px] cursor-pointer transition-all border-[1.5px] hover:border-primary hover:border-[1.5px] ${
            selectedType === type.id
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:ring-1 hover:ring-gray-200"
          }`}
          onClick={() => onTypeChange(type.id)}
        >
          <div
            className={`p-[12px] rounded-[12px] ${
              selectedType === type.id ? "bg-primary" : "bg-primary"
            }`}
          >
            <Image src={type.icon} width={34} height={30} alt="" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className={selectedType === type.id ? "font-semibold" : ""}>
              {type.title}
            </h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ContentType;
