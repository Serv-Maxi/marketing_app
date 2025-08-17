// Default platform data with local icons as fallback
export const DEFAULT_PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "/icons/folder-facebook.svg",
    active: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/icons/folder-instagram.svg",
    active: true,
  },
  {
    id: "linkedin",
    name: "Linkedin",
    icon: "/icons/folder-linkedin.svg",
    active: true,
  },
  {
    id: "x",
    name: "X",
    icon: "/icons/folder-x.svg",
    active: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/icons/folder-tiktok.svg",

    active: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/icons/folder-youtube.svg",
    active: true,
  },
  {
    id: "Article",
    name: "Article",
    icon: "/icons/folder-website.svg",
    active: true,
  },
] as PlatformData[];

// Type for platform data that works with both DB and default data
export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  created_at?: string;
}
