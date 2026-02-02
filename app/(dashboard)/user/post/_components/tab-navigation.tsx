"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tab, TabId, TABS } from "../_utils/constants";

interface TabNavigationProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeItem = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSelect = (tab: Tab) => {
    setActiveTab(tab.id as TabId);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <span>{activeItem.label}</span>
            <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", open && "rotate-180")} />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-56 p-1">
          <div role="menu" className="space-y-1">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  role="menuitem"
                  type="button"
                  onClick={() => handleSelect(tab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md",
                    isActive ? "bg-muted text-primary" : "hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 rounded-sm text-sm",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.icon}
                  </span>

                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-medium">{tab.label}</span>
                    {tab.description && <span className="text-xs mt-0.5 text-muted-foreground">{tab.description}</span>}
                  </div>

                  {isActive && (
                    <span className="ml-auto text-primary">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
