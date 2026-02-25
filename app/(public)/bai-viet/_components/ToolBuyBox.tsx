"use client";

import { useTranslation } from "react-i18next";
import { Tool, ToolDetail } from "@/types/tool";
import { Download, ListChecks, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ToolBuyBox = ({ tool }: { tool: ToolDetail }) => {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-[400px]">
      <div className="sticky top-32 space-y-6">
        <div className="p-10 rounded-[3rem] bg-slate-900 border border-white/10 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              {t("tools.detail.professionalPlan")}
            </p>
            <div className="text-5xl font-extrabold text-white">
              {tool.price}
            </div>
            <p className="text-sm text-brand-primary font-bold">
              {t("tools.detail.monthlyPayment")}
            </p>
          </div>

          <div className="space-y-4">
            <Button className="w-full py-6 text-lg font-extrabold">
              <Download /> {t("tools.detail.downloadInstall")}
            </Button>
            <Button variant="outline" className="w-full py-6">
              {t("tools.detail.try24h")}
            </Button>
          </div>

          <ul className="space-y-3 text-xs">
            {[
              t("tools.detail.includes.allPremium"),
              t("tools.detail.includes.lifetimeUpdates"),
              t("tools.detail.includes.license1Device"),
            ].map((l, index) => (
              <li key={index} className="flex gap-2">
                <ListChecks className="text-brand-success" size={14} />
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-brand-warning/10 border border-brand-warning/20 flex gap-3">
          <Info className="text-brand-warning" />
          <p className="text-[10px] text-brand-warning">
            {t("tools.detail.noteNeedHub")}
          </p>
        </div>
      </div>
    </aside>
  );
};
