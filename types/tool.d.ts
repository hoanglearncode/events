// types/tool.ts
export type Platform = "win" | "mac" | "web" | "mobile";

export type ToolCategory =
  | "Desktop App"
  | "Automation"
  | "Extension"
  | "Mobile";

export interface Tool {
  id: string;
  title: string;
  description: string;
  price: string;
  version: string;
  icon: keyof typeof IconMap;
  gradient: string;
  platforms: Platform[];
  tags: string[];
  category: ToolCategory;
  isFeatured?: boolean;
  isBeta?: boolean;
  downloads: number;
  rating: number;
}

export interface ToolDetail {
  id: string;
  title: string;
  description: string;
  version: string;
  lastUpdate: string;
  price: string;
  rating: number;
  downloads: string;
  gradient: string;
  features: string[];
  requirements: ToolRequirement;
}
