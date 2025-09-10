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
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { modelsService, ModelRow, ModelType } from "@/services/models";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    type: z.enum(["Image", "Text", "Video"] as const),
    code: z.string().min(1, "Code is required"),
    alt_code: z.string().default(""),
    name: z.string().min(1, "Name is required"),
    active: z.boolean().default(true),
    price: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().min(0, "Price must be a positive number")
    ),
    metadata: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return null;
        try {
          return JSON.parse(val);
        } catch {
          return null;
        }
      }),
  })
  .refine(
    (data) => {
      // If active is true, metadata must contain a payload
      if (data.active) {
        // Check if metadata is null, undefined, or an empty object
        const isEmptyMetadata =
          !data.metadata || Object.keys(data.metadata).length === 0;
        if (isEmptyMetadata || !data.metadata.payload) {
          return false;
        }
      }
      return true;
    },
    {
      message: "To activate a model, you must set a payload in metadata",
      path: ["active"],
    }
  );

export type CreateModelFormValues = z.infer<typeof schema>;

interface CreateModelDialogProps {
  model?: ModelRow;
  trigger?: React.ReactNode;
  onSaved?: () => void;
}

export default function CreateModelDialog({
  model,
  trigger,
  onSaved,
}: CreateModelDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<CreateModelFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "Text" as ModelType,
      code: "",
      alt_code: "",
      name: "",
      active: true,
      price: 0,
      metadata: "",
    },
  });

  useEffect(() => {
    if (open && model) {
      form.reset({
        type: model.type,
        code: model.code,
        alt_code: model.alt_code || "",
        name: model.name,
        active: model.active,
        price: model.price,
        metadata: model.metadata ? JSON.stringify(model.metadata, null, 2) : "",
      });
    }
  }, [open, model, form]);

  async function onSubmit(values: CreateModelFormValues) {
    setLoading(true);
    try {
      const modelData = {
        ...values,
        metadata: values.metadata || null,
      };

      if (model) {
        await modelsService.update(model.id, modelData);
        toast.success("Model updated");
      } else {
        await modelsService.create(modelData);
        toast.success("Model created");
        form.reset();
      }
      setOpen(false);
      if (onSaved) onSaved();
      else router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save model");
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
            <PlusIcon /> New Model
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader className="pb-[24px]">
          <DialogTitle>{model ? "Edit Model" : "Create Model"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[24px]"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Type
            </label>
            <Select
              value={form.watch("type")}
              onValueChange={(value: ModelType) =>
                form.setValue("type", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="rounded-[12px] h-[48px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-red-500">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Code
            </label>
            <Input placeholder="Enter Code" {...form.register("code")} />
            {form.formState.errors.code && (
              <p className="text-xs text-red-500">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Alt Code
            </label>
            <Input
              placeholder="Enter Alt Code"
              {...form.register("alt_code")}
            />
            {form.formState.errors.alt_code && (
              <p className="text-xs text-red-500">
                {form.formState.errors.alt_code.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Price
            </label>
            <Input
              type="number"
              placeholder="Enter Price"
              step="0.01"
              {...form.register("price")}
            />
            {form.formState.errors.price && (
              <p className="text-xs text-red-500">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-[8px] block">
              Metadata (JSON)
            </label>
            <Textarea
              placeholder='{"payload": {"data": "value"}}'
              className="font-mono text-sm h-32"
              {...form.register("metadata")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              A &quot;payload&quot; property is required to activate the model
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={form.watch("active")}
                onCheckedChange={(checked) =>
                  form.setValue("active", checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <label
                htmlFor="active"
                className="text-xs font-medium uppercase tracking-wide"
              >
                Active
              </label>
            </div>
            {form.formState.errors.active && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.active.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
