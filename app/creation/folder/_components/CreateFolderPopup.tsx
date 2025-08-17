"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Check, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";

interface CreateFolderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderData: { name: string; color: string }) => void;
}

const CreateFolderPopup = ({
  isOpen,
  onClose,
  onSave,
}: CreateFolderPopupProps) => {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3A3B88");

  const colors = ["#3A3B88", "#5AA84E", "#E3BD81", "#60B0A7", "#E66D53"];

  const handleSave = () => {
    if (folderName.trim()) {
      onSave({ name: folderName.trim(), color: selectedColor });
      setFolderName("");
      setSelectedColor("#3A3B88");
      onClose();
    }
  };

  const handleCancel = () => {
    setFolderName("");
    setSelectedColor("#3A3B88");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create new folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Folder Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Folder name</label>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="rounded-[12px]"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Colors</label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all ${
                    selectedColor === color
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-800" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Preview</label>
            <div className="flex justify-center">
              <Card className="h-[200px] w-[180px] rounded-[16px] shadow-none">
                <CardContent className="p-[18px] flex flex-col justify-between h-full">
                  <div
                    className="w-[65px] h-[65px] rounded-[12px] flex items-center justify-center"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Image
                      src="/icons/social-youtube.svg"
                      width={36}
                      height={29}
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="text-md">{folderName || "Folder Name"}</h3>
                    <span className="text-[12px]">0 Creation</span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-[12px]">
                      {formatDateShort(new Date())}
                    </span>
                    <EllipsisVertical width={18} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} className="px-6">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!folderName.trim()}
              className="px-6 bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderPopup;
