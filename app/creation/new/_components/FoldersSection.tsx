import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "lucide-react";
import { Controller, Control, FieldValues } from "react-hook-form";

interface FoldersSectionProps {
  control: Control<FieldValues>;
}

const FoldersSection = ({ control }: FoldersSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Choose Folders</h3>

        {/* Folders */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Folders</label>
          <Controller
            name="folder"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing-campaigns">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Marketing Campaigns
                    </div>
                  </SelectItem>
                  <SelectItem value="social-media">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Social Media
                    </div>
                  </SelectItem>
                  <SelectItem value="product-launches">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Product Launches
                    </div>
                  </SelectItem>
                  <SelectItem value="brand-awareness">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Brand Awareness
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default FoldersSection;
