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
import { MessageCircle, Sparkles, PlusIcon, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const chatItems = [
  {
    title: "Previous 7 days ago",
    children: [
      {
        title: "Project Alpha",
        url: "#1",
        icon: MessageCircle,
      },
      {
        title: "Marketing Team",
        url: "#2",
        icon: MessageCircle,
      },
      {
        title: "Support",
        url: "#3",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "One month ago",
    children: [
      {
        title: "Design Review",
        url: "#4",
        icon: MessageCircle,
      },
      {
        title: "Product Launch",
        url: "#5",
        icon: MessageCircle,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-[#1e1e1e]">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Workflow</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-[24px]">
              <SidebarMenuItem>
                <SidebarMenuButton className="text-[#9E2AB2] bg-[#9e2ab212] hover:bg-[#9e2ab212] font-semibold !py-[20px] mb-[24px] flex justify-center rounded-[12px]">
                  <div className="flex items-center gap-2 font-bold">
                    <PlusIcon size={18} strokeWidth={3} /> New Chat
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {chatItems.map((group) => (
                <div key={group.title} className="mb-4">
                  <div className="text-[12px] font-normal text-gray-400 mb-2 pl-2">
                    {group.title}
                  </div>
                  {group.children.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center justify-between font-medium py-[12px] !h-[38px] "
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.title}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Ellipsis size={14} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
