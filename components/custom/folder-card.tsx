import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { EllipsisVertical, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

interface FolderCardProps {
  folder: {
    icon: string;
    title: string;
    total: number;
    date: string;
    color: string;
  };
  onRename?: () => void;
}
const FolderCard = ({ folder, onRename }: FolderCardProps) => {
  return (
    <Card className="h-[200px] rounded-[16px] shadow-none border-[1px] border-[#F2F4F3] hover:border-primary cursor-pointer">
      <CardContent className="p-[18px] flex flex-col justify-between h-full">
        <div
          className="w-[65px] h-[65px] rounded-[12px] flex items-center justify-center"
          style={{
            backgroundColor: folder.color,
          }}
        >
          <Image src={folder.icon} width={36} height={29} alt="" />
        </div>
        <div>
          <h3 className="text-md">{folder?.title}</h3>
          <span className="text-[12px]">{folder.total} List</span>
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-[12px]">{folder.date}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
                aria-label="Folder actions"
              >
                <EllipsisVertical width={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRename?.();
                }}
              >
                <Pencil className="w-4 h-4 mr-2" /> Rename
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
