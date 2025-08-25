import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder } from "lucide-react";
import { Controller, Control } from "react-hook-form";
import { FormData } from "@/types/form";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { folderService } from "@/services/database";
import { Database } from "@/lib/database.types";
import Image from "next/image";
import { DEFAULT_FOLDER_TEMPLATES } from "@/components/shared/default-folders";
import { cn } from "@/lib/utils";

interface FoldersSectionProps {
  control: Control<FormData>;
}

type Folder = Database["public"]["Tables"]["folders"]["Row"];

const FoldersSection = ({ control }: FoldersSectionProps) => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const userFolders = await folderService.getFolders();
        setFolders(userFolders);
      } catch (error) {
        console.error("Error fetching folders:", error);
        setError("Failed to load folders. Please try again.");
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [user?.id]);

  return (
    <Card className="p-[24px] bg-white rounded-[24px] shadow-none">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Choose Folders</h3>

        {/* Folders */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Folders</label>
          <Controller
            name="folder_id"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <SelectTrigger
                  className={cn(
                    "rounded-[12px]",
                    field.value ? "!border-2 !border-primary" : ""
                  )}
                >
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="p-2 text-sm text-gray-500">
                      Loading folders...
                    </div>
                  ) : error ? (
                    <div className="p-2 text-sm text-red-500">{error}</div>
                  ) : folders.length > 0 ? (
                    folders.map((folder) => (
                      <SelectItem
                        key={folder.id}
                        value={folder.id}
                        className="h-[50px]"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="rounded-[8px] p-[5px]"
                            style={{
                              backgroundColor: folder.color
                                ? folder.color
                                : "#F6F8FA",
                            }}
                          >
                            <Image
                              src={
                                DEFAULT_FOLDER_TEMPLATES.find(
                                  (t) =>
                                    t.title?.toLocaleLowerCase() ===
                                    folder.name.toLocaleLowerCase()
                                )?.icon ?? "/icons/folder.svg"
                              }
                              alt="Folder Icon"
                              width={16}
                              height={16}
                            />
                          </div>
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No folders available
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default FoldersSection;
