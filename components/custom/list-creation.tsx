import Image from "next/image";
import { Card } from "../ui/card";
import { MoveRight } from "lucide-react";

export const ListCreation = () => {
  return (
    <Card className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px]">
      <div className="flex items-center gap-[12px]">
        <div className="rounded-[12px]">
          <Image src="/icons/type-video.svg" width={60} height={56} alt="" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-[14px] text-[#4D4D4D]">Title text generation</h3>
          <p className="text-[12px] text-[#4D4D4D]">12 Jun, 2025</p>
        </div>
      </div>
      <div>
        <MoveRight />
      </div>
    </Card>
  );
};
