"use client";

import Image from "next/image";
import { useTaskRealtimeStatus } from "@/hooks/useTaskRealtimeStatus";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TasksService } from "@/services/database";
import { CheckCircle } from "lucide-react";

const Generating = () => {
  const params = useParams();
  const taskId = params.taskId as string;

  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState("Generating...");

  // Fetch task status
  useEffect(() => {
    const fetchData = async () => {
      if (!taskId) return;
      try {
        const task = await TasksService.getTaskById(taskId as string);

        if (task) {
          if (task.status === "Finished") {
            return router.push(`/creation/${taskId}`);
          }
          setStatusMessage("Task is still in progress...");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [taskId]);

  useTaskRealtimeStatus({
    id: taskId || "",
    execute: true,
    onTimeUpdate: (payload) => {
      if (payload.eventType === "UPDATE") {
        if (payload.new.status === "On Progress") {
          setStatusMessage("Content is being generated...");
        }
        if (payload.new.status === "Finished") {
          setProgress(100);
          setStatusMessage("Content generated successfully!");
          router.push(`/creation/${taskId}`);
        }
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
          {/* <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{progress}% Complete</p>
          </div> */}

          {/* Status Message */}
          <div className="space-y-3 text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              {progress === 100 ? (
                <CheckCircle />
              ) : (
                <span
                  className={`w-2 h-2 rounded-full animate-ping bg-green-500`}
                ></span>
              )}

              {statusMessage}
            </p>

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
