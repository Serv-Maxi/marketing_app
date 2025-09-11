import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, Control } from "react-hook-form";
import { FormData } from "@/types/form";
import { useEffect, useState } from "react";
import { modelsService, ModelRow } from "@/services/models";
import { ContentType } from "@/types/global";

interface ModelSelectionProps {
  control: Control<FormData>;
  type: ContentType; // Added type prop to filter models based on content type
}

const ModelSelection = ({ control, type }: ModelSelectionProps) => {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch models only once on component mount
  useEffect(() => {
    const fetchModels = async () => {
      if (!type) return null;
      try {
        setLoading(true);
        const activeModels = await modelsService.getActiveModels({ type });

        // Filter out models with empty codes
        const validModels = activeModels.filter(
          (model) => model.code && model.code.trim() !== ""
        );
        setModels(validModels);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch models:", err);
        setError("Failed to load models. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [type]); // Empty dependency array - only run once on mount

  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select Model <span className="text-red-500">*</span>
          </label>
          <Controller
            name="model_code"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value || ""}
                disabled={loading || models.length === 0}
                defaultValue={models.length > 0 ? models[0].code : ""}
              >
                <SelectTrigger className="rounded-[12px]">
                  <SelectValue
                    placeholder={
                      loading ? "Loading models..." : "Select a model"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading models...
                    </SelectItem>
                  ) : models.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No models available
                    </SelectItem>
                  ) : (
                    models.map((model) => (
                      <SelectItem
                        key={model.id}
                        value={model.code || `model-${model.id}`}
                      >
                        {model.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </Card>
  );
};

export default ModelSelection;
