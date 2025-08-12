import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, Control, FieldValues } from "react-hook-form";

interface StyleOptimizationSectionProps {
  control: Control<FieldValues>;
}

const StyleOptimizationSection = ({
  control,
}: StyleOptimizationSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Style & Optimization</h3>

        {/* Include Emojis */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Include Emojis</label>
          <Controller
            name="includeEmojis"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {/* Tone of Voice */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tone of Voice</label>
          <Controller
            name="toneOfVoice"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select tone of voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspiring">Inspiring</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default StyleOptimizationSection;
