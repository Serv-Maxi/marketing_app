"use client";

import { Card, CardContent } from "../ui/card";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { folderService } from "@/services/database";
import { Database } from "@/lib/database.types";
import { formatDateShort } from "@/lib/utils";
import FolderCard from "../custom/folder-card";

type Folder = Database["public"]["Tables"]["folders"]["Row"];

// Default folder templates for new users
const DEFAULT_FOLDER_TEMPLATES = [
  {
    title: "Youtube",
    icon: "/icons/folder-youtube.svg",
    color: "#FF0000",
  },
  {
    title: "TikTok",
    icon: "/icons/folder-tiktok.svg",
    color: "#000000",
  },
  {
    title: "Instagram",
    icon: "/icons/folder-instagram.svg",
    color: "#E4405F",
  },
  {
    title: "LinkedIn",
    icon: "/icons/folder-linkedin.svg",
    color: "#0077B5",
  },
  {
    title: "Facebook",
    icon: "/icons/folder-facebook.svg",
    color: "#1877F2",
  },
  {
    title: "X",
    icon: "/icons/folder-x.svg",
    color: "#1DA1F2",
  },
  {
    title: "Website",
    icon: "/icons/folder-website.svg",
    color: "#6B7280",
  },
];

const DefaultFolders = () => {
  const router = useRouter();
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

  const handleCreateNew = () => {
    router.push("/creation/new");
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/creation/folder/${folderId}`);
  };

  const handleRetry = () => {
    if (user?.id) {
      const fetchFolders = async () => {
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
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Card
            className="inline-flex cursor-pointer bg-primary text-white hover:bg-primary/90 rounded-[12px] shadow-none border-0"
            onClick={handleRetry}
          >
            <CardContent className="px-6 py-3">
              <span className="font-medium">Try again</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-[16px] mt-[12px]">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card
            key={index}
            className="h-[200px] rounded-[16px] shadow-none animate-pulse"
          >
            <CardContent className="p-[18px] flex flex-col justify-between h-full">
              <div className="bg-gray-200 w-[65px] h-[65px] rounded-[12px]"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state (no folders)
  if (!folders.length) {
    return (
      <div className="grid grid-cols-6 gap-[16px] mt-[12px]">
        <Card
          className="h-[200px] rounded-[16px] shadow-none border-primary border-[1.5px] cursor-pointer"
          onClick={handleCreateNew}
        >
          <CardContent className="p-[18px] flex flex-col justify-between h-full">
            <div className="bg-primary w-[65px] h-[65px] rounded-[12px] flex items-center justify-center">
              <PlusIcon size={32} color="white" />
            </div>
            <div>
              <h3 className="text-primary">Create new</h3>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-5 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No folders yet</p>
            <p className="text-sm">Create your first content to get started</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-6 gap-[16px] mt-[12px]">
      <Card
        className="h-[200px] rounded-[16px] shadow-none border-primary border-[1.5px] cursor-pointer"
        onClick={handleCreateNew}
      >
        <CardContent className="p-[18px] flex flex-col justify-between h-full">
          <div className="bg-primary w-[65px] h-[65px] rounded-[12px] flex items-center justify-center">
            <PlusIcon size={32} color="white" />
          </div>
          <div>
            <h3 className="text-primary">Create new</h3>
          </div>
        </CardContent>
      </Card>
      {folders.map((folder) => {
        // Find the corresponding template for the icon
        const template = DEFAULT_FOLDER_TEMPLATES.find(
          (t) =>
            t.title?.toLocaleLowerCase() === folder.name.toLocaleLowerCase()
        );
        const folderData = {
          id: folder.id,
          title: folder.name,
          date: formatDateShort(folder.created_at),
          total: folder.creation_count,
          icon: template?.icon || "/icons/folder-website.svg",
        };

        return (
          <div key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            <FolderCard folder={folderData} />
          </div>
        );
      })}
    </div>
  );
};

export default DefaultFolders;
