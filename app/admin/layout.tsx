"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Users, Building2, Shield, LogOut, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    try {
      setSigningOut(true);
      await signOut();
      toast.success("Signed out");
      router.push("/auth/signin");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  const items = [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Companies", href: "/admin/companies", icon: Building2 },
    { label: "Roles", href: "/admin/roles", icon: Shield },
  ];

  const models = [{ label: "Models", href: "/admin/models", icon: Sparkle }];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 62)",
        } as React.CSSProperties
      }
    >
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="group-data-[side=left]:border-r-0 group-data-[side=right]:border-l-0"
      >
        <SidebarHeader>
          <div className="flex items-center h-10 px-2 font-semibold text-sm tracking-tight">
            <span>Omni Senti</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>User Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname?.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={!!active}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel>Models Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {models.map((item) => {
                  const Icon = item.icon;
                  const active = pathname?.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={!!active}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter>
          <div className="text-[10px] text-muted-foreground px-2">
            © {new Date().getFullYear()} Omni Senti
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-12 items-center gap-2 px-4 border-b bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger />
            <h1 className="text-sm font-medium">Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
        <div className="flex-1 p-4 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
