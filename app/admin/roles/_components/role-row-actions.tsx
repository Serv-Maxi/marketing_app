"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiCheckboxGroup } from "../../../../components/custom/multi-checkbox-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRolesService } from "@/services/adminRoles";
import { adminPermissionsService } from "@/services/adminPermissions";
import { toast } from "sonner";

export default function RoleRowActions({
  role,
  onChanged,
}: {
  role: { id: string; name: string };
  onChanged?: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <EditRoleDialog role={role} onChanged={onChanged} />
      <DeleteRoleDialog roleId={role.id} onChanged={onChanged} />
    </div>
  );
}

function EditRoleDialog({
  role,
  onChanged,
}: {
  role: { id: string; name: string };
  onChanged?: () => void;
}) {
  return <EditRoleDialogClient role={role} onChanged={onChanged} />;
}

function EditRoleDialogClient({
  role,
  onChanged,
}: {
  role: { id: string; name: string };
  onChanged?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [allPerms, setAllPerms] = React.useState<
    { id: string; resource: string; action: string }[]
  >([]);
  const schema = z.object({
    name: z.string().min(1, "Name required"),
    permissions: z.array(z.string()).optional().default([]),
  });
  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: role.name, permissions: [] },
  });
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [perms, current] = await Promise.all([
          adminPermissionsService.listPermissions(),
          adminPermissionsService.getRolePermissionIds(role.id),
        ]);
        setAllPerms(
          perms.map((p) => ({
            id: String(p.id),
            resource: p.resource,
            action: p.action,
          }))
        );
        form.setValue(
          "permissions",
          current.map((id) => String(id)),
          { shouldDirty: false }
        );
      } catch {
        /* ignore */
      }
    })();
  }, [open, form, role.id]);
  const grouped = allPerms.reduce<
    Record<string, { id: string; label: string }[]>
  >((acc, p) => {
    acc[p.resource] = acc[p.resource] || [];
    acc[p.resource].push({ id: p.id, label: p.action });
    return acc;
  }, {});
  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await adminRolesService.update(role.id, { name: values.name });
      await adminPermissionsService.setRolePermissions(
        role.id,
        values.permissions || []
      );
      toast.success("Role updated");
      setOpen(false);
      onChanged?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          aria-label="Edit role"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[937px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <Input placeholder="Name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(grouped).map(([resource, list]) => (
              <MultiCheckboxGroup
                key={resource}
                label={resource}
                options={list.map((l) => ({ value: l.id, label: l.label }))}
                values={form.watch("permissions")}
                onChange={(vals) => form.setValue("permissions", vals)}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteRoleDialog({
  roleId,
  onChanged,
}: {
  roleId: string;
  onChanged?: () => void;
}) {
  return <DeleteRoleDialogClient roleId={roleId} onChanged={onChanged} />;
}
function DeleteRoleDialogClient({
  roleId,
  onChanged,
}: {
  roleId: string;
  onChanged?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  async function onDelete() {
    setLoading(true);
    try {
      await adminPermissionsService.deleteRolePermissions(roleId);
      await adminRolesService.remove(roleId);
      toast.success("Role deleted");
      setOpen(false);
      onChanged?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          aria-label="Delete role"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to delete this role?</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            onClick={onDelete}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
