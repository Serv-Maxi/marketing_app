import { Card, CardContent } from "../ui/card";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import FolderCard from "../custom/folder-card";

const DefaultFolders = () => {
  const router = useRouter();

  const FOLDERS = [
    {
      id: 1,
      title: "Youtube",
      date: "12 Jun, 2025",
      total: 13,
      icon: "/icons/folder-youtube.svg",
    },
    {
      id: 2,
      title: "Tiktok",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-tiktok.svg",
    },
    {
      id: 3,
      title: "Instagram",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-instagram.svg",
    },
    {
      id: 4,
      title: "Linkedin",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-linkedin.svg",
    },
    {
      id: 5,
      title: "Facebook",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-facebook.svg",
    },
    {
      id: 6,
      title: "X",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-x.svg",
    },
    {
      id: 6,
      title: "Website",
      total: 13,
      date: "12 Jun, 2025",
      icon: "/icons/folder-website.svg",
    },
  ];
  return (
    <div className="grid grid-cols-6 gap-[16px] mt-[12px]">
      <Card className="h-[200px] rounded-[16px] shadow-none border-primary border-[1.5px] cursor-pointer">
        <CardContent className="p-[18px] flex flex-col justify-between h-full">
          <div className="bg-primary w-[65px] h-[65px] rounded-[12px] flex items-center justify-center">
            <PlusIcon size={32} color="white" />
          </div>
          <div>
            <h3 className="text-primary">Create new</h3>
          </div>
        </CardContent>
      </Card>
      {FOLDERS.map((folder, index) => (
        <div key={index} onClick={() => router.push(`/creation/folder/detail`)}>
          <FolderCard folder={folder} />
        </div>
      ))}
    </div>
  );
};

export default DefaultFolders;
