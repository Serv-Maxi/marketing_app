"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { folderService } from "@/services/database";
import { useForm } from "react-hook-form";

interface RenameFolderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  folderId: string | null;
  currentName?: string;
}

interface FormType {
  name: string;
}

const RenameFolder = ({
  isOpen,
  onClose,
  onSuccess,
  folderId,
  currentName,
}: RenameFolderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormType>({
    mode: "onChange",
    defaultValues: { name: currentName || "" },
  });

  useEffect(() => {
    setValue("name", currentName || "");
  }, [currentName, setValue, isOpen]);

  const onSubmit = async (data: FormType) => {
    try {
      setIsLoading(true);
      if (!folderId) return;
      await folderService.renameFolder(folderId, data.name.trim());
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to rename folder:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 mb-[8px]">
            <label className="text-sm font-medium">Folder Name</label>
            <Input
              {...register("name")}
              className="rounded-[12px]"
              placeholder="Enter folder name"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolder;
