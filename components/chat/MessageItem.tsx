import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full my-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <p
        className={cn(
          "max-w-[80%] px-4 py-1 rounded-2xl text-md transition font-medium leading-[1.75] font-[400]",
          isUser
            ? "bg-[#181818] text-white/90 rounded-[20px] px-[20px] py-[12px]"
            : "bg-transparent text-white rounded-bl-md border border-none shadow-none"
        )}
        style={{
          letterSpacing: "0.02em",
          fontWeight: "500",
        }}
      >
        {message.content}
      </p>
    </div>
  );
}
