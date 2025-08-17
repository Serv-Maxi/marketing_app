"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, FileText, User, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-white fixed">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo/Icon */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Image
                src="/icons/logo.svg"
                width={20}
                height={20}
                alt="Marketing Workflow"
                className="text-primary-foreground"
              />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Marketing Workflow
            </span>
          </Link>

          {/* Right side - Navigation Menu */}
          <nav className="flex items-center space-x-6">
            {/* Dashboard */}
            <Link href="/dashboard">
              <Button
                variant="link"
                className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* My Creation */}
            <Link href="/creation">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="w-4 h-4" />
                <span>My Creation</span>
              </Button>
            </Link>

            {/* My Profile - Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <span className="w-4 h-4 mr-2">⚙️</span>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/signout">
                    <span className="w-4 h-4 mr-2">🚪</span>
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
