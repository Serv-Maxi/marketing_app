import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Smartphone } from "lucide-react";
import { Controller, Control, FieldValues } from "react-hook-form";

interface VideoSettingsSectionProps {
  control: Control<FieldValues>;
  selectedVideoResolution: string;
  toggleVideoResolution: (resolution: string) => void;
}

const VideoSettingsSection = ({
  control,
  selectedVideoResolution,
  toggleVideoResolution,
}: VideoSettingsSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Video Settings</h3>

        {/* Video Resolution */}
        <div className="space-y-3">
          <label className="text-sm font-medium mb-[4px]">Ratio</label>
          <div className="flex gap-3">
            <Badge
              variant={
                selectedVideoResolution === "16:9" ? "default" : "outline"
              }
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectedVideoResolution === "16:9"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleVideoResolution("16:9")}
            >
              <Monitor className="w-4 h-4" />
              16:9
            </Badge>
            <Badge
              variant={
                selectedVideoResolution === "9:16" ? "default" : "outline"
              }
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectedVideoResolution === "9:16"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleVideoResolution("9:16")}
            >
              <Smartphone className="w-4 h-4" />
              9:16
            </Badge>
          </div>
        </div>

        {/* Video Length */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Length</label>
          <Controller
            name="videoLength"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select video length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5s">5 seconds</SelectItem>
                  <SelectItem value="10s">10 seconds</SelectItem>
                  <SelectItem value="15s">15 seconds</SelectItem>
                  <SelectItem value="20s">20 seconds</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Caption/Subtitles */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Caption/Subtitles</label>
          <Controller
            name="captions"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default VideoSettingsSection;
