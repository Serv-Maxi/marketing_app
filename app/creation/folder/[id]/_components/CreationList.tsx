"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { creationService } from "@/services/database";
import { Database } from "@/lib/database.types";
import { ListCreation } from "@/components/custom/list-creation";

type Creation = Database["public"]["Tables"]["contents"]["Row"];

export const RecentCreation = () => {
  const { user } = useAuth();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentCreations = async () => {
      setLoading(true);
      setError(null);
      try {
        const userCreations = await creationService.getCreations();
        setCreations(userCreations);
      } catch (error) {
        console.error("Error fetching recent creations:", error);
        setError("Failed to load recent creations.");
        setCreations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCreations();
  }, [user?.id]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load recent creations
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (!creations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">No recent creations</p>
          <p className="text-sm">Create your first content to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
      {creations.map((creation) => (
        <ListCreation key={creation.id} creation={creation} />
      ))}
    </div>
  );
};
