"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const showHeader =
    !!user &&
    !pathname?.startsWith("/editor") &&
    !pathname?.startsWith("/admin");
  return <main className={showHeader ? "pt-[70px]" : ""}>{children}</main>;
}
