import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { EllipsisVertical } from "lucide-react";

interface FolderCard {
  folder: {
    icon: string;
    title: string;
    total: number;
    date: string;
  };
}
const FolderCard = ({ folder }: FolderCard) => {
  return (
    <Card className="h-[200px] rounded-[16px] shadow-none border-[1.5px] hover:border-primary">
      <CardContent className="p-[18px] flex flex-col justify-between h-full">
        <div className="bg-background w-[65px] h-[65px] rounded-[12px] flex items-center justify-center">
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
