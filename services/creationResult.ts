import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type CreationResult =
  Database["public"]["Tables"]["creation_results"]["Row"];

export const creationResultService = {
  async addResult(
    result: Database["public"]["Tables"]["creation_results"]["Insert"]
  ): Promise<CreationResult> {
    const { data, error } = await supabase
      .from("creation_results")
      .insert(result)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async getResults(creationId: string): Promise<CreationResult[]> {
    const { data, error } = await supabase
      .from("creation_results")
      .select("*")
      .eq("creation_id", creationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async updateResult(
    id: string,
    updates: Database["public"]["Tables"]["creation_results"]["Update"]
  ): Promise<CreationResult> {
    const { data, error } = await supabase
      .from("creation_results")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteResult(id: string): Promise<void> {
    const { error } = await supabase
      .from("creation_results")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
