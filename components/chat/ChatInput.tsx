"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

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
      className="flex items-end gap-2 w-full rounded-[24px] pb-[12px] bg-[#131313] border"
    >
      <div className="flex w-full items-end gap-2 py-[8px] px-[20px] transition-colors">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border-none shadow-none text-md text-white placeholder:text-gray-400 focus-visible:ring-0 !bg-transparent min-h-[90px] font-semibold"
          disabled={loading}
          rows={2}
        />
        <Button
          type="submit"
          // disabled={loading || !value.trim()}
          className="!h-[40x] !px-[16px] text-white rounded-[20px] bg-[#9E2AB2] text-[14px]"
        >
          Send
          <SendIcon />
        </Button>
      </div>
    </form>
  );
}
