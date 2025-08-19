import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone } from "lucide-react";

interface AspectRatioProps {
  selectRatio: string;
  toogleAspectRatio: (resolution: string) => void;
}

const AspectRatio = ({ selectRatio, toogleAspectRatio }: AspectRatioProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Ratio Settings</h3>

        {/* Video Resolution */}
        <div className="space-y-3">
          <label className="text-sm font-medium mb-[4px]">Aspect Ratio</label>
          <div className="flex gap-3">
            <Badge
              variant={selectRatio === "16:9" ? "default" : "outline"}
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectRatio === "16:9"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toogleAspectRatio("16:9")}
            >
              <Monitor className="w-4 h-4" />
              16:9
            </Badge>
            <Badge
              variant={selectRatio === "9:16" ? "default" : "outline"}
              className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 ${
                selectRatio === "9:16"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toogleAspectRatio("9:16")}
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

export default AspectRatio;
