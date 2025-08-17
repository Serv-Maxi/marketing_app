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
  console.log(id);

  useEffect(() => {
    if (!id || !execute) return;

    const channels = supabase
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          onTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [id, execute]);
};
