// src/components/PlatformIcon.tsx
"use client";
import React from "react";
import { Monitor, Box, Globe, Smartphone } from "lucide-react";

interface Props {
  platform: "win" | "mac" | "web" | "mobile";
  className?: string;
}

export const PlatformIcon: React.FC<Props> = ({ platform, className }) => {
  const icons: Record<string, any> = {
    win: Monitor,
    mac: Box,
    web: Globe,
    mobile: Smartphone,
  };
  const Icon = icons[platform] ?? Globe;
  return <Icon size={14} className={className} />;
};
