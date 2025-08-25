import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "@/types/form";

interface MainPromptSectionProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const MainPromptSection = ({ register, errors }: MainPromptSectionProps) => {
  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-4">
        <label htmlFor="prompt" className="text-lg font-semibold">
          What is the content about? <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="prompt"
          {...register("prompt", { required: "Prompt is required" })}
          className="h-[200px] rounded-[20px]"
          placeholder="Describe your content idea..."
        />

        {errors.prompt && (
          <p className="text-sm text-red-500 mt-1">{errors.prompt.message}</p>
        )}
      </div>
    </Card>
  );
};

export default MainPromptSection;
