"use client";
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCompaniesService } from "@/services/adminCompanies";
import { toast } from "sonner";
// removed router refresh; using callback from parent instead

export default function CompanyRowActions({
  company,
  onChanged,
}: {
  company: { id: string; name: string };
  onChanged?: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <EditCompanyDialog company={company} onChanged={onChanged} />
      <DeleteCompanyDialog companyId={company.id} onChanged={onChanged} />
    </div>
  );
}

function EditCompanyDialog({
  company,
  onChanged,
}: {
  company: { id: string; name: string };
  onChanged?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const schema = z.object({ name: z.string().min(1, "Name required") });
  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: company.name },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
  await adminCompaniesService.update(company.id, { name: values.name });
      toast.success("Company updated");
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
          aria-label="Edit company"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Input placeholder="Name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
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

function DeleteCompanyDialog({
  companyId,
  onChanged,
}: {
  companyId: string;
  onChanged?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  async function onDelete() {
    setLoading(true);
    try {
      await adminCompaniesService.remove(companyId);
      toast.success("Company deleted");
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
          aria-label="Delete company"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to delete this company?</p>
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
