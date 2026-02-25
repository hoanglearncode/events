// components/tools/FilterBar.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Search, X, Filter as FilterIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  categories: any[];
  activeCategory: string;
  onCategoryChange: (cat: any) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalResults: number;
}

export const FilterBar: React.FC<Props> = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  const { t } = useTranslation();

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <FilterIcon size={20} className="text-brand-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {t("tools.filter.title") || "Lọc & Tìm kiếm"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("tools.filter.subtitle") ||
              "Tìm tools phù hợp với nhu cầu của bạn"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("tools.filter.categories") || "Danh mục"}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <Button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 overflow-hidden ${
                  isActive
                    ? "bg-brand-primary hover:bg-brand-primary-dark text-white shadow-lg shadow-brand-primary/25"
                    : "bg-muted hover:bg-muted-hover text-muted-foreground hover:text-foreground border border-border hover:border-brand-primary/30"
                }`}
                variant="ghost"
              >
                {/* Active Gradient Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                )}

                <span className="relative">{cat.name}</span>

                <span
                  className={`relative text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-border text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                  }`}
                >
                  {cat.productCount || 0}
                </span>

                {/* Hover Sparkle Effect */}
                {!isActive && (
                  <Sparkles
                    size={14}
                    className="absolute -right-1 -top-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2">
        <div className="relative w-full sm:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors"
            size={18}
          />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("tools.searchPlaceholder") || "Tìm kiếm tools..."}
            className="w-full bg-card border-2 border-border focus:border-brand-primary rounded-xl py-3 pl-12 pr-12 text-sm outline-none transition-all text-foreground placeholder:text-muted-foreground shadow-sm focus:shadow-lg focus:shadow-brand-primary/10"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors group/clear"
              aria-label="Clear search"
            >
              <X
                size={16}
                className="text-muted-foreground group-hover/clear:text-foreground transition-colors"
              />
            </button>
          )}

          {/* Search Hint on Focus */}
          <div className="absolute left-0 right-0 top-full mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
            <div className="text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              💡 {t("tools.searchHint") || "Nhấn Enter để tìm kiếm nhanh"}
            </div>
          </div>
        </div>
      </div>

      {(activeCategory || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground font-semibold">
            {t("tools.filter.active") || "Đang lọc:"}
          </span>

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-semibold rounded-lg border border-brand-primary/20">
              {categories.find((c) => c.id === activeCategory)?.name}
              <button
                onClick={() => onCategoryChange(null)}
                className="hover:bg-brand-primary/20 rounded p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent/10 text-brand-accent text-xs font-semibold rounded-lg border border-brand-accent/20">
              "{searchQuery}"
              <button
                onClick={handleClearSearch}
                className="hover:bg-brand-accent/20 rounded p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          )}

          <button
            onClick={() => {
              onCategoryChange(null);
              onSearchChange("");
            }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
          >
            {t("tools.filter.clearAll") || "Xóa tất cả"}
          </button>
        </div>
      )}
    </div>
  );
};
