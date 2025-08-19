"use client";
import ContentType from "@/components/shared/content-type";
import DefaultFolders from "@/components/shared/default-folders";

const HomePage = () => {
  return (
    <div className="container mx-auto p-8 bg-background">
      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Filter Folder</h3>
      </div>
      <ContentType onTypeChange={() => {}} />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Your Folders</h3>
      </div>
      <DefaultFolders />
    </div>
  );
};

export default HomePage;
