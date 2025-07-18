import { useEffect, useRef, useState, useCallback } from "react";
import { Message, MessageItem } from "./MessageItem";
import { ChevronDown } from "lucide-react";

export function MessageList({ messages }: { messages: Message[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
      setIsAutoScrollEnabled(true);
    }
  }, []);

  // Handle scroll events to determine if we're at the bottom
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Consider "at bottom" if within 100px of the bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isAtBottom);
    setIsAutoScrollEnabled(isAtBottom);
  }, []);

  // Auto-scroll to bottom when new messages arrive, but only if already at bottom
  useEffect(() => {
    if (isAutoScrollEnabled && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!isAutoScrollEnabled && messages.length > 0) {
      // If new message arrives but auto-scroll is disabled, show the button
      setShowScrollButton(true);
    }
  }, [messages, isAutoScrollEnabled]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial check for scroll position
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative flex flex-col flex-1 h-full">
      <div
        ref={containerRef}
        className="flex flex-col gap-2 px-2 py-4 flex-1 overflow-y-auto h-full scroll-smooth"
      >
        {/* Optional: Add a "load more" button or indicator at the top */}
        {messages.length > 50 && (
          <div className="text-center text-xs text-gray-500 py-2">
            Showing most recent messages
          </div>
        )}

        {/* Virtualize rendering for large message lists */}
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}

        {/* Anchor for scrolling to bottom */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90 transition-opacity z-10"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
