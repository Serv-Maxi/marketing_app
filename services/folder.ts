import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type Folder = Database["public"]["Tables"]["folders"]["Row"];

export const folderService = {
  async getFolders(limit?: number): Promise<Folder[]> {
    let query = supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async getFolderDetail(id: string): Promise<Folder | null> {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
  async createFolder(
    folder: Database["public"]["Tables"]["folders"]["Insert"]
  ): Promise<Folder> {
    const { data, error } = await supabase
      .from("folders")
      .insert(folder)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateFolder(
    id: string,
    updates: Database["public"]["Tables"]["folders"]["Update"]
  ): Promise<Folder> {
    const { data, error } = await supabase
      .from("folders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async renameFolder(id: string, name: string): Promise<Folder> {
    const { data, error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteFolder(id: string): Promise<void> {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) throw error;
  },
  async incrementCreationCount(folderId: string): Promise<void> {
    const { error } = await supabase.rpc("increment_creation_count", {
      folder_id: folderId,
    });
    if (error) throw error;
  },
};
