"use client";
import Image from "next/image";
import { Card } from "../ui/card";
import { ContentType } from "@/types/global";

interface ContentTypeProps {
  selectedType?: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentTypeComponent = ({
  selectedType,
  onTypeChange,
}: ContentTypeProps) => {
  const contentTypes = [
    {
      id: "Text" as ContentType,
      title: "Text",
      description: "Create your text creation",
      icon: "/icons/type-text.svg",
    },
    {
      id: "Image" as ContentType,
      title: "Image",
      description: "Create your image creation",
      icon: "/icons/type-image.svg",
    },
    {
      id: "Video" as ContentType,
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
          className={`shadow-none flex border-none items-center py-[24px] rounded-[18px] gap-[8px] h-[74px] p-[10px] cursor-pointer transition-all border-[1px] hover:border-primary hover:border-[1px] ${
            selectedType === type.id
              ? "ring-1 ring-primary bg-primary/5"
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

export default ContentTypeComponent;
