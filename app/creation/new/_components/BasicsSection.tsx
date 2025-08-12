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
import { Controller, Control, FieldValues } from "react-hook-form";
import Image from "next/image";

interface BasicsSectionProps {
  control: Control<FieldValues>;
  platforms: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  selectedPlatforms: string[];
  togglePlatform: (platformId: string) => void;
}

const BasicsSection = ({
  control,
  platforms,
  selectedPlatforms,
  togglePlatform,
}: BasicsSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Basics</h3>

        {/* Platforms */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Platforms</label>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <Badge
                  key={platform.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`!rounded-[12px] h-[48px] cursor-pointer flex items-center gap-2 px-4 py-2 bg-background ${
                    isSelected
                      ? "bg-primary/5 border-primary text-primary"
                      : "hover:bg-background"
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <Image
                    width={24}
                    height={24}
                    src={platform.icon}
                    alt={platform?.name}
                  />
                  {platform.name}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Audience</label>
          <Controller
            name="targetAudience"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="millennials">Millennials</SelectItem>
                  <SelectItem value="gen-z">Gen Z</SelectItem>
                  <SelectItem value="gen-x">Gen X</SelectItem>
                  <SelectItem value="baby-boomers">Baby Boomers</SelectItem>
                  <SelectItem value="professionals">Professionals</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Campaign Goal */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Goal</label>
          <Controller
            name="campaignGoal"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select campaign goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Headline */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headline</label>
          <Controller
            name="headline"
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

export default BasicsSection;
