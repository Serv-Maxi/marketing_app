"use client";
import ContentType from "@/components/shared/content-type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowBigRight,
  ArrowRight,
  DotSquare,
  EllipsisVertical,
  MoveRight,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8 bg-background">
      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Quick Start</h3>
        <p>There are many variations of passages of Lorem Ipsum available</p>
      </div>
      <ContentType />

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Recent Folders</h3>
      </div>
      <div className="grid grid-cols-6 gap-[16px] mt-[12px]">
        {[...Array(6)].map((_, index) => {
          return index === 0 ? (
            <Card
              className="h-[200px] rounded-[16px] shadow-none border-primary"
              key={index}
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
          ) : (
            <Card className="h-[200px] rounded-[16px] shadow-none" key={index}>
              <CardContent className="p-[18px] flex flex-col justify-between h-full">
                <div className="bg-background w-[65px] h-[65px] rounded-[12px] flex items-center justify-center">
                  <Image
                    src="icons/social-youtube.svg"
                    width={36}
                    height={29}
                    alt=""
                  />
                </div>
                <div>
                  <h3 className="text-md">Youtube</h3>
                  <span className="text-[12px]">13 Creation</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-[12px]">12 Jun, 2025</span>
                  <EllipsisVertical width={18} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-[24px] mt-[48px]">
        <h3 className="text-[18px]">Your latest generate</h3>
      </div>
      <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
        {[...Array(5)].map((_, index) => (
          <Card
            className="shadow-none flex items-center justify-between py-[16px] px-[12px] rounded-[12px] gap-[8px] h-[84px]"
            key={index}
          >
            <div className="flex items-center gap-[12px]">
              <div className="rounded-[12px]">
                <Image
                  src="/icons/type-video.svg"
                  width={60}
                  height={56}
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[14px] text-[#4D4D4D]">
                  Title text generation
                </h3>
                <p className="text-[12px] text-[#4D4D4D]">12 Jun, 2025</p>
              </div>
            </div>
            <div>
              <MoveRight />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
