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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="rounded-[12px]">
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
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4" />
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
