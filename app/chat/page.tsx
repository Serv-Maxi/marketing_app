"use client";
import { useState } from "react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

import { Message } from "@/components/chat/MessageItem";
import { Button } from "@/components/ui/button";
import { Calculator, Globe, Image, UserPlus, Video } from "lucide-react";
import { sendMessageToAI } from "@/lib/api-service";

// Fallback id generator if uuid is not installed
function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const quickActions = [
  {
    icon: Image,
    label: "Generate Image",
    description: "Generate Image",
    prompt: "Generate Image",
  },
  {
    icon: Video,
    label: "Generate Video",
    description: "Generate Video",
    prompt: "Generate Video",
  },
  {
    icon: Globe,
    label: "Generate  Landing Page",
    description: "Generate Landing Page",
    prompt: "Generate Landing Page",
  },
  {
    icon: UserPlus,
    label: "Sign Up Form",
    description: "Build a registration form",
    prompt: "Build a registration form",
  },
  {
    icon: Calculator,
    label: "Calculate Factorial",
    description: "Math calculator tool",
    prompt: "Calculate the factorial of 10",
  },
];

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"welcome" | "chat">("welcome");

  // Send message to AI API and get response
  const sendAIResponse = async (userMessage: string) => {
    setLoading(true);
    try {
      const aiResponse = await sendMessageToAI(userMessage);
      
      setMessages((msgs) => [
        ...msgs,
        {
          id: genId(),
          role: "ai",
          content: aiResponse,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((msgs) => [
        ...msgs,
        {
          id: genId(),
          role: "ai",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setMessages((msgs) => [
      ...msgs,
      {
        id: genId(),
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      },
    ]);
    setInput("");
    setMode("chat");
    sendAIResponse(userMessage);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    setMode("chat");
    // Use a small timeout to ensure the input is set before sending
    setTimeout(() => {
      const userMessage = prompt.trim();
      setMessages((msgs) => [
        ...msgs,
        {
          id: genId(),
          role: "user",
          content: userMessage,
          timestamp: Date.now(),
        },
      ]);
      sendAIResponse(userMessage);
    }, 100);
  };

  return (
    <div className="flex flex-col w-full max-w-[800px] mx-auto overflow-hidden h-screen">
      {mode === "welcome" ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] p-8 gap-8">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Good afternoon, Rian Khanafi
          </h1>
          <div className="w-full max-full">
            <ChatInput
              value={input}
              loading={loading}
              onChange={setInput}
              onSend={handleSend}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="flex items-center gap-2 h-auto py-2 px-4 rounded-[12px] bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <MessageList messages={messages} />
          {loading && (
            <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground animate-pulse">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce mr-1" />
              AI is thinking...
            </div>
          )}
        </div>
      )}
      {/* Chat input at the bottom in chat mode */}
      {mode === "chat" && (
        <div className="w-full bg-background z-10 fixed bottom-0 max-w-[800px]">
          <ChatInput
            value={input}
            loading={loading}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      )}
    </div>
  );
};
