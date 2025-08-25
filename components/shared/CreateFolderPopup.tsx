"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { folderService } from "@/services/database";
import { useForm } from "react-hook-form";

interface CreateFolderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormType {
  name: string;
  color: string;
  icon: string;
}

const CreateFolderPopup = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateFolderPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<FormType>({
      mode: "onChange",
      defaultValues: {
        name: "",
        color: "#9E2AB2",
        icon: "folder",
      },
    });

  // Watch color changes
  const selectedColor = watch("color");

  const onSubmit = async (data: FormType) => {
    try {
      setIsLoading(true);
      const newFolder = await folderService.createFolder([
        {
          name: data.name,
          color: data.color,
          icon: "",
          company_id: "8e8f7cfc-c5f4-4a33-a245-8dd695e2cfc7",
        },
      ]);

      if (newFolder.id) {
        onSuccess?.();
        onClose();
        setValue("name", "");
        setValue("color", "");
        setValue("icon", "");
      }
    } catch (error) {
      console.error("Failed to create folder:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ["#3A3B88", "#5AA84E", "#E3BD81", "#60B0A7", "#E66D53"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[696px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {/* Form */}

            <div className="space-y-2 mb-[24px]">
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                {...register("name")}
                className="rounded-[12px]"
                placeholder="What makes you different from competitors?"
              />
            </div>
            <div className="space-y-2 mb-[24px]">
              <label className="text-sm font-medium">Colors</label>
              <div className="flex gap-[4px]">
                {COLORS?.map((color) => (
                  <div
                    key={color}
                    className={`w-[48px] h-[48px] rounded-[16px] cursor-pointer ${
                      selectedColor === color ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue("color", color)}
                  />
                ))}
              </div>
              {/* <Input
                {...register("name")}
                className="rounded-[12px]"
                placeholder="What makes you different from competitors?"
              /> */}
            </div>
            <div className="mb-[24px]">
              <label className="text-sm font-medium mb-3 block">Preview</label>
              <Card className="h-[200px] w-[180px] rounded-[16px] shadow-none border-[1px] border-[#F2F4F3]">
                <CardContent className="p-[18px] flex flex-col justify-between h-full">
                  <div
                    className="w-[65px] h-[65px] rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: getValues().color }}
                  >
                    <Image
                      src={`/icons/folder.svg`}
                      width={36}
                      height={29}
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="text-md">
                      {getValues().name || "Folder Name"}
                    </h3>
                    <span className="text-[12px]">0 Creation</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[12px]">
                      {formatDateShort(new Date())}
                    </span>
                    <EllipsisVertical className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderPopup;
