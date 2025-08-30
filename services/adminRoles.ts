import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type RoleRow = Database["public"]["Tables"]["roles"]["Row"];

export const adminRolesService = {
  async list(): Promise<RoleRow[]> {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) throw error;
    return data as RoleRow[];
  },
  async create(name: string): Promise<RoleRow> {
    const { data, error } = await supabase
      .from("roles")
      .insert({ name })
      .select()
      .single();
    if (error) throw error;
    return data as RoleRow;
  },
  async update(id: string, updates: { name?: string }): Promise<RoleRow> {
    const { data, error } = await supabase
      .from("roles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as RoleRow;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) throw error;
  },
};
