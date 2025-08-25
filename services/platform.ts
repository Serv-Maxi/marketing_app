import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type Platform = Tables["platforms"]["Row"];

export type { Platform };

export const platformService = {
  // Get all active platforms
  async getPlatforms(): Promise<Platform[]> {
    const { data, error } = await supabase
      .from("platforms")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create platform (admin only)
  async createPlatform(
    platform: Tables["platforms"]["Insert"]
  ): Promise<Platform> {
    const { data, error } = await supabase
      .from("platforms")
      .insert(platform)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
