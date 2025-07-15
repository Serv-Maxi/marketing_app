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
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow transition",
          isUser
            ? "bg-[#131114] text-white rounded-br-md"
            : "bg-transparent text-white rounded-bl-md border border-none shadow-none"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
