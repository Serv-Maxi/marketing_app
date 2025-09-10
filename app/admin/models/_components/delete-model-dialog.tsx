"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { modelsService } from "@/services/models";
import { toast } from "sonner";

interface DeleteModelDialogProps {
  modelId: string;
  onDeleted?: () => void;
}

export default function DeleteModelDialog({
  modelId,
  onDeleted,
}: DeleteModelDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function onDelete() {
    setLoading(true);
    try {
      await modelsService.remove(modelId);
      toast.success("Model deleted");
      setOpen(false);
      onDeleted?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete model");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Delete model"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Model</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to delete this model?</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
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
