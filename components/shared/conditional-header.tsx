"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import { useAuth } from "@/hooks/useAuth";

/**
 * Conditionally renders the global Header except on /editor routes.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide header on the editor pages
  if (pathname?.startsWith("/editor")) return null;

  if (!user) return null;
  return <Header />;
}
