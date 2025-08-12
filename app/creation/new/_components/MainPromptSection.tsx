import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface MainPromptSectionProps {
  register: UseFormRegister<FieldValues>;
}

const MainPromptSection = ({ register }: MainPromptSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-4">
        <label htmlFor="mainPrompt" className="text-lg font-semibold">
          What is the content about?
        </label>
        <Textarea
          id="mainPrompt"
          {...register("mainPrompt")}
          className="h-[200px] rounded-[20px]"
          placeholder="Describe your content idea..."
        />
      </div>
    </Card>
  );
};

export default MainPromptSection;
