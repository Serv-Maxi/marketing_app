"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageCircle, History } from "lucide-react";

const chatItems = [
  { title: "Project Alpha", url: "#1", icon: MessageCircle },
  { title: "Marketing Team", url: "#2", icon: MessageCircle },
  { title: "Support", url: "#3", icon: MessageCircle },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Chat History
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
