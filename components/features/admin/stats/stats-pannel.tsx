"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { KPIItemData } from "@/types/stats";

export interface StatsPanelProps {
  data: KPIItemData[];
}

export default function StatsPanel({ data }: StatsPanelProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {item.trend && item.trendVal && (
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${
                    item.trend === "up"
                      ? "bg-brand-success/10 text-brand-success"
                      : "bg-brand-error/10 text-brand-error"
                  }`}
                >
                  {item.trend === "up" ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {item.trendVal}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {item.label}
              </p>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {item.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
