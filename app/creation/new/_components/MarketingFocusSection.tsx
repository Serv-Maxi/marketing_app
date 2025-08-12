import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface MarketingFocusSectionProps {
  register: UseFormRegister<FieldValues>;
}

const MarketingFocusSection = ({ register }: MarketingFocusSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Marketing Focus</h3>

        {/* Value Proposition */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Value Proposition</label>
          <Input
            {...register("valueProposition")}
            className="rounded-[12px]"
            placeholder="What value do you provide to customers?"
          />
        </div>

        {/* Unique Selling Point */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Unique Selling Point (USP)
          </label>
          <Input
            {...register("uniqueSellingPoint")}
            className="rounded-[12px]"
            placeholder="What makes you different from competitors?"
          />
        </div>

        {/* Selling Features */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Selling Features</label>
          <Input
            {...register("sellingFeatures")}
            className="rounded-[12px]"
            placeholder="Specific features to highlight"
          />
        </div>

        {/* Call-to-Action */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Call-to-Action</label>
          <Input
            {...register("callToAction")}
            className="rounded-[12px]"
            placeholder="E.g., Visit our site, Comment below"
          />
        </div>
      </div>
    </Card>
  );
};

export default MarketingFocusSection;
