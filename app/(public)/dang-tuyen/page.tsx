"use client";

import * as React from "react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";

// lucide
import {
  Search, LayoutGrid, List, SlidersHorizontal, Eye, Clock, Flame,
  X, ChevronLeft, ChevronRight, Sparkles, TrendingUp, BookOpen,
  Rss, ArrowLeft, PenLine, Check,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryId = "all" | "tech" | "design" | "business" | "culture" | "science";

interface Category {
  id: CategoryId;
  label: string;
  count: number;
  icon: React.ReactNode;
}

interface Author {
  id: number;
  name: string;
  avatar: string;
  initials: string;
  role: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: CategoryId;
  categoryLabel: string;
  tags: string[];
  author: Author;
  date: string;
  readTime: string;
  views: string;
  featured: boolean;
  image: string;
  hot: boolean;
}

type SortOption = "newest" | "views" | "readtime";
type ViewMode = "grid" | "list";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: "all",      label: "Tất cả",     count: 248, icon: <Rss className="w-3.5 h-3.5" /> },
  { id: "tech",     label: "Công nghệ",  count: 74,  icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "design",   label: "Thiết kế",   count: 51,  icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "business", label: "Kinh doanh", count: 63,  icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "culture",  label: "Văn hoá",    count: 38,  icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "science",  label: "Khoa học",   count: 22,  icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const ALL_TAGS: string[] = [
  "AI", "React", "UX", "Branding", "Startup", "Web3", "Sustainability",
  "Leadership", "Photography", "Typography", "Data", "Mobile", "SaaS",
  "Marketing", "Open Source", "Security", "Cloud", "Figma", "Coffee",
];

const AUTHORS: Author[] = [
  { id: 1, name: "Minh Châu",   avatar: "", initials: "MC", role: "Tech Editor"     },
  { id: 2, name: "Thanh Hương", avatar: "", initials: "TH", role: "Design Lead"     },
  { id: 3, name: "Hải Đăng",   avatar: "", initials: "HD", role: "Contributor"      },
  { id: 4, name: "Lan Anh",    avatar: "", initials: "LA", role: "Science Writer"   },
  { id: 5, name: "Việt Khoa",  avatar: "", initials: "VK", role: "Business Analyst" },
];

const ARTICLE_TITLES: string[] = [
  "Tương lai của thiết kế giao diện người dùng trong kỷ nguyên AI",
  "Xây dựng thương hiệu cá nhân mạnh mẽ từ con số 0",
  "Những xu hướng công nghệ định hình lại thế giới năm 2025",
  "Nghệ thuật nhiếp ảnh tài liệu và câu chuyện đằng sau ống kính",
  "Quản lý startup hiệu quả: Bài học từ những thất bại đáng nhớ",
  "Khoa học đằng sau thói quen và cách thay đổi não bộ",
  "Typography trong thiết kế web: Từ nguyên tắc đến thực tiễn",
  "Open source và tương lai của phần mềm cộng tác toàn cầu",
];

function generateArticles(): Article[] {
  return Array.from({ length: 48 }, (_, i): Article => {
    const cats = CATEGORIES.slice(1);
    const cat = cats[i % cats.length]!;
    const shuffled = [...ALL_TAGS].sort(() => Math.random() - 0.5);
    return {
      id: i + 1,
      title: ARTICLE_TITLES[i % ARTICLE_TITLES.length]!,
      excerpt:
        "Khám phá chiều sâu của chủ đề này qua góc nhìn đa chiều, phân tích thực tiễn và những hiểu biết mới mẻ từ các chuyên gia hàng đầu.",
      category: cat.id,
      categoryLabel: cat.label,
      tags: shuffled.slice(0, 2 + (i % 3)),
      author: AUTHORS[i % AUTHORS.length]!,
      date: new Date(2025, Math.floor(i / 4), (i % 28) + 1).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      readTime: `${4 + (i % 14)} phút`,
      views: `${((i + 1) * 137) % 9900 + 100}`,
      featured: i < 3,
      image: `https://picsum.photos/seed/${i + 10}/800/450`,
      hot: i % 7 === 0,
    };
  });
}

const ARTICLES: Article[] = generateArticles();
const PAGE_SIZE_MOBILE  = 6;
const PAGE_SIZE_DESKTOP = 9;

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Article Meta ─────────────────────────────────────────────────────────────

interface ArticleMetaProps {
  author: Author;
  date: string;
  readTime: string;
  views: string;
  compact?: boolean;
}

function ArticleMeta({ author, date, readTime, views, compact }: ArticleMetaProps) {
  return (
    <div className="flex items-center justify-between w-full min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className={cn(compact ? "h-6 w-6" : "h-7 w-7", "flex-shrink-0")}>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className={cn(
            "font-bold bg-gradient-to-br from-[#9c620f] to-[#624a2b] text-white",
            compact ? "text-[9px]" : "text-[10px]",
          )}>
            {author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-none min-w-0">
          <span className={cn("font-semibold text-foreground truncate", compact ? "text-[10px]" : "text-[11px]")}>
            {author.name}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0 ml-2">
        <span className="flex items-center gap-0.5 text-[11px]">
          <Eye className="w-3 h-3" />{Number(views).toLocaleString("vi-VN")}
        </span>
        <span className="flex items-center gap-0.5 text-[11px]">
          <Clock className="w-3 h-3" />{readTime}
        </span>
      </div>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Card className="group overflow-hidden border-border/60 shadow-sm hover:shadow-xl active:scale-[0.99] transition-all duration-500 p-0 touch-manipulation">
      <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden">
        <img src={article.image} alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {article.hot && (
          <Badge className="absolute top-3 left-3 gap-1 bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white border-0 text-[10px] uppercase tracking-widest">
            <Flame className="w-2.5 h-2.5" /> Hot
          </Badge>
        )}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="bg-white/15 text-white border-white/30 text-[10px] uppercase tracking-widest backdrop-blur-sm">
              {article.categoryLabel}
            </Badge>
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="bg-white/10 text-white/80 border-white/20 text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors duration-300">
            {article.title}
          </h2>
          <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} views={article.views} compact />
        </div>
      </div>
    </Card>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:border-[#ab936c]/50 hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex flex-col h-full p-0 touch-manipulation">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={article.image} alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy" />
        {article.hot && (
          <Badge className="absolute top-2.5 left-2.5 gap-1 bg-gradient-to-r from-[#9c620f] to-[#624a2b] border-0 text-[9px] uppercase px-2 py-0.5">
            <Flame className="w-2.5 h-2.5" />
          </Badge>
        )}
        <Badge variant="outline" className="absolute top-2.5 right-2.5 bg-background/90 text-[9px] uppercase tracking-widest border-border px-2">
          {article.categoryLabel}
        </Badge>
      </div>
      <CardHeader className="px-3.5 sm:px-4 pt-3 pb-1 space-y-2">
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 h-5 bg-muted text-[#9c620f] border border-border/50">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-bold text-[13px] sm:text-sm leading-snug text-foreground line-clamp-2 group-hover:text-[#624a2b] transition-colors">
          {article.title}
        </h3>
      </CardHeader>
      <CardContent className="px-3.5 sm:px-4 py-1 flex-1">
        <p className="text-muted-foreground text-xs sm:text-[13px] leading-relaxed line-clamp-2">{article.excerpt}</p>
      </CardContent>
      <CardFooter className="px-3.5 sm:px-4 pt-3 pb-3.5 border-t border-border/50">
        <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} views={article.views} />
      </CardFooter>
    </Card>
  );
}

