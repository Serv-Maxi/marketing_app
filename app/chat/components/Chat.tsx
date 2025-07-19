"use client";

import { useState } from "react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

import { Message } from "@/components/chat/MessageItem";
import { Button } from "@/components/ui/button";
import { Calculator, Globe, Image, UserPlus, Video } from "lucide-react";
import { ChatServices } from "@/services/chat";

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
    label: "Generate Landing Page",
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

const messageDummy: Message[] = [
  {
    id: genId(),
    role: "ai",
    content: "https://picsum.photos/id/237/200/300",
    timestamp: Date.now(),
    type: "image",
  },
  {
    id: genId(),
    role: "ai",
    content: "/porttrait-1.mp4",
    timestamp: Date.now(),
    type: "video",
  },

  //   {
  //     id: genId(),
  //     role: "user",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "ai",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "user",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "ai",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "user",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "ai",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
  //   {
  //     id: genId(),
  //     role: "user",
  //     content: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  // The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
  //     timestamp: Date.now(),
  //   },
];
export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>(messageDummy);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"welcome" | "chat">("welcome");

  // Send message to AI API and get response
  const sendAIResponse = async (userMessage: string) => {
    setLoading(true);
    try {
      const response = await ChatServices.sendMessage({ text: userMessage });

      if (response.data.code !== 200) {
        throw new Error("Failed to get AI response");
      }

      setMessages((msgs) => [
        ...msgs,
        {
          id: genId(),
          role: "ai",
          content: response.data.data.text,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        setMessages((msgs) => [
          ...msgs,
          {
            id: genId(),
            role: "ai",
            content: error.message,
            timestamp: Date.now(),
          },
        ]);
      }
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
    <div className="flex flex-col w-full max-w-[800px] mx-auto overflow-hidden min-h-screen">
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
                className="flex items-center gap-2 h-auto p-[4px] rounded-[20px] bg-white dark:bg-transparent hover:bg-primary/20 pr-[16px]"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <div className="bg-primary/20 h-[32px] w-[32px] flex items-center justify-center rounded-[14px]">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pb-[168px] pt-[60px]">
          {" "}
          {/* Increased padding to account for fixed input */}
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
        <div className="w-full z-10 fixed bottom-0 max-w-[800px] pt-2">
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
