"use client";
import ContentType from "@/components/shared/content-type";
import DefaultFolders from "@/components/shared/default-folders";
import { RecentCreation } from "@/components/shared/recent-creation";
import { StartCreation } from "@/components/shared/start-creation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto p-8 bg-background">
      <StartCreation />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px] mb-[8px]">Quick Start</h3>
        <p>Get started with you content type</p>
      </div>
      <ContentType
        onTypeChange={(type) => router.push(`/creation/new?type=${type}`)}
      />

      <div className="mt-[48px] flex justify-between items-center">
        <h3 className="text-[18px]">Recent Folders</h3>
        <Button
          variant="ghost"
          onClick={() => router.push(`/creation/folder`)}
          className="text-primary"
          style={{ float: "right" }}
        >
          View All Folders
        </Button>
      </div>
      <DefaultFolders limit={11} />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Your latest generate</h3>
      </div>
      <RecentCreation />
    </div>
  );
};

export default HomePage;
