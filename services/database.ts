import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { groupByDate, GroupedByDate } from "@/lib/grouping";

type Tables = Database["public"]["Tables"];
type Platform = Tables["platforms"]["Row"];
type Folder = Tables["folders"]["Row"];
export type Creation = Tables["contents"]["Row"];
type CreationResult = Tables["creation_results"]["Row"];
type Task = Tables["tasks"]["Row"];

// Platform Service
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

// Folder Service
export const folderService = {
  // Get all folders for a user
  async getFolders(): Promise<Folder[]> {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false });

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

  // Create a new folder
  async createFolder(folder: Tables["folders"]["Insert"]): Promise<Folder> {
    const { data, error } = await supabase
      .from("folders")
      .insert(folder)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update folder
  async updateFolder(
    id: string,
    updates: Tables["folders"]["Update"]
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

  // Delete folder
  async deleteFolder(id: string): Promise<void> {
    const { error } = await supabase.from("folders").delete().eq("id", id);

    if (error) throw error;
  },

  // Increment creation count
  async incrementCreationCount(folderId: string): Promise<void> {
    const { error } = await supabase.rpc("increment_creation_count", {
      folder_id: folderId,
    });

    if (error) throw error;
  },
};

// Creation Service
export const creationService = {
  // Get all creations for a user
  async getCreations(
    folderId?: string,
    searchQuery?: string
  ): Promise<Creation[]> {
    let query = supabase
      .from("contents")
      .select("*")
      .order("created_at", { ascending: false });

    if (folderId) {
      query = query.eq("folder_id", folderId);
    }

    if (searchQuery && searchQuery.trim()) {
      // Search across title, description, and content fields
      query = query.or(`title.ilike.%${searchQuery}%`);
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

    if (folderId) {
      query = query.eq("folder_id", folderId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },
  async getCreationsGroupedByDate(
    folderId?: string,
    formatType: "friendly" | "short" | "full" = "friendly",
    searchQuery?: string
  ): Promise<GroupedByDate<Creation>[]> {
    const creations = await this.getCreations(folderId, searchQuery);
    return groupByDate(creations, formatType);
  },

  // Update creation
  async updateCreation(
    id: string,
    updates: Tables["contents"]["Update"]
  ): Promise<Creation> {
    const { data, error } = await supabase
      .from("contents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get creation by ID with results and task
  async getCreationWithResults(id: string): Promise<Creation[]> {
    // Fetch creation with related task data
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

  // Delete creation
  async deleteCreation(id: string): Promise<void> {
    const { error } = await supabase.from("contents").delete().eq("id", id);

    if (error) throw error;
  },
};

// Tasks Service
export const TasksService = {
  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get task by ID
  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  },

  // Create a new task
  async createTask(task: Tables["tasks"]["Insert"][]): Promise<Task> {
    const { data, error } = await supabase.from("tasks").insert(task).select();
    if (error) throw error;
    return data;
  },

  // Update task
  async updateTask(
    id: string,
    updates: Tables["tasks"]["Update"]
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

  // Delete task
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  },

  // Get tasks by status
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

  // Get recent tasks (last 10)
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

  // Get task count by folder ID
  async getTaskCountByFolder(folderId: string): Promise<number> {
    const { count, error } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("folder_id", folderId); // assuming tasks has folder_id FK

    console.log("Task count:", count);
    if (error) throw error;
    return count ?? 0;
  },
};

// Creation Results Service
export const creationResultService = {
  // Add result to creation
  async addResult(
    result: Tables["creation_results"]["Insert"]
  ): Promise<CreationResult> {
    const { data, error } = await supabase
      .from("creation_results")
      .insert(result)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get results for creation
  async getResults(creationId: string): Promise<CreationResult[]> {
    const { data, error } = await supabase
      .from("creation_results")
      .select("*")
      .eq("creation_id", creationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update result
  async updateResult(
    id: string,
    updates: Tables["creation_results"]["Update"]
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

  // Delete result
  async deleteResult(id: string): Promise<void> {
    const { error } = await supabase
      .from("creation_results")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// User Service
export const userService = {
  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  },

  // Sign in with email
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign up with email
  async signUpWithEmail(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Update profile
  async updateProfile(updates: Tables["users"]["Update"]) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("No user found");

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
