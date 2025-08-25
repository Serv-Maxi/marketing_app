import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { copyToClipboard } from "@/lib/utils";
import { Creation, creationService } from "@/services/database";
import { ChevronLeft, ChevronRight, Copy, Edit, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/lib/database.types";
import { Response } from "@/components/ui/shadcn-io/ai/response";
interface TextContent {
  creation: Creation[];
  navigateVariation: (val: string, arg: "prev" | "next") => void;
}
const TextContent = ({ creation, navigateVariation }: TextContent) => {
  const [isRegenerate, setIsRegenerate] = useState(false);
  const [copyingContentId, setCopyingContentId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, string>>(
    {}
  );

  // helper to coerce string to DB content type without using any
  const toDbText = (s: string) =>
    s as unknown as Database["public"]["Tables"]["contents"]["Row"]["content"];

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

  const startEditing = (id: string, current: unknown) => {
    setEditingId(id);
    setEditedContent(
      (localOverrides[id] ?? (current != null ? String(current) : "")) || ""
    );
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedContent("");
  };

  const saveEditing = async (id: string) => {
    try {
      setSavingId(id);
      await creationService.updateCreation(id, {
        content: toDbText(editedContent),
      });
      setLocalOverrides((prev) => ({ ...prev, [id]: editedContent }));
      toast.success("Content updated");
      setEditingId(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update content");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {creation.map((result, i) => (
        <AccordionItem
          key={i}
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
                      variant="ghost"
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
                      variant="ghost"
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
                    onClick={() => {
                      if (result.id === editingId) {
                        startEditing("", "");
                      } else {
                        startEditing(result.id, result.content);
                      }
                    }}
                  >
                    <Edit className="w-[24px] h-[24px]" />
                  </Button>
                  {editingId !== result.id && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary text-[20px]"
                        onClick={async () => {
                          try {
                            setCopyingContentId(result.id);
                            const success = await copyToClipboard(
                              String(result.content)
                            );
                            if (success) {
                              toast.success("Content copied to clipboard");
                            } else {
                              toast.error("Failed to copy content");
                            }
                          } catch (error) {
                            toast.error("An error occurred while copying");
                            console.error("Copy error:", error);
                          } finally {
                            setCopyingContentId(null);
                          }
                        }}
                      >
                        {copyingContentId === result.id ? (
                          <Spinner variant="circle" />
                        ) : (
                          <Copy className="w-[24px] h-[24px]" />
                        )}
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
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="pt-[50px] mb-4">
                {editingId === result.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[180px] bg-[#F8F3F9] border-primary focus-visible:ring-primary rounded-[12px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-3"
                        disabled={savingId === result.id}
                        onClick={() => saveEditing(result.id)}
                      >
                        {savingId === result.id ? (
                          <Spinner variant="circle" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={cancelEditing}
                        disabled={savingId === result.id}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed prose prose-gray max-w-none bg-[#F8F3F9] rounded-[12px] p-[24px]">
                    <Response>
                      {localOverrides[result.id] ?? String(result.content)}
                    </Response>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TextContent;
