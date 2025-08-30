import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

export type PermissionRow = Database["public"]["Tables"]["permissions"]["Row"];
export type RolePermissionRow =
  Database["public"]["Tables"]["role_permissions"]["Row"];

export const adminPermissionsService = {
  async listPermissions(): Promise<PermissionRow[]> {
    const { data, error } = await supabase.from("permissions").select("*");
    if (error) throw error;
    return data as PermissionRow[];
  },
  async getRolePermissionIds(roleId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("role_id", roleId);
    if (error) throw error;
    return (data || []).map((r) => String(r.permission_id));
  },
  async setRolePermissions(roleId: string, permissionIds: string[]) {
    const rows: {
      role_id: string;
      permission_id: string;
      fields: unknown[];
    }[] = permissionIds.map((pid) => ({
      role_id: roleId,
      permission_id: pid,
      fields: [],
    }));
    const { data, error } = await supabase
      .from("role_permissions")
      .insert(rows)
      .select();
    if (error) throw error;
    return data;
  },
  async deleteRolePermissions(roleId: string) {
    const { error } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", roleId);
    if (error) throw error;
  },
};
