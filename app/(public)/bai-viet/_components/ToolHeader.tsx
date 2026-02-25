"use client";

import { useTranslation } from "react-i18next";
import { Tool, ToolDetail } from "@/types/tool";
import { Terminal, Monitor, Zap, Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ToolHeader = ({ tool }: { tool: ToolDetail }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div
        className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-2xl`}
      >
        <Terminal className="text-white w-16 h-16" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold text-white">{tool.title}</h1>
          <Badge className="bg-brand-primary/20 text-brand-primary text-[10px]">
            PRO
          </Badge>
        </div>

        <div className="flex flex-wrap gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <Monitor size={14} /> {tool.version}
          </span>
          <span className="flex items-center gap-1">
            <Zap size={14} /> {tool.lastUpdate}
          </span>
          <span className="flex items-center gap-1 text-brand-warning">
            <Star size={14} fill="currentColor" /> {tool.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} /> {tool.downloads}
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed text-lg">
          {tool.description}
        </p>
      </div>
    </div>
  );
};
