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
import EmptyState from "./empty-state";
import { useRouter } from "next/navigation";
import ErrorState from "./error-state";
import { ContentType } from "@/types/global";

type Creation = Database["public"]["Tables"]["contents"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"] & {
  creations?: Creation[];
};

export const Creations = ({
  id,
  selectedType,
}: {
  id: string;
  selectedType: ContentType | null;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [creations, setCreations] = useState<GroupedByDate<Task>[]>([]);
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
    async (search?: string, selectedType?: ContentType | null) => {
      setLoading(true);
      setError(null);
      try {
        const userCreations = await creationService.getCreationsGroupedByDate(
          id, // folderId
          "friendly", // formatType
          search, // searchQuery
          selectedType
        );
        setCreations(userCreations);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setCreations([]);
      } finally {
        setLoading(false);
      }
    },
    [id] // Only depend on id, not on selectedType
  );

  useEffect(() => {
    if (user?.id) {
      fetchCreations(debouncedSearchQuery || undefined, selectedType);
    }
  }, [debouncedSearchQuery, user?.id, fetchCreations, selectedType]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (error) return <ErrorState error={error} onRetry={fetchCreations} />;

  console.log("creations =>", creations);
  if (!creations.length && !isLoading) {
    return (
      <EmptyState
        title="No recent creations"
        description="Create your first content to see it here"
      >
        <>
          <Button
            className="mt-[24px]"
            onClick={() => {
              router.push(`/creation/new?type=Text&folder=${id}`);
            }}
          >
            Create New Content
          </Button>
        </>
      </EmptyState>
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
              result(s) for `&quot;`{searchQuery}`&quot;`
            </span>
          ) : (
            <span>No results found for `&quot;`{searchQuery}`&quot;`</span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
          {creations.map((creation, i) => (
            <div key={i}>
              <div>{creation?.date}</div>
              <div className="grid grid-cols-1 gap-[16px] mt-[12px]">
                {creation.data.map((item) => (
                  <ListCreation key={item.id} task={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
