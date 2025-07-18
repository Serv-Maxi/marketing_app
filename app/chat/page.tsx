"use client";
import { ChatBox } from "./components/Chat";

export default function Home() {
  return (
    <div className="">
      <div className="flex items-center justify-center min-h-screen rounded-[24px] bg-background">
        <ChatBox />
      </div>
    </div>
  );
}
