// components/search/SearchDialog.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "./useDebounce";
import { searchProducts } from "./searchService";
import { SearchResultCard } from "./SearchResultCard";

export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  price?: number;
  rating?: number;
  trending?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const data = await searchProducts(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  const handleResultClick = (productId: string) => {
    onOpenChange(false);
    router.push(`/products/${encodeURIComponent(btoa(productId))}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[80vh] p-0 gap-0 overflow-hidden w-[95vw] sm:w-full">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
          <DialogTitle className="text-base sm:text-lg font-semibold">
            Tìm kiếm sản phẩm
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Tìm kiếm sản phẩm, công cụ AI, khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto max-h-[calc(85vh-140px)] sm:max-h-[50vh]">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Đang tìm kiếm...</p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Search className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground text-center">
                Nhập từ khóa để tìm kiếm sản phẩm
              </p>
            </div>
          ) : results?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Search className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground text-center">
                Không tìm thấy kết quả cho "{searchQuery}"
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            results?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  Tìm thấy {results?.length || 0} kết quả
                </p>
                {results?.map((result) => (
                  <SearchResultCard
                    key={result.id}
                    result={result}
                    onClick={() => handleResultClick(result.id)}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
