"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { adminPermissionsService } from "@/services/adminPermissions";
import { MultiCheckboxGroup } from "../../../../components/custom/multi-checkbox-group";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PlusIcon } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  permissions: z
    .array(z.string(), { required_error: "Select at least one permission" })
    .min(1, "Select at least one permission"),
});

type FormValues = z.infer<typeof schema>;

interface CreateRoleDialogProps {
  onCreated?: (role: { id: string; name: string }) => void;
}

export default function CreateRoleDialog({ onCreated }: CreateRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<
    { id: string; resource: string; action: string }[]
  >([]);
  const [permLoading, setPermLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", permissions: [] },
    mode: "onChange",
  });

  // Log form validation errors whenever they change (for debugging)
  useEffect(() => {
    const errs = form.formState.errors;
    if (Object.keys(errs).length > 0) {
      console.log("[CreateRoleDialog] form errors", errs);
    }
  }, [form.formState.errors]);

  useEffect(() => {
    if (!open) return;
    setPermLoading(true);
    let active = true;
    (async () => {
      try {
        const list = await adminPermissionsService.listPermissions();
        if (!active) return;
        setPermissions(
          list.map((p) => ({
            id: String(p.id),
            resource: p.resource,
            action: p.action,
          }))
        );
      } catch (e) {
        console.error("Failed loading permissions", e);
        toast.error("Failed to load permissions");
      } finally {
        active = false;
        setPermLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open]);
  // debug: watch form errors in dev (optional)
  // console.log(form.formState.errors);

  async function onSubmit(values: FormValues) {
    if (loading) return; // guard
    setLoading(true);
    try {
      const payload = { name: values.name } as const;
      const { data, error } = await supabase
        .from("roles")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      if (!data?.id) throw new Error("Role id missing in response");
      const selected = values.permissions; // guaranteed min 1
      await adminPermissionsService.setRolePermissions(data.id, selected);
      toast.success("Role created");
      form.reset();
      setOpen(false);
      // notify parent to refetch or update state
      onCreated?.({ id: data.id, name: data.name });
    } catch (e: unknown) {
      console.error("Create role failed", e);
      toast.error(e instanceof Error ? e.message : "Failed to create role");
    } finally {
      setLoading(false);
    }
  }

  const grouped = useMemo(
    () =>
      permissions.reduce<Record<string, { id: string; label: string }[]>>(
        (acc, p) => {
          const key = p.resource;
          acc[key] = acc[key] || [];
          acc[key].push({ id: p.id, label: p.action });
          return acc;
        },
        {}
      ),
    [permissions]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon />
          New Role
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[1024px]">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
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
          {permLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading permissions...
            </p>
          ) : permissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No permissions defined.
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(grouped).map(([resource, list]) => (
                  <div className="border p-4 rounded-sm" key={resource}>
                    <MultiCheckboxGroup
                      label={resource}
                      options={list.map((l) => ({
                        value: l.id,
                        label: l.label,
                      }))}
                      values={form.watch("permissions")}
                      onChange={(vals) =>
                        form.setValue("permissions", vals, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              {form.formState.errors.permissions && (
                <p className="text-xs text-red-500 pt-1">
                  {form.formState.errors.permissions.message as string}
                </p>
              )}
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                permLoading ||
                (form.watch("permissions")?.length ?? 0) === 0
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
