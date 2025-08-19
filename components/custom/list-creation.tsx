import Image from "next/image";
import { Card } from "../ui/card";
import { Database } from "@/lib/database.types";
import { formatDateShort } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormData } from "@/types/form";
import { MoreVertical, ExternalLink, Trash, RotateCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { creationService } from "@/services/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface ListCreationProps {
  task?: Task;
}

const getContentTypeIcon = (contentType: string) => {
  switch (contentType?.toLowerCase()) {
    case "video":
      return "/icons/type-video-2.svg";
    case "image":
      return "/icons/type-image-2.svg";
    case "text":
      return "/icons/type-text-2.svg";
    default:
      return "/icons/type-text-2.svg";
  }
};

const getContentType = (contentData: unknown): string => {
  if (contentData && typeof contentData === "object" && contentData !== null) {
    const data = contentData as Partial<FormData>;
    return data.type || "text";
  }
  return "Text";
};

export const ListCreation = ({ task }: ListCreationProps) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) {
    return (
      <Card className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px] animate-pulse">
        <div className="flex items-center gap-[12px]">
          <div className="rounded-[12px] bg-gray-200 w-[60px] h-[56px]"></div>
          <div className="flex flex-col justify-center space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="bg-gray-200 w-6 h-6 rounded"></div>
      </Card>
    );
  }

  const icon = getContentTypeIcon(getContentType(task));

  const handleClick = () => {
    if (task.status === "Finished") {
      return router.push(`/creation/${task.id}`);
    }

    router.push(`/creation/process/${task.id}`);
  };
  const handleFolder = () => {
    if (!task) return;

    router.push(`/creation/folder/${task.folder_id}`);
  };
  const handleDelete = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      await creationService.deleteCreation(task.id as string);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete creation:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px] cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-[12px]" onClick={handleClick}>
          <div className="rounded-[12px] w-[60px]">
            <Image src={icon} width={60} height={56} alt={task.prompt} />
          </div>
          <div className="flex flex-col justify-center max-w-[80%]">
            <h3 className="text-[14px] text-[#4D4D4D] font-medium line-clamp-1">
              {task.prompt}
            </h3>
            <p className="text-[12px] text-[#4D4D4D]">
              {formatDateShort(task?.created_at as string)}
            </p>
          </div>
        </div>
        {task.status === "On Queue" ? (
          <Badge
            variant="outline"
            className="border-green-500 bg-green-500/5 text-green-500"
          >
            On Queue
          </Badge>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={handleClick}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFolder}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Folder
              </DropdownMenuItem>

              <DropdownMenuItem>
                <RotateCw className="mr-2 h-4 w-4" />
                Regenerate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(true)}
      >
        <DialogContent className="sm:max-w-[696px] bg-white">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this creation?
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
