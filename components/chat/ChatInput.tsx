"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

export function ChatInput({
  value,
  loading,
  onChange,
  onSend,
}: {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading && value.trim()) onSend();
      }}
      className="flex items-end gap-2 w-full bg-background p-[12px]"
    >
      <div className="flex w-full items-end gap-2 p-4 rounded-[32px] bg-white dark:bg-[#312f31] shadow-sm hover:border-gray-500 dark:hover:border-gray-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors border-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border-none shadow-none text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 !bg-transparent text-gray-900 dark:text-gray-100 min-h-[110px]"
          disabled={loading}
          rows={2}
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !value.trim()}
          className="h-10 w-10 rounded-full bg-[#9E2AB2]"
        >
          <ArrowUp color="white" />
        </Button>
      </div>
    </form>
  );
}
