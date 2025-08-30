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

  // Hide header on editor and admin management pages
  if (pathname?.startsWith("/editor") || pathname?.startsWith("/admin"))
    return null;

  if (!user) return null;
  return <Header />;
}
