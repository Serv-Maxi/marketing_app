import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Creation, creationService } from "@/services/database";
import { ChevronLeft, ChevronRight, Copy, Edit, RotateCcw } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface TextContent {
  creation: Creation[];
  navigateVariation: (val: string, arg: "prev" | "next") => void;
}
const TextContent = ({ creation, navigateVariation }: TextContent) => {
  const [isRegenerate, setIsRegenerate] = useState(false);

  const handleRegenerate = async (id: string) => {
    try {
      setIsRegenerate(true);
      await creationService.regenerateContent(id);
    } catch {
      console.log("Regenerate Error");
    } finally {
      setIsRegenerate(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {creation.map((result) => (
        <AccordionItem
          key={result.platform as string}
          value={result.platform}
          className="border border-gray-200 rounded-[16px] overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-[24px] hover:no-underline bg-white">
            <span className="font-semibold text-[16px]">{result.platform}</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-white border-t">
            <div className="relative">
              <div className="absolute top-0 right-0 flex items-center gap-[16px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => navigateVariation(result.platform, "prev")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {/* <span className="text-sm text-gray-600">
                          {(currentVariations[result.content_data] || 0) + 1}/
                          {getTotalVariations(result.content_data)}
                        </span> */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      // onClick={() =>
                      //   navigateVariation(result.platform, "next")
                      // }
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
                  >
                    <Edit className="w-[24px] h-[24px]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary text-[20px]"
                  >
                    <Copy className="w-[24px] h-[24px]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary text-[20px]"
                    onClick={() => handleRegenerate(result.id)}
                  >
                    {isRegenerate ? (
                      <Spinner variant="circle" />
                    ) : (
                      <RotateCcw className="w-[24px] h-[24px]" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="pt-[50px] mb-4">
                <div className="text-gray-700 leading-relaxed prose prose-gray max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(result.content)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TextContent;