function ListCard({ article }: { article: Article }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:border-[#ab936c]/50 hover:shadow-md active:scale-[0.99] transition-all duration-300 p-0 touch-manipulation">
      <CardContent className="flex gap-3 p-3 sm:p-4">
        <div className="relative w-24 h-[72px] sm:w-28 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={article.image} alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy" />
          {article.hot && (
            <Badge className="absolute top-1 left-1 gap-0.5 bg-gradient-to-r from-[#9c620f] to-[#624a2b] border-0 text-[8px] px-1 py-0 h-3.5 uppercase">
              <Flame className="w-2 h-2" />
            </Badge>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 py-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-border px-1.5 py-0 h-4">
              {article.categoryLabel}
            </Badge>
            {article.tags.slice(0, 1).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[9px] h-4 px-1.5 py-0 bg-muted text-[#9c620f] border border-border/40">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-[13px] sm:text-sm leading-snug text-foreground line-clamp-2 group-hover:text-[#624a2b] transition-colors">
            {article.title}
          </h3>
          <div className="mt-auto flex items-center gap-1.5 text-muted-foreground text-[10px] sm:text-[11px]">
            <Avatar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0">
              <AvatarFallback className="text-[7px] font-bold bg-gradient-to-br from-[#9c620f] to-[#624a2b] text-white">
                {article.author.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground/70 truncate max-w-[72px] sm:max-w-none">
              {article.author.name}
            </span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-0.5 flex-shrink-0"><Clock className="w-2.5 h-2.5" />{article.readTime}</span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-0.5 flex-shrink-0"><Eye className="w-2.5 h-2.5" />{Number(article.views).toLocaleString("vi-VN")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden p-0">
          <Skeleton className="aspect-[16/9] w-full rounded-none" />
          <div className="p-3.5 space-y-2.5">
            <div className="flex gap-1.5"><Skeleton className="h-4 w-10 rounded-full" /><Skeleton className="h-4 w-14 rounded-full" /></div>
            <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
            <Separator />
            <div className="flex justify-between">
              <div className="flex items-center gap-2"><Skeleton className="h-7 w-7 rounded-full" /><Skeleton className="h-3 w-16" /></div>
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Filter Drawer (mobile bottom sheet) ─────────────────────────────────────

interface FilterDrawerProps {
  activeTags: string[];
  sortBy: SortOption;
  onApply: (tags: string[], sort: SortOption) => void;
  activeCount: number;
}

function FilterDrawer({ activeTags, sortBy, onApply, activeCount }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [tempTags, setTempTags] = useState<string[]>(activeTags);
  const [tempSort, setTempSort] = useState<SortOption>(sortBy);

  // Sync when drawer opens
  useEffect(() => {
    if (open) { setTempTags(activeTags); setTempSort(sortBy); }
  }, [open, activeTags, sortBy]);

  const toggleTemp = (tag: string) =>
    setTempTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleApply = () => { onApply(tempTags, tempSort); setOpen(false); };
  const handleReset = () => { setTempTags([]); setTempSort("newest"); };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm"
          className="relative gap-2 h-10 px-3.5 border-border/70 touch-manipulation flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[13px]">Lọc</span>
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold text-white bg-gradient-to-br from-[#9c620f] to-[#624a2b]">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="px-4 pt-4 pb-3 border-b border-border/60">
          <DrawerTitle className="flex items-center justify-between text-base">
            Bộ lọc & Sắp xếp
            <Button variant="ghost" size="sm" onClick={handleReset}
              className="text-muted-foreground hover:text-foreground gap-1 h-7 px-2 text-xs">
              <X className="w-3 h-3" /> Đặt lại
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Sort section */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Sắp xếp theo
            </p>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: "newest",   label: "Mới nhất"       },
                { value: "views",    label: "Nhiều xem nhất" },
                { value: "readtime", label: "Đọc nhanh"      },
              ] as { value: SortOption; label: string }[]).map(({ value, label }) => (
                <button key={value} onClick={() => setTempSort(value)}
                  className={cn(
                    "h-10 px-4 rounded-full border text-[13px] font-medium transition-all touch-manipulation flex items-center gap-2",
                    tempSort === value
                      ? "bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white border-transparent shadow-sm"
                      : "border-border text-muted-foreground hover:border-[#ab936c] bg-background",
                  )}>
                  {tempSort === value && <Check className="w-3.5 h-3.5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags section */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Tags
              {tempTags.length > 0 && (
                <span className="ml-2 text-[#9c620f] normal-case tracking-normal text-xs">
                  {tempTags.length} đã chọn
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button key={tag} onClick={() => toggleTemp(tag)}
                  className={cn(
                    "h-10 px-4 rounded-full border text-[13px] font-medium transition-all touch-manipulation flex items-center gap-2",
                    tempTags.includes(tag)
                      ? "bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white border-transparent shadow-sm"
                      : "border-border text-muted-foreground hover:border-[#ab936c] bg-background",
                  )}>
                  {tempTags.includes(tag) && <Check className="w-3.5 h-3.5" />}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="px-4 py-4 border-t border-border/60 bg-background/80 backdrop-blur-sm">
          <Button onClick={handleApply}
            className="w-full h-12 text-[15px] font-semibold bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white border-0 hover:opacity-90 touch-manipulation shadow-md">
            Xem {tempTags.length > 0 ? `kết quả với ${tempTags.length} tag` : "tất cả kết quả"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Desktop Filter Bar ───────────────────────────────────────────────────────

interface DesktopFilterBarProps {
  activeTags: string[];
  sortBy: SortOption;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  onSortChange: (v: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  filteredCount: number;
}

function DesktopFilterBar({
  activeTags, sortBy, onToggleTag, onClearTags, onSortChange,
  viewMode, onViewModeChange, filteredCount,
}: DesktopFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex-shrink-0">
          Tags:
        </span>
        {ALL_TAGS.map((tag) => (
          <Toggle key={tag} pressed={activeTags.includes(tag)} onPressedChange={() => onToggleTag(tag)}
            variant="outline" size="sm"
            className={cn(
              "h-6 px-2.5 text-[11px] rounded-full border-border/70 text-muted-foreground transition-all",
              "hover:border-[#ab936c] hover:text-[#624a2b]",
              "data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#9c620f] data-[state=on]:to-[#624a2b]",
              "data-[state=on]:text-white data-[state=on]:border-transparent data-[state=on]:shadow-sm",
            )}>
            {tag}
          </Toggle>
        ))}
        {activeTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearTags}
            className="h-6 px-2.5 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-full">
            <X className="w-3 h-3" /> Xoá ({activeTags.length})
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredCount.toLocaleString("vi-VN")}</span> bài viết
          {activeTags.length > 0 && <span className="text-[#9c620f]"> · {activeTags.length} tag đang lọc</span>}
        </p>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="h-8 w-[150px] text-xs border-border/60 focus:ring-1 focus:ring-[#ab936c]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest"   className="text-xs">Mới nhất</SelectItem>
              <SelectItem value="views"    className="text-xs">Nhiều xem nhất</SelectItem>
              <SelectItem value="readtime" className="text-xs">Đọc nhanh nhất</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border/60 overflow-hidden bg-background">
            {(["grid", "list"] as const).map((mode) => (
              <Button key={mode} variant="ghost" size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === mode
                    ? "bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white hover:opacity-90"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => onViewModeChange(mode)}>
                {mode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArticleListPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [activeTags, setActiveTags]          = useState<string[]>([]);
  const [search, setSearch]                  = useState<string>("");
  const [searchOpen, setSearchOpen]          = useState<boolean>(false);
  const [viewMode, setViewMode]              = useState<ViewMode>("grid");
  const [sortBy, setSortBy]                  = useState<SortOption>("newest");
  const [page, setPage]                      = useState<number>(1);
  const [isLoading, setIsLoading]            = useState<boolean>(false);

  const topRef        = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile      = useIsMobile();
  const pageSize      = isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP;

  // Focus search on mobile overlay open
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  const toggleTag   = useCallback((tag: string) => {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
    setPage(1);
  }, []);

  const clearTags   = useCallback(() => { setActiveTags([]); setPage(1); }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setActiveCategory(value as CategoryId);
    setPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  }, []);

  // Called by FilterDrawer on apply
  const handleFilterApply = useCallback((tags: string[], sort: SortOption) => {
    setActiveTags(tags);
    setSortBy(sort);
    setPage(1);
  }, []);

  const filtered = useMemo<Article[]>(() => {
    let items = ARTICLES;
    if (activeCategory !== "all")
      items = items.filter((a) => a.category === activeCategory);
    if (activeTags.length)
      items = items.filter((a) => activeTags.every((t) => a.tags.includes(t)));
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
      );
    }
    const sorted = [...items];
    if (sortBy === "views")    sorted.sort((a, b) => Number(b.views) - Number(a.views));
    if (sortBy === "readtime") sorted.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    return sorted;
  }, [activeCategory, activeTags, search, sortBy]);

  useEffect(() => { setPage(1); }, [activeCategory, activeTags, search]);

  const totalPages   = Math.ceil(filtered.length / pageSize);
  const paged        = filtered.slice((page - 1) * pageSize, page * pageSize);
  const featuredItems = paged.filter((a) => a.featured).slice(0, 2);
  const regularItems  = paged.filter((a) => !a.featured);

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [totalPages]);

  const paginationPages = useMemo<number[]>(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)                return [1, 2, 3, -1, totalPages];
    if (page >= totalPages - 2)   return [1, -1, totalPages - 2, totalPages - 1, totalPages];
    return [1, -1, page - 1, page, page + 1, -1, totalPages];
  }, [page, totalPages]);

  const filterActiveCount = activeTags.length + (sortBy !== "newest" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background" ref={topRef}>

      {/* ── Mobile Search Overlay ─────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col sm:hidden">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-background">
            <Button variant="ghost" size="icon" className="h-11 w-11 flex-shrink-0 touch-manipulation"
              onClick={() => { setSearchOpen(false); setSearch(""); }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input ref={searchInputRef} value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="pl-9 h-11 text-[15px] bg-muted border-border/60 focus-visible:ring-1 focus-visible:ring-[#ab936c]"
              />
              {search && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 touch-manipulation"
                  onClick={() => setSearch("")}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {!search ? (
              // Popular tags
              <div className="px-4 pt-5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Tìm kiếm phổ biến
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.slice(0, 12).map((tag) => (
                    <button key={tag} onClick={() => setSearch(tag)}
                      className="h-10 px-4 rounded-full border border-border text-[13px] text-muted-foreground hover:border-[#ab936c] hover:text-[#624a2b] transition-all touch-manipulation bg-background">
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Live search results
              <div className="px-4 pt-4 pb-6 space-y-1">
                <p className="text-xs text-muted-foreground mb-3">
                  <strong className="text-foreground">{filtered.length}</strong> kết quả cho &ldquo;{search}&rdquo;
                </p>
                {filtered.slice(0, 8).map((a) => (
                  <button key={a.id} className="w-full text-left flex gap-3 items-center p-3 rounded-xl hover:bg-muted active:bg-muted/80 transition-colors touch-manipulation"
                    onClick={() => setSearchOpen(false)}>
                    <img src={a.image} alt={a.title} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground line-clamp-1">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.categoryLabel} · {a.readTime} đọc</p>
                    </div>
                  </button>
                ))}
                {filtered.length > 8 && (
                  <button className="w-full py-4 text-[13px] text-[#9c620f] font-semibold text-center touch-manipulation"
                    onClick={() => setSearchOpen(false)}>
                    Xem tất cả {filtered.length} kết quả →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">

          {/* ── Mobile top bar ── */}
          <div className="flex sm:hidden items-center h-14 gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9c620f] to-[#624a2b] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground text-[15px] tracking-tight truncate">
                The Chronicle
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-11 w-11 flex-shrink-0 touch-manipulation"
              onClick={() => setSearchOpen(true)}>
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button size="icon"
              className="h-11 w-11 flex-shrink-0 bg-gradient-to-br from-[#9c620f] to-[#624a2b] text-white border-0 hover:opacity-90 touch-manipulation rounded-xl">
              <PenLine className="w-4 h-4" />
            </Button>
          </div>

          {/* ── Desktop top bar ── */}
          <div className="hidden sm:flex items-center gap-4 h-14 border-b border-border/40">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9c620f] to-[#624a2b] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground text-[15px] tracking-tight">The Chronicle</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="pl-9 h-9 text-sm bg-muted border-border/60 focus-visible:ring-1 focus-visible:ring-[#ab936c] focus-visible:border-[#ab936c]"
              />
              {search && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearch("")}>
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <Button size="sm"
              className="ml-auto gap-1.5 bg-gradient-to-r from-[#9c620f] to-[#624a2b] hover:opacity-90 text-white border-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Viết bài
            </Button>
          </div>

          {/* ── Category Tabs (shared) ── */}
          <ScrollArea className="w-full">
            <div className="py-1.5">
              <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
                <TabsList className="bg-transparent h-auto gap-0.5 p-0 flex w-max">
                  {CATEGORIES.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.id}
                      className={cn(
                        "h-9 gap-1.5 px-3 text-[13px] font-medium rounded-xl border border-transparent touch-manipulation min-w-[72px]",
                        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9c620f] data-[state=active]:to-[#624a2b]",
                        "data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-transparent",
                        "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted",
                      )}>
                      <span className="hidden md:block">{cat.icon}</span>
                      {cat.label}
                      <Badge variant="secondary"
                        className={cn(
                          "text-[9px] h-4 px-1.5 py-0 font-bold",
                          activeCategory === cat.id
                            ? "bg-white/20 text-white border-0"
                            : "bg-muted text-muted-foreground border-border/40",
                        )}>
                        {cat.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <ScrollBar orientation="horizontal" className="h-0.5" />
          </ScrollArea>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-4 sm:py-8 space-y-4 sm:space-y-6">

        {/* ── Mobile toolbar ── */}
        <div className="flex sm:hidden items-center gap-2">
          <p className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
            <span className="font-semibold text-foreground">{filtered.length.toLocaleString("vi-VN")}</span> bài
            {activeTags.length > 0 && <span className="text-[#9c620f]"> · {activeTags.length} tag</span>}
          </p>
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-border/60 overflow-hidden bg-background flex-shrink-0">
            {(["grid", "list"] as const).map((mode) => (
              <Button key={mode} variant="ghost" size="icon"
                className={cn(
                  "h-10 w-10 rounded-none touch-manipulation",
                  viewMode === mode
                    ? "bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white hover:opacity-90"
                    : "text-muted-foreground",
                )}
                onClick={() => setViewMode(mode)}>
                {mode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
            ))}
          </div>
          {/* Filter drawer */}
          <FilterDrawer
            activeTags={activeTags}
            sortBy={sortBy}
            onApply={handleFilterApply}
            activeCount={filterActiveCount}
          />
        </div>

        {/* ── Desktop filter bar ── */}
        <div className="hidden sm:block">
          <DesktopFilterBar
            activeTags={activeTags}
            sortBy={sortBy}
            onToggleTag={toggleTag}
            onClearTags={clearTags}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filteredCount={filtered.length}
          />
        </div>

        {/* ── Articles ── */}
        {isLoading ? (
          <GridSkeleton count={isMobile ? 4 : 6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl select-none">🔍</div>
            <h3 className="font-bold text-lg text-foreground">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground text-sm">Thử thay đổi từ khoá hoặc bộ lọc</p>
            <Button variant="outline" onClick={() => { setSearch(""); clearTags(); setActiveCategory("all"); }}
              className="gap-2 h-11 px-5 touch-manipulation">
              <X className="w-4 h-4" /> Xoá tất cả bộ lọc
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="space-y-4 sm:space-y-5">
            {featuredItems.length > 0 && page === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {featuredItems.map((a) => <FeaturedCard key={a.id} article={a} />)}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {regularItems.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {paged.map((a) => <ListCard key={a.id} article={a} />)}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="pt-2 sm:pt-4">
            {/* Mobile: large prev/next with page indicator */}
            <div className="flex sm:hidden items-center gap-3">
              <Button variant="outline"
                className="flex-1 h-12 gap-2 text-[13px] font-medium border-border/70 touch-manipulation rounded-xl"
                disabled={page === 1} onClick={() => goToPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </Button>
              <div className="flex flex-col items-center text-center flex-shrink-0 px-1">
                <span className="text-[13px] font-semibold text-foreground">{page}</span>
                <span className="text-[10px] text-muted-foreground">/ {totalPages}</span>
              </div>
              <Button variant="outline"
                className="flex-1 h-12 gap-2 text-[13px] font-medium border-border/70 touch-manipulation rounded-xl"
                disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
                Trang sau <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Desktop: numbered */}
            <div className="hidden sm:flex items-center justify-center gap-1.5">
              <Button variant="outline" size="icon" className="h-9 w-9 border-border/60"
                disabled={page === 1} onClick={() => goToPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {paginationPages.map((p, idx) =>
                p === -1 ? (
                  <span key={`e-${idx}`} className="w-9 text-center text-muted-foreground text-sm">…</span>
                ) : (
                  <Button key={p} variant="outline" size="icon"
                    className={cn(
                      "h-9 w-9 text-sm font-semibold",
                      page === p
                        ? "bg-gradient-to-r from-[#9c620f] to-[#624a2b] text-white border-0 shadow-sm hover:opacity-90"
                        : "border-border/60 hover:border-[#ab936c] hover:text-[#624a2b]",
                    )}
                    onClick={() => goToPage(p)}>
                    {p}
                  </Button>
                )
              )}
              <Button variant="outline" size="icon" className="h-9 w-9 border-border/60"
                disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <Separator />
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-4">
          <span>
            {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)}
            {" / "}<strong className="text-foreground">{filtered.length.toLocaleString("vi-VN")}</strong> bài
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Cập nhật liên tục
          </span>
        </div>
      </div>
    </div>
  );
}