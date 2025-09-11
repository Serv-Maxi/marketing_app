import { supabase } from "@/lib/supabase";

export type ModelType = "Image" | "Text" | "Video";

export type ModelRow = {
  id: string;
  type: ModelType;
  code: string;
  alt_code?: string;
  name: string;
  active?: boolean;
  price: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type ModelUpdate = {
  type?: ModelType;
  code?: string;
  alt_code?: string;
  name?: string;
  active?: boolean;
  price?: number;
  metadata?: Record<string, unknown> | null;
};

export const modelsService = {
  async list(): Promise<ModelRow[]> {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return data as ModelRow[];
  },

  async create(model: Omit<ModelRow, "id" | "created_at">): Promise<ModelRow> {
    const { data, error } = await supabase
      .from("models")
      .insert([model])
      .select();
    if (error) throw error;
    return data[0] as ModelRow;
  },

  async update(id: string, updates: ModelUpdate): Promise<ModelRow> {
    // If trying to set active to true, validate that metadata.payload exists
    if (updates.active === true) {
      // Get the current model to check its metadata
      const { data: currentModel, error: fetchError } = await supabase
        .from("models")
        .select("metadata")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Check if we're updating metadata or using existing metadata
      const metadata = updates.metadata || currentModel.metadata;

      // Check if metadata is null, undefined, or an empty object
      const isEmptyMetadata = !metadata || Object.keys(metadata).length === 0;

      // Validate payload exists in metadata
      if (isEmptyMetadata || !metadata.payload) {
        throw new Error(
          "To activate a model, you must set a payload in metadata"
        );
      }
    }

    const { data, error } = await supabase
      .from("models")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ModelRow;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("models").delete().eq("id", id);
    if (error) throw error;
  },
};
