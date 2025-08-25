"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  User,
  ChevronDown,
  Sparkle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
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
  };
  return (
    <header className="w-full bg-white fixed shadow-md z-[20]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo/Icon */}
          <Link href="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkle className="text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Marketing Workflow
            </span>
          </Link>

          {/* Right side - Navigation Menu */}
          <nav className="flex items-center space-x-6">
            {/* Dashboard */}
            <Link href="/home">
              <Button
                variant="link"
                className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>

            {/* My Creation */}
            <Link href="/creation/folder">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="w-4 h-4" />
                <span>My Folders</span>
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
                {/* <DropdownMenuItem asChild>
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
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                  disabled={signingOut}
                  className="cursor-pointer"
                >
                  <span className="w-4 h-4 mr-2">
                    {signingOut ? "⏳" : "🚪"}
                  </span>
                  {signingOut ? "Signing Out..." : "Sign Out"}
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
