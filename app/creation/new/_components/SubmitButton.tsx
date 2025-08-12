import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading?: boolean;
}

const SubmitButton = ({ isLoading = false }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isLoading}
        className="text-secondary-foreground px-8 py-3 rounded-[12px]"
      >
        {isLoading ? "Creating..." : "Create Content"}
      </Button>
    </div>
  );
};

export default SubmitButton;
