import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { FormData } from "@/types/form";

interface MainPromptSectionProps {
  register: UseFormRegister<FormData>;
}

const MainPromptSection = ({ register }: MainPromptSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-4">
        <label htmlFor="prompt" className="text-lg font-semibold">
          What is the content about?
        </label>
        <Textarea
          id="prompt"
          {...register("prompt")}
          className="h-[200px] rounded-[20px]"
          placeholder="Describe your content idea..."
        />
      </div>
    </Card>
  );
};

export default MainPromptSection;
