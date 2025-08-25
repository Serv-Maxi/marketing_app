"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { folderService, TasksService, type Folder } from "@/services/database";
import ContentType from "@/components/shared/content-type";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Plus } from "lucide-react";
import CreateFolderPopup from "../../../../components/shared/CreateFolderPopup";
import { Creations } from "@/components/shared/creations";
import LoadingComponent from "@/components/shared/loading-component";
import { Button } from "@/components/ui/button";
import { ContentType as TypeContentType } from "@/types/global";

const HomePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderDetail, setFolderDetail] = useState<Folder | null>(null);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TypeContentType | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No folder ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [folder, count] = await Promise.all([
          folderService.getFolderDetail(id as string),
          TasksService.getTaskCountByFolder(id as string),
        ]);

        setFolderDetail(folder);
        setTaskCount(count);

        if (!folder) {
          setError("Folder not found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load folder details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <LoadingComponent />;

  // Show error state
  if (error || !folderDetail) {
    return (
      <div className="container mx-auto p-8 bg-background">
        <div className="text-center py-12">
          <div className="text-lg text-red-600">
            {error || "Folder not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-background">
      {/* Header Card */}
      <Card className="p-8 bg-primary text-primary-foreground mb-8 shadow-none rounded-[24px]">
        <div className="flex items-center gap-4">
          <div
            className="p-4 bg-white/20 rounded-[16px] cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => router.push("/creation/folder")}
          >
            <ChevronLeft className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{folderDetail?.name}</h1>

            <div className="text-sm text-primary-foreground/60 mt-1">
              {taskCount} task{taskCount !== 1 ? "s" : ""} •{" "}
              {folderDetail?.creation_count} creation
              {folderDetail?.creation_count !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-[24px] mt-[48px] flex justify-between">
        <h3 className="text-[18px]">Filter Folder</h3>
        <Button
          variant="ghost"
          className="text-primary"
          onClick={() => router.push("/creation/new?folder=" + id)}
        >
          <Plus /> Add Creation
        </Button>
      </div>
      <ContentType
        onTypeChange={(type) => setSelectedType(type)}
        selectedType={selectedType ?? undefined}
      />

      <div className="mb-[24px] mt-[48px] flex justify-between items-center">
        <h3 className="text-[18px]">Your Creation</h3>
      </div>
      <Creations id={id as string} selectedType={selectedType} fromFolder />

      {/* Create Folder Popup */}
      <CreateFolderPopup
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </div>
  );
};

export default HomePage;
