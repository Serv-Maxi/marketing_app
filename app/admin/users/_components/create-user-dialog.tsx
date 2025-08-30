// Moved from app/admin/_components/create-user-dialog.tsx
"use client";
import { z } from "zod";
import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { adminRolesService } from "@/services/adminRoles";
import { adminCompaniesService } from "@/services/adminCompanies";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().min(6, "Min 6 characters").optional()
    )
    .optional(),
  role: z.string().min(1, "Select a role"),
  company: z.string().min(1, "Select a company"),
});

export type CreateUserFormValues = z.infer<typeof schema>;
export type EditUserInput = {
  id: string;
  name: string | null;
  email: string;
  metadata: { roles?: string[]; companies?: string[] } | null;
};

interface CreateUserDialogProps {
  user?: EditUserInput;
  trigger?: React.ReactNode;
  onSaved?: () => void;
}

export default function CreateUserDialog({
  user,
  trigger,
  onSaved,
}: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const router = useRouter();
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "", company: "" },
  });

  function generatePassword() {
    const min = 6;
    const max = 12;
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&";
    let pwd = "";
    const randomArray = new Uint32Array(length);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(randomArray);
      for (let i = 0; i < length; i++)
        pwd += chars[randomArray[i] % chars.length];
    } else {
      for (let i = 0; i < length; i++)
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    form.setValue("password", pwd, { shouldDirty: true, shouldValidate: true });
  }

  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      try {
        const [r, c] = await Promise.all([
          adminRolesService.list(),
          adminCompaniesService.list(),
        ]);
        if (!active) return;
        const roleList = r.map((x: { id: unknown; name: string }) => ({
          id: String(x.id),
          name: x.name,
        }));
        const companyList = c.map((x: { id: unknown; name: string }) => ({
          id: String(x.id),
          name: x.name,
        }));
        setRoles(roleList);
        setCompanies(companyList);
        if (user) {
          const existingRoleRaw = user.metadata?.roles?.[0];
          const existingCompanyRaw = user.metadata?.companies?.[0];
          const existingRole =
            existingRoleRaw != null ? String(existingRoleRaw) : undefined;
          const existingCompany =
            existingCompanyRaw != null ? String(existingCompanyRaw) : undefined;
          const roleValue =
            existingRole && roleList.some((r) => r.id === existingRole)
              ? existingRole
              : roleList[0]?.id || "";
          const companyValue =
            existingCompany && companyList.some((c) => c.id === existingCompany)
              ? existingCompany
              : companyList[0]?.id || "";
          form.reset({
            name: user.name || "",
            email: user.email,
            password: "",
            role: roleValue,
            company: companyValue,
          });
        } else {
          if (!form.getValues("role") && roleList.length > 0)
            form.setValue("role", roleList[0].id);
          if (!form.getValues("company") && companyList.length > 0)
            form.setValue("company", companyList[0].id);
        }
      } catch {
        /* silent */
      }
    })();
    return () => {
      active = false;
    };
  }, [open, form, user]);

  useEffect(() => {
    if (!open) return;
    if (!form.getValues("company") && companies.length > 0) {
      form.setValue("company", companies[0].id, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [open, companies, form]);

  async function onSubmit(values: CreateUserFormValues) {
    setLoading(true);
    try {
      if (!user && !values.password) {
        toast.error("Password required");
        setLoading(false);
        return;
      }
      const metadata = {
        roles: values.role ? [values.role] : [],
        companies: values.company ? [values.company] : [],
      };
      if (user) {
        const updatePayload: Record<string, unknown> = {
          name: values.name,
          email: user.email,
          metadata,
        };
        if (values.password) updatePayload.password = values.password;
        const { error } = await supabase
          .from("users")
          .update(updatePayload)
          .eq("id", user.id)
          .select();
        if (error) throw error;
        toast.success("User updated");
      } else {
        const insertPayload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          metadata,
        };
        if (values.password) insertPayload.password = values.password;
        const { data, error } = await supabase
          .from("users")
          .insert([insertPayload])
          .select();
        if (error) throw error;
        if (!data?.[0]?.email) throw new Error("User insert did not return id");
        toast.success("User created");
        form.reset();
      }
      setOpen(false);
      if (onSaved) onSaved();
      else router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <div onClick={() => setOpen(true)}>{trigger}</div>
        ) : (
          <Button onClick={() => setOpen(true)}>
            <PlusIcon /> New User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[937px]">
        <DialogHeader className="pb-[24px]">
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[24px]"
        >
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Name
            </label>
            <Input placeholder="Enter Name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Email{" "}
            </label>
            <Input
              placeholder="Enter Email"
              type="email"
              disabled={!!user}
              className={user ? "opacity-70" : undefined}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Password{" "}
            </label>
            <div className="flex gap-2">
              <Input
                placeholder={
                  user ? "Leave blank to keep current" : "Enter Password"
                }
                type="text"
                {...form.register("password")}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
              >
                Generate
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Role
            </label>
            <RadioGroup
              value={form.watch("role")}
              onValueChange={(val) =>
                form.setValue("role", val, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="gap-2 grid grid-cols-3"
            >
              {roles.map((r) => (
                <div key={r.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.id} id={`role-${r.id}`} />
                  <label
                    htmlFor={`role-${r.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {r.name}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {form.formState.errors.role && (
              <p className="text-xs text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Company
            </label>
            <Select
              value={form.watch("company")}
              onValueChange={(val) =>
                form.setValue("company", val, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="rounded-[12px] h-[48px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.company && (
              <p className="text-xs text-red-500">
                {form.formState.errors.company.message}
              </p>
            )}
          </div>
          <div className="col-span-2 flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
