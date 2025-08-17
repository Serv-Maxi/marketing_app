"use client";

import { useState, useEffect } from "react";
import { platformService } from "@/services/database";
import { DEFAULT_PLATFORMS, PlatformData } from "@/lib/platforms";

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dbPlatforms: PlatformData[] =
          await platformService.getPlatforms();

        if (dbPlatforms.length > 0) {
          const mergedPlatforms = dbPlatforms.map((dbPlatform) => {
            return {
              id: dbPlatform.id,
              name: dbPlatform.name,
              active: dbPlatform.active,
              icon:
                DEFAULT_PLATFORMS.find(
                  (e) =>
                    e.name?.toLocaleLowerCase() ===
                    dbPlatform.name?.toLocaleLowerCase()
                )?.icon || "",
            };
          });

          setPlatforms(mergedPlatforms);
        } else {
          // No platforms in database - show empty state
          setPlatforms([]);
        }
      } catch (error) {
        console.error("Error fetching platforms:", error);
        setError("Failed to load platforms");
        setPlatforms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  return {
    platforms,
    isLoading,
    error,
  };
}
