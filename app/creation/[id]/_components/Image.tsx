import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { handleDownload } from "@/lib/download";
import { Creation } from "@/services/database";
import { Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface ImageContent {
  creation: Creation[];
}
const ImageContent = ({ creation }: ImageContent) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {creation.map((result, i) => {
        return <ListCard key={i} result={result} />;
      })}
    </div>
  );
};

const ListCard = ({ result }: { result: Creation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadImage = async (imageUrl: string, filename: string) => {
    setIsLoading(true);
    try {
      await handleDownload(imageUrl, filename);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Card
      key={result.platform}
      className="p-6 bg-white shadow-none rounded-[24px]"
    >
      <h3 className="text-lg font-semibold mb-4">{result.platform}</h3>

      {/* Media Container */}
      <div className="relative mb-4">
        <div
          className={`relative ${result.task.aspect_ratio === "9:16" ? "aspect-[9/16]" : "aspect-video"} bg-gray-100 rounded-[16px] overflow-hidden`}
        >
          <Image
            src={result.image_url}
            alt="Generated content"
            fill
            className="object-cover"
          />

          {/* More Options */}
          <div
            className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-[8px] cursor-pointer"
            onClick={() => downloadImage(result.image_url, "Untitled")}
          >
            {isLoading ? <Spinner variant="circle" /> : <Download />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageContent;
