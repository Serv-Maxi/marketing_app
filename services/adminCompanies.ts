import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];

export const adminCompaniesService = {
  async list(): Promise<CompanyRow[]> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as CompanyRow[];
  },
  async create(name: string): Promise<CompanyRow> {
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name }])
      .select()
      .single();
    if (error) throw error;
    return data as CompanyRow;
  },
  async update(id: string, updates: { name?: string }): Promise<CompanyRow> {
    const { data, error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as CompanyRow;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) throw error;
  },
};
