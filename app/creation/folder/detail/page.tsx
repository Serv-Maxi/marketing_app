"use client";
import ContentType from "@/components/shared/content-type";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateFolderPopup from "../../../../components/shared/CreateFolderPopup";
import { Input } from "@/components/ui/input";
import { RecentCreation } from "@/components/shared/recent-creation";

const HomePage = () => {
  const router = useRouter();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  return (
    <div className="container mx-auto p-8 bg-background">
      {/* Header Card */}
      <Card className="p-8 bg-primary text-primary-foreground mb-8 shadow-none rounded-[24px]">
        <div className="flex items-center gap-4">
          <div
            className="p-4 bg-white/20 rounded-[16px]"
            onClick={() => router.push("/creation/folder")}
          >
            <ChevronLeft className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">asas</h1>
            <p className="text-primary-foreground/80 mt-2">sasas</p>
          </div>
        </div>
      </Card>

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Filter Folder</h3>
      </div>
      <ContentType onTypeChange={() => {}} />

      <div className="mb-[24px] mt-[48px] flex justify-between items-center">
        <h3 className="text-[18px]">Your latest generate</h3>
        <Input placeholder="Search..." className="w-[350px] bg-white" />
      </div>
      <RecentCreation />

      {/* Create Folder Popup */}
      <CreateFolderPopup
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </div>
  );
};

export default HomePage;
