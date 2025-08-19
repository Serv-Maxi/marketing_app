import { ContentType, GenerateStatus } from "@/types/global";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      platforms: {
        Row: {
          id: string;
          name: string;
          icon: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          active: boolean;
          created_at: string;
        };
        Update: {
          id: string;
          name: string;
          icon: string;
          active: boolean;
          created_at: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          creation_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          icon?: string;
          company_id?: string;
        }[];
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string;
          creation_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contents: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          task_id: string;
          platform: string;
          folder_id: string;
          content: Text;
          image_prompt: string;
          video_prompt: string;
          title: string;
          headline: string;
          image_url: string;
          video_url: string;
          created_at: string;
          task: {
            aspect_ratio?: string;
            type: ContentType;
          };
        };

        Update: {
          id: string;
          user_id: string;
          company_id: string;
          task_id: string;
          platform: string;
          folder_id: string;
          content: Text;
          image_prompt: string;
          video_prompt: string;
          title: string;
          headline: string;
          image_url: string;
          video_url: string;
          created_at: string;
        };
      };
      creation_results: {
        Row: {
          id: string;
          creation_id: string;
          platform: string;
          content: string;
          image_url: string | null;
          video_url: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creation_id: string;
          platform: string;
          content: string;
          image_url?: string | null;
          video_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          creation_id?: string;
          platform?: string;
          content?: string;
          image_url?: string | null;
          video_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id?: string;
          type: ContentType;
          company_id: string;
          prompt: string;
          platforms: string[];
          audience: string;
          campaign_goal: string;
          value_proposition: string;
          selling_point: string;
          selling_features: string;
          cta: string;
          use_emoji: boolean;
          tone: string;
          language: string;
          folder_id: string;
          aspect_ratio?: string;
          status: GenerateStatus;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          type: ContentType;
          prompt: string;
          platforms: string[];
          audience: string;
          campaign_goal: string;
          value_proposition: string;
          selling_point: string;
          selling_features: string;
          cta: string;
          use_emoji: boolean;
          tone: string;
          language: string;
          folder_id: string;
          aspect_ratio?: string;
          status: GenerateStatus;
          created_at?: string;
          updated_at?: string;
        }[];
        Update: {
          id?: string;
          user_id?: string;
          type?: ContentType;
          prompt?: string;
          platforms?: string[];
          audience?: string;
          campaign_goal?: string;
          value_proposition?: string;
          selling_point?: string;
          selling_features?: string;
          cta?: string;
          use_emoji?: boolean;
          tone?: string;
          language?: string;
          folder?: string;
          aspect_ratio?: string;
          status: GenerateStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      content_type: ContentType;
      creation_status: "draft" | "processing" | "completed" | "failed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
