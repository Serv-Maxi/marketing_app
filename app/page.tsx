import { ChatBox } from "./chat/page";

export default function Home() {
  return (
    <div className="p-[12px]">
      <div className="flex items-center justify-center h-screen rounded-[24px] bg-background">
        <ChatBox />
      </div>
    </div>
  );
}
