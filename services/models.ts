import { supabase } from "@/lib/supabase";
import { ContentType } from "@/types/global";

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

export type PaginationParams = {
  page: number;
  pageSize: number;
  search?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export const modelsService = {
  async list(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ModelRow>> {
    let query = supabase.from("models").select("*", { count: "exact" });

    // Apply search if provided
    if (pagination?.search) {
      const searchTerm = pagination.search.toLowerCase();
      query = query.or(
        `name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%,alt_code.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`
      );
    }

    // Apply pagination if provided
    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }

    query = query.order("id", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    const pageSize = pagination?.pageSize || data.length;
    const page = pagination?.page || 1;
    const total = count || data.length;
    const pageCount = Math.ceil(total / pageSize);

    return {
      data: data as ModelRow[],
      total,
      page,
      pageSize,
      pageCount,
    };
  },

  async getActiveModels({ type }: { type: ContentType }): Promise<ModelRow[]> {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("active", true)
      .eq("type", type)
      .order("name", { ascending: true });

    if (error) throw error;

    // Filter out any models with empty codes to prevent Select component issues
    return (data as ModelRow[]).filter(
      (model) => model.code && model.code.trim() !== ""
    );
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
