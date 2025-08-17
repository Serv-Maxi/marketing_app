"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { creationService } from "@/services/database";
import { Database } from "@/lib/database.types";
import { ListCreation } from "../custom/list-creation";
import { GroupedByDate } from "@/lib/grouping";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";

type Creation = Database["public"]["Tables"]["contents"]["Row"];

export const Creations = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const [creations, setCreations] = useState<GroupedByDate<Creation>[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCreations = useCallback(
    async (search?: string) => {
      setLoading(true);
      setError(null);
      try {
        const userCreations = await creationService.getCreationsGroupedByDate(
          id, // folderId
          "friendly", // formatType
          search // searchQuery
        );
        setCreations(userCreations);
      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.message);
          setCreations([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.id, id]
  );

  // Initial fetch
  useEffect(() => {
    fetchCreations();
  }, [user?.id, fetchCreations, id]);

  // Search effect
  useEffect(() => {
    if (user?.id) {
      fetchCreations(debouncedSearchQuery || undefined);
    }
  }, [debouncedSearchQuery, user?.id, fetchCreations]);

  const clearSearch = () => {
    setSearchQuery("");
  };

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

  // // Loading state
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
    <div>
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search your creations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-white"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && !isLoading && (
        <div className="mb-4 text-sm text-gray-600">
          {creations.length > 0 ? (
            <span>
              Found{" "}
              {creations.reduce((total, group) => total + group.data.length, 0)}{" "}
              result(s) for "{searchQuery}"
            </span>
          ) : (
            <span>No results found for "{searchQuery}"</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
        {creations.map((creation) => (
          <div key={creation.date}>
            <div>{creation?.date}</div>
            <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
              {creation.data.map((item) => (
                <ListCreation key={item.id} creation={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
