import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { EllipsisVertical } from "lucide-react";

interface FolderCard {
  folder: {
    icon: string;
    title: string;
    total: number;
    date: string;
    color: string;
  };
}
const FolderCard = ({ folder }: FolderCard) => {
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
          <EllipsisVertical width={18} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
