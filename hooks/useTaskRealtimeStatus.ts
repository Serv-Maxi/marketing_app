"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface TaskRealtime {
  id: string;
  execute: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTimeUpdate: (payload: any) => void;
}

export const useTaskRealtimeStatus = ({
  id,
  execute,
  onTimeUpdate,
}: TaskRealtime) => {
  useEffect(() => {
    if (!id || !execute) return;

    console.log("run here");
    const channel = supabase
      .channel("task_realtime_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          // filter: `id=eq.${id}`, // 👈 only updates for this task.id
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          onTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, execute, onTimeUpdate]);
};
