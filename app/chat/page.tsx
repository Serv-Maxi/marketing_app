"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Globe, Image, Send, UserPlus, Video } from "lucide-react";

export const ChatBox = () => {
  const quickActions = [
    {
      icon: Image,
      label: "Clone a Screenshot",
      description: "Generate Image",
    },
    {
      icon: Video,
      label: "Import from Figma",
      description: "Generate Video",
    },
    {
      icon: Globe,
      label: "Landing Page",
      description: "Create a landing page",
    },
    {
      icon: UserPlus,
      label: "Sign Up Form",
      description: "Build a registration form",
    },
    {
      icon: Calculator,
      label: "Calculate Factorial",
      description: "Math calculator tool",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl grow">
      <form onSubmit={handleSubmit} className="w-full mb-8">
        <div className="relative">
          <div className="flex items-end gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
            <Textarea
              placeholder="Ask AI to build..."
              className="flex-1 border-none shadow-none text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 !bg-transparent text-gray-900 dark:text-gray-100"
            />
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="h-8 w-8 p-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center gap-2 h-auto py-2 px-4 rounded-full bg-white hover:bg-gray-50"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
