import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type UserRow = Database["public"]["Tables"]["users"]["Row"] & {
  metadata?: { roles?: string[]; companies?: string[] } | null;
};
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export const adminUsersService = {
  async list(): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as UserRow[];
  },
  async update(id: string, updates: UserUpdate): Promise<UserRow> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as UserRow;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
  },
};
