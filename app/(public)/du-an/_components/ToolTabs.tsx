"use client";

import { useTranslation } from "react-i18next";
import { Tool, ToolDetail } from "@/types/tool";
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Info,
  Monitor,
  HardDrive,
  Box,
  Globe,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ToolTabs = ({ tool }: { tool: ToolDetail }) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="overview" className="space-y-8">
      <TabsList className="bg-transparent border-b border-white/5 rounded-none">
        <TabsTrigger value="overview">{t("tools.tabs.overview")}</TabsTrigger>
        <TabsTrigger value="features">{t("tools.tabs.features")}</TabsTrigger>
        <TabsTrigger value="specs">{t("tools.tabs.requirements")}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 text-slate-400">
        <p>{t("tools.tabs.overviewContent")}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4">
            <Cpu className="text-brand-primary" />
            <div>
              <h4 className="text-white font-bold">
                {t("tools.tabs.multiThread")}
              </h4>
              <p className="text-xs">{t("tools.tabs.multiThreadDesc")}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4">
            <ShieldCheck className="text-brand-success" />
            <div>
              <h4 className="text-white font-bold">
                {t("tools.tabs.security")}
              </h4>
              <p className="text-xs">{t("tools.tabs.securityDesc")}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="features" className="grid md:grid-cols-2 gap-4">
        {tool.features.map((f) => (
          <div
            key={f}
            className="flex items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/5"
          >
            <CheckCircle2 className="text-brand-primary" size={18} />
            <span className="text-sm font-medium text-slate-200">{f}</span>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="specs" className="space-y-6">
        <div className="flex items-center gap-3 text-white">
          <Info className="text-brand-primary" />
          <h3 className="text-xl font-bold">
            {t("tools.tabs.requirementsTitle")}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Monitor size={16} /> {tool.requirements.os}
            </div>
            <div className="flex gap-2">
              <HardDrive size={16} /> {tool.requirements.ram}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Box size={16} /> {tool.requirements.storage}
            </div>
            <div className="flex gap-2">
              <Globe size={16} /> {tool.requirements.other}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
