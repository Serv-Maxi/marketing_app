export interface FormData {
  type: "Text" | "Image" | "Video";
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
}
