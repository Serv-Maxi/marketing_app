import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export const TasksService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      // Handle not found code without using any cast
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        (error as { code?: string }).code === "PGRST116"
      ) {
        return null;
      }
      throw error;
    }
    return data;
  },
  async createTask(task: Task[]): Promise<Task[]> {
    const { data, error } = await supabase.from("tasks").insert(task).select();
    if (error) throw error;
    return data;
  },
  async updateTask(
    id: string,
    updates: Database["public"]["Tables"]["tasks"]["Update"]
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
  async getTasksByStatus(
    userId: string,
    status: "pending" | "processing" | "completed" | "failed"
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getRecentTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    return data || [];
  },
  async getRecentTasksWithCreations(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        creations:contents(*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    return data || [];
  },
  async getTaskCountByFolder(folderId: string): Promise<number> {
    const { count, error } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("folder_id", folderId);
    if (error) throw error;
    return count ?? 0;
  },
};
