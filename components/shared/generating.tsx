"use client";

import Image from "next/image";
import { useTaskRealtimeStatus } from "@/hooks/useTaskRealtimeStatus";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentType } from "@/types/global";
import { TasksService } from "@/services/database";

interface GeneratingProps {
  taskId?: string;
  contentId?: string;
  selectedContentType: ContentType;
}

const Generating = ({ taskId }: GeneratingProps) => {
  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState("Initializing...");

  const [taskStatus, setTaskStatus] = useState<string | null>(null);

  // Fetch task status
  useEffect(() => {
    const fetchData = async () => {
      if (!taskId) return;
      try {
        // Simple task fetch by I
        const task = await TasksService.getTaskById(taskId as string);
        console.log("Fetched task:", task);

        if (task) {
          setTaskStatus(task.status);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [taskId]);

  // if the status is "On Queue", subscribe to realtime updates to receive the update

  useTaskRealtimeStatus({
    id: taskId || "",
    execute: taskStatus === "On Queue",
    onTimeUpdate: (payload) => {
      console.log(payload);
      if (payload.eventType === "UPDATE") {
        setProgress(100);
        setStatusMessage("Content generated successfully!");
        router.push(`/creation/${taskId}`);
      }
    },
  });

  return (
    <div className="container mx-auto p-8 bg-background min-h-screen">
      <div className="bg-white mt-[100px] max-w-[900px] h-[650px] m-auto flex items-center justify-center rounded-[24px]">
        <div className="text-center max-w-[500px] px-8">
          {/* Animated Icon */}
          <div className="mb-8 animate-pulse">
            <Image
              src="/icons/type-text.svg"
              width={220}
              height={252}
              alt="Generating content"
              className="mx-auto"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            Crafting Your Perfect Content
          </h1>

          {/* Subheading */}
          <p className="text-md text-gray-600 mb-6 leading-relaxed">
            Our AI is working its magic to create compelling, platform-optimized
            content just for you.
          </p>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progress}% Complete</p>
          </div>

          {/* Status Message */}
          <div className="space-y-3 text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-ping bg-green-500`}
              ></span>
              {statusMessage}
            </p>
            {!taskId && (
              <p className="opacity-70">
                This usually takes 2-3 minutes for the best results
              </p>
            )}
            {/* {error && (
              <p className="text-red-500 text-sm">Connection issue: {error}</p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generating;
