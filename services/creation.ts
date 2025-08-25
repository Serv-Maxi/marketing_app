import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { groupByDate, GroupedByDate } from "@/lib/grouping";
import { ContentType } from "@/types/global";

export type Creation = Database["public"]["Tables"]["contents"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export const creationService = {
  async getCreations(
    folderId?: string,
    searchQuery?: string,
    selectedType?: ContentType | null
  ): Promise<Task[]> {
    let query = supabase
      .from("tasks")
      .select(
        `
        *,
        creations:contents(*)
      `
      )
      .order("created_at", { ascending: false });

    if (folderId) query = query.eq("folder_id", folderId);
    if (selectedType) query = query.eq("type", selectedType);
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`prompt.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async getRecentCreations(folderId?: string): Promise<Creation[]> {
    let query = supabase
      .from("contents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (folderId) query = query.eq("folder_id", folderId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async getCreationsGroupedByDate(
    folderId?: string,
    formatType: "friendly" | "short" | "full" = "friendly",
    searchQuery?: string,
    selectedType?: ContentType | null
  ): Promise<GroupedByDate<Task>[]> {
    const creations = await this.getCreations(
      folderId,
      searchQuery,
      selectedType
    );
    const withDates = creations.filter(
      (c): c is Task & { created_at: string } => Boolean(c.created_at)
    );
    return groupByDate(withDates, formatType);
  },
  async updateCreation(
    id: string,
    updates: Partial<Database["public"]["Tables"]["contents"]["Row"]>
  ): Promise<Creation | null> {
    const { data, error } = await supabase
      .from("contents")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async getCreationWithResults(id: string): Promise<Creation[]> {
    const { data: creation, error: creationError } = await supabase
      .from("contents")
      .select(
        `
        *,
        task:tasks(*)
      `
      )
      .eq("task_id", id);
    if (creationError) throw creationError;
    return creation;
  },
  async deleteCreation(id: string): Promise<void> {
    const { error } = await supabase.from("contents").delete().eq("id", id);
    if (error) throw error;
  },
  async regenerateContent(id: string) {
    return await supabase.rpc("regenerate_content", { content_id: id });
  },
};
