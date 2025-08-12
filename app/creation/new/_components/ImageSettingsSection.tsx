import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone } from "lucide-react";

interface ImageSettingsSectionProps {
  selectedImageResolution: string;
  toggleImageResolution: (resolution: string) => void;
}

const ImageSettingsSection = ({
  selectedImageResolution,
  toggleImageResolution,
}: ImageSettingsSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Image Settings</h3>

        {/* Image Resolution */}
        <div className="space-y-3">
          <label className="text-sm font-medium mb-[4px]">Ratio</label>
          <div className="flex gap-3">
            <Badge
              variant={
                selectedImageResolution === "16:9" ? "default" : "outline"
              }
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectedImageResolution === "16:9"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleImageResolution("16:9")}
            >
              <Monitor className="w-4 h-4" />
              16:9
            </Badge>
            <Badge
              variant={
                selectedImageResolution === "9:16" ? "default" : "outline"
              }
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectedImageResolution === "9:16"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleImageResolution("9:16")}
            >
              <Smartphone className="w-4 h-4" />
              9:16
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageSettingsSection;
