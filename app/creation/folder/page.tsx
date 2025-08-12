"use client";
import ContentType from "@/components/shared/content-type";
import { useState } from "react";
import CreateFolderPopup from "./_components/CreateFolderPopup";
import DefaultFolders from "@/components/shared/default-folders";
import { RecentCreation } from "@/components/shared/recent-creation";

const HomePage = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    // Logic to handle folder creation
  };

  return (
    <div className="container mx-auto p-8 bg-background">
      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Filter Folder</h3>
      </div>
      <ContentType selectedType="TEXT" onTypeChange={() => {}} />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Recent Folders</h3>
      </div>
      <DefaultFolders />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Your latest generate</h3>
      </div>
      <RecentCreation />

      {/* Create Folder Popup */}
      <CreateFolderPopup
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSave={handleCreateFolder}
      />
    </div>
  );
};

export default HomePage;
