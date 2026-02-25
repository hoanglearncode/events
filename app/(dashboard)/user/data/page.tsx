"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Heart,
  MessageSquare,
  FileCheck,
  Trash2,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  BookmarkPlus,
  Activity,
  Filter,
  Search,
  MoreVertical,
  Download,
  Share2,
  CheckCheck,
  Clock,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpRight,
  Bookmark,
  Users,
  BarChart2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HourglassIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TablePagination } from "@/components/TablePagination";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type PostStatus = "published" | "draft" | "pending";
type ActivityType = "comment" | "like" | "share" | "view";
type FormType = "application" | "contact" | "survey";
type FormStatus = "pending" | "reviewed" | "approved" | "rejected";

interface Post {
  id: string;
  title: string;
  category: string;
  status: PostStatus;
  views: number;
  comments: number;
  likes: number;
  createdAt: string;
  lastModified: string;
}

interface SavedPost {
  id: string;
  title: string;
  category: string;
  author: string;
  savedAt: string;
}

interface UserActivity {
  id: string;
  type: ActivityType;
  postTitle: string;
  content?: string;
  timestamp: string;
}

interface FormSubmission {
  id: string;
  formType: FormType;
  title: string;
  status: FormStatus;
  submittedAt: string;
  responseTime?: string;
}

type TabId = "posts" | "saved" | "activity" | "forms";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MY_POSTS: Post[] = [
  {
    id: "1",
    title: "Hướng dẫn lập trình Next.js 14 từ A-Z",
    category: "Lập trình",
    status: "published",
    views: 1234,
    comments: 45,
    likes: 89,
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
  },
  {
    id: "2",
    title: "Top 10 thư viện React tốt nhất 2024",
    category: "Công nghệ",
    status: "published",
    views: 890,
    comments: 23,
    likes: 67,
    createdAt: "2024-01-10",
    lastModified: "2024-01-18",
  },
  {
    id: "3",
    title: "Tối ưu hiệu năng web với Tailwind CSS",
    category: "Frontend",
    status: "draft",
    views: 0,
    comments: 0,
    likes: 0,
    createdAt: "2024-01-25",
    lastModified: "2024-01-25",
  },
  {
    id: "4",
    title: "CI/CD Pipeline với GitHub Actions",
    category: "DevOps",
    status: "pending",
    views: 0,
    comments: 0,
    likes: 0,
    createdAt: "2024-01-27",
    lastModified: "2024-01-27",
  },
];

const SAVED_POSTS: SavedPost[] = [
  {
    id: "1",
    title: "Design System Best Practices",
    category: "UI/UX",
    author: "Nguyễn Văn A",
    savedAt: "2024-01-22",
  },
  {
    id: "2",
    title: "Microservices Architecture Pattern",
    category: "Backend",
    author: "Trần Thị B",
    savedAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Web Performance Optimization 2024",
    category: "Frontend",
    author: "Lê Văn C",
    savedAt: "2024-01-18",
  },
];

const ACTIVITIES: UserActivity[] = [
  {
    id: "1",
    type: "comment",
    postTitle: "TypeScript Advanced Tips",
    content: "Rất hữu ích, cảm ơn tác giả!",
    timestamp: "2024-01-28 14:30",
  },
  {
    id: "2",
    type: "like",
    postTitle: "Clean Code Principles",
    timestamp: "2024-01-28 10:15",
  },
  {
    id: "3",
    type: "share",
    postTitle: "React Server Components",
    timestamp: "2024-01-27 16:20",
  },
  {
    id: "4",
    type: "view",
    postTitle: "Docker Fundamentals",
    timestamp: "2024-01-27 09:00",
  },
];

const FORM_SUBMISSIONS: FormSubmission[] = [
  {
    id: "1",
    formType: "application",
    title: "Đơn ứng tuyển Senior Frontend Developer",
    status: "reviewed",
    submittedAt: "2024-01-20 09:00",
    responseTime: "2 ngày",
  },
  {
    id: "2",
    formType: "contact",
    title: "Liên hệ hợp tác dự án",
    status: "approved",
    submittedAt: "2024-01-18 14:30",
    responseTime: "1 ngày",
  },
  {
    id: "3",
    formType: "survey",
    title: "Khảo sát trải nghiệm người dùng",
    status: "pending",
    submittedAt: "2024-01-27 11:00",
  },
];

// ─── Config Maps ──────────────────────────────────────────────────────────────
const POST_STATUS_CONFIG: Record<
  PostStatus,
  { label: string; className: string; dot: string }
> = {
  published: {
    label: "Đã xuất bản",
    className: "bg-brand-success/10 text-brand-success",
    dot: "bg-brand-success",
  },
  draft: {
    label: "Nháp",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-500/10 text-yellow-600",
    dot: "bg-yellow-500",
  },
};

const FORM_STATUS_CONFIG: Record<
  FormStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-500/10 text-yellow-600",
    icon: <HourglassIcon size={11} />,
  },
  reviewed: {
    label: "Đã xem",
    className: "bg-brand-secondary/10 text-brand-secondary",
    icon: <Eye size={11} />,
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-brand-success/10 text-brand-success",
    icon: <CheckCircle2 size={11} />,
  },
  rejected: {
    label: "Từ chối",
    className: "bg-brand-error/10 text-brand-error",
    icon: <XCircle size={11} />,
  },
};

const FORM_TYPE_LABEL: Record<FormType, string> = {
  application: "Ứng tuyển",
  contact: "Liên hệ",
  survey: "Khảo sát",
};

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  comment: {
    label: "bình luận",
    icon: <MessageSquare size={14} />,
    color: "bg-brand-primary/10 text-brand-primary",
  },
  like: {
    label: "thích",
    icon: <Heart size={14} />,
    color: "bg-brand-error/10 text-brand-error",
  },
  share: {
    label: "chia sẻ",
    icon: <Share2 size={14} />,
    color: "bg-brand-secondary/10 text-brand-secondary",
  },
  view: {
    label: "xem",
    icon: <Eye size={14} />,
    color: "bg-brand-accent/10 text-brand-accent",
  },
};

// ─── Small Reusables ──────────────────────────────────────────────────────────
function StatMini({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 min-w-0">
      <div
        className={cn(
          "p-2 rounded-lg flex-shrink-0",
          accent ?? "bg-brand-primary/10 text-brand-primary"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground leading-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Posts Tab ────────────────────────────────────────────────────────────────
function PostsTab({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatMini
          label="Bài viết"
          value={posts.length}
          icon={<FileText size={15} />}
        />
        <StatMini
          label="Lượt xem"
          value={totalViews}
          icon={<TrendingUp size={15} />}
          accent="bg-brand-success/10 text-brand-success"
        />
        <StatMini
          label="Bình luận"
          value={totalComments}
          icon={<MessageSquare size={15} />}
          accent="bg-brand-secondary/10 text-brand-secondary"
        />
        <StatMini
          label="Lượt thích"
          value={totalLikes}
          icon={<Heart size={15} />}
          accent="bg-brand-error/10 text-brand-error"
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(["all", "published", "draft", "pending"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "flex-shrink-0 px-3 py-1 rounded text-xs font-medium border transition-all",
              filter === s
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-brand-primary/40"
            )}
          >
            {s === "all"
              ? "Tất cả"
              : POST_STATUS_CONFIG[s].label}
            {s !== "all" && (
              <span className="ml-1 opacity-70">
                ({posts.filter((p) => p.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {/* Table header — hidden on mobile */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-2 bg-muted/40 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Tiêu đề</span>
          <span className="w-16 text-center">Xem</span>
          <span className="w-16 text-center">B.luận</span>
          <span className="w-14 text-center">Thích</span>
          <span className="w-8" />
        </div>

        {filtered.map((post, i) => {
          const st = POST_STATUS_CONFIG[post.status];
          return (
            <div
              key={post.id}
              className={cn(
                "group flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center gap-2 sm:gap-4 px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
              )}
            >
              {/* Main info */}
              <div className="flex items-start gap-2 min-w-0">
                <span
                  className={cn(
                    "mt-1 flex-shrink-0 h-2 w-2 rounded-full",
                    st.dot
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-brand-primary transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      {post.category}
                    </span>
                    <StatusPill className={st.className}>{st.label}</StatusPill>
                    {/* Mobile stats */}
                    <span className="flex items-center gap-2 text-[10px] text-muted-foreground sm:hidden">
                      <Eye size={10} /> {post.views.toLocaleString()}
                      <MessageSquare size={10} /> {post.comments}
                      <Heart size={10} /> {post.likes}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 sm:hidden">
                    Cập nhật {post.lastModified}
                  </p>
                </div>
              </div>

              {/* Desktop stats */}
              <span className="hidden sm:flex items-center justify-center gap-1 text-xs text-muted-foreground w-16">
                <Eye size={11} /> {post.views.toLocaleString()}
              </span>
              <span className="hidden sm:flex items-center justify-center gap-1 text-xs text-muted-foreground w-16">
                <MessageSquare size={11} /> {post.comments}
              </span>
              <span className="hidden sm:flex items-center justify-center gap-1 text-xs text-muted-foreground w-14">
                <Heart size={11} /> {post.likes}
              </span>

              {/* Actions */}
              <div className="flex sm:w-8 gap-1 sm:gap-0 sm:justify-center">
                {/* Mobile: inline buttons */}
                <div className="flex gap-2 sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 border-border"
                  >
                    <Edit size={11} /> Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-brand-error hover:bg-brand-error/10"
                  >
                    <Trash2 size={11} />
                  </Button>
                </div>
                {/* Desktop: dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden sm:flex h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="glass-dark border-border w-40 text-sm"
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Hành động
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-3.5 w-3.5" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-3.5 w-3.5" /> Xem trước
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" /> Mở trang
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="cursor-pointer text-brand-error">
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <FileText size={28} className="opacity-30" />
            <p className="text-sm">Không có bài viết nào</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 bg-muted/20 border-t border-border">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length}/{posts.length} bài viết
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Saved Tab ────────────────────────────────────────────────────────────────

function ActionButtons({ onOpen, onDelete }: { onOpen?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-brand-primary"
        onClick={onOpen}
        aria-label="Mở bài viết"
      >
        <ArrowUpRight size={13} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-brand-error"
        onClick={onDelete}
        aria-label="Xóa bài viết"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}

export function SavedTab({ posts }: { posts: SavedPost[] }) {
  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center gap-2 px-2">
        <Bookmark size={14} className="text-brand-primary" />
        <span className="text-sm text-muted-foreground truncate">
          {posts.length} bài viết đã lưu để đọc sau
        </span>
      </div>

      {/* list */}
      <div className="border border-border rounded overflow-hidden bg-card">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            {/* icon */}
            <div className="flex-shrink-0 p-2 bg-brand-primary/10 text-brand-primary rounded-lg hidden sm:flex items-center justify-center">
              <FileText size={14} />
            </div>

            {/* content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-brand-primary transition-colors">
                {post.title}
              </p>
              <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px]">
                <span className="px-1.5 py-0.5 bg-brand-accent/10 text-brand-accent rounded font-medium">
                  {post.category}
                </span>
                <span className="text-muted-foreground">{post.author}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={9} /> {post.savedAt}
                </span>
              </div>
            </div>

            {/* actions */}
            <div className="flex mt-2 sm:mt-0 sm:ml-2">
              <ActionButtons />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab({ activities }: { activities: UserActivity[] }) {
  const counts = {
    comment: activities.filter((a) => a.type === "comment").length,
    like: activities.filter((a) => a.type === "like").length,
    share: activities.filter((a) => a.type === "share").length,
    view: 847,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatMini
          label="Bình luận"
          value={counts.comment}
          icon={<MessageSquare size={15} />}
        />
        <StatMini
          label="Lượt thích"
          value={counts.like}
          icon={<Heart size={15} />}
          accent="bg-brand-error/10 text-brand-error"
        />
        <StatMini
          label="Chia sẻ"
          value={counts.share}
          icon={<Share2 size={15} />}
          accent="bg-brand-secondary/10 text-brand-secondary"
        />
        <StatMini
          label="Lượt xem"
          value={counts.view}
          icon={<Eye size={15} />}
          accent="bg-brand-accent/10 text-brand-accent"
        />
      </div>

      {/* Timeline */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="px-4 py-2 bg-muted/40 border-b border-border">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Lịch sử hoạt động
          </span>
        </div>

        <div className="divide-y divide-border">
          {activities.map((act) => {
            const conf = ACTIVITY_CONFIG[act.type];
            return (
              <div
                key={act.id}
                className="group flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={cn(
                    "flex-shrink-0 p-2 rounded-lg mt-0.5",
                    conf.color
                  )}
                >
                  {conf.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    Bạn đã{" "}
                    <span className="font-semibold">{conf.label}</span> bài
                    viết{" "}
                    <span className="text-brand-primary font-medium hover:underline cursor-pointer">
                      {act.postTitle}
                    </span>
                  </p>
                  {act.content && (
                    <p className="mt-1.5 px-2.5 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground italic line-clamp-1">
                      "{act.content}"
                    </p>
                  )}
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <Clock size={9} /> {act.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2 bg-muted/20 border-t border-border">
          <button className="text-[11px] text-brand-primary hover:underline flex items-center gap-1">
            Xem toàn bộ lịch sử <ArrowUpRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Forms Tab ────────────────────────────────────────────────────────────────
function FormsTab({ forms }: { forms: FormSubmission[] }) {
  const counts = {
    total: forms.length,
    pending: forms.filter((f) => f.status === "pending").length,
    approved: forms.filter((f) => f.status === "approved").length,
    reviewed: forms.filter((f) => f.status === "reviewed").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatMini
          label="Tổng form"
          value={counts.total}
          icon={<FileCheck size={15} />}
        />
        <StatMini
          label="Chờ duyệt"
          value={counts.pending}
          icon={<HourglassIcon size={15} />}
          accent="bg-yellow-500/10 text-yellow-600"
        />
        <StatMini
          label="Đã duyệt"
          value={counts.approved}
          icon={<CheckCircle2 size={15} />}
          accent="bg-brand-success/10 text-brand-success"
        />
        <StatMini
          label="Đã xem"
          value={counts.reviewed}
          icon={<Eye size={15} />}
          accent="bg-brand-secondary/10 text-brand-secondary"
        />
      </div>

      {/* List */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="px-4 py-2 bg-muted/40 border-b border-border">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Danh sách form đã gửi
          </span>
        </div>

        {forms.map((form) => {
          const st = FORM_STATUS_CONFIG[form.status];
          return (
            <div
              key={form.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 p-2 bg-brand-primary/10 text-brand-primary rounded-lg mt-0.5">
                  <FileCheck size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-brand-primary transition-colors">
                    {form.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-medium">
                      {FORM_TYPE_LABEL[form.formType]}
                    </span>
                    <StatusPill className={st.className}>
                      {st.icon} {st.label}
                    </StatusPill>
                    {form.responseTime && (
                      <span className="flex items-center gap-1 text-[10px] text-brand-success">
                        ⚡ {form.responseTime}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                    <Clock size={9} /> {form.submittedAt}
                  </span>
                </div>
              </div>

              <div className="flex gap-1.5 sm:flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 border-border"
                >
                  <Eye size={11} className="hidden sm:block" /> Xem
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground"
                >
                  <Download size={11} />
                </Button>
              </div>
            </div>
          );
        })}

        <div className="px-4 py-2 bg-muted/20 border-t border-border">
          <span className="text-[11px] text-muted-foreground">
            {forms.length} form đã gửi
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DataPage() {
  const [activeTab, setActiveTab] = useState<TabId>("posts");
  const [search, setSearch] = useState("");

  const TABS: {
    id: TabId;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      id: "posts",
      label: "Bài viết của tôi",
      shortLabel: "Bài viết",
      icon: <FileText size={15} />,
      count: MY_POSTS.length,
    },
    {
      id: "saved",
      label: "Đã lưu",
      shortLabel: "Đã lưu",
      icon: <Heart size={15} />,
      count: SAVED_POSTS.length,
    },
    {
      id: "activity",
      label: "Hoạt động",
      shortLabel: "H.động",
      icon: <Activity size={15} />,
      count: ACTIVITIES.length,
    },
    {
      id: "forms",
      label: "Form đã gửi",
      shortLabel: "Forms",
      icon: <FileCheck size={15} />,
      count: FORM_SUBMISSIONS.length,
    },
  ];

  const totalItems =
    MY_POSTS.length +
    SAVED_POSTS.length +
    ACTIVITIES.length +
    FORM_SUBMISSIONS.length;

  return (
    <div className="min-h-screen bg-background text-foreground mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="p-1.5 bg-primary rounded-lg">
                <BarChart2 className="text-primary-foreground h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                Dữ liệu của tôi
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Quản lý bài viết, hoạt động và dữ liệu cá nhân của bạn.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 border-border hidden sm:flex"
          >
            <Download size={13} /> Xuất dữ liệu
          </Button>
        </div>

        {/* ── Search + Actions bar ── */}
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm trong dữ liệu của bạn..."
              className="pl-9 h-9 text-sm bg-card border-border focus:ring-brand-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile export */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border sm:hidden flex-shrink-0"
          >
            <Download size={14} />
          </Button>
        </div>

        {/* ── Tab Bar ── */}
        {/* Desktop: horizontal tabs */}
        <div className="hidden sm:flex bg-muted/50 border border-border rounded-xl p-1 mb-5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card text-brand-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.icon}
              {tab.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                  activeTab === tab.id
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: icon tabs */}
        <div className="flex sm:hidden bg-muted/50 border border-border rounded p-1 mb-5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded transition-all",
                activeTab === tab.id
                  ? "bg-card text-brand-primary shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === "posts" && <PostsTab posts={MY_POSTS} />}
        {activeTab === "saved" && <SavedTab posts={SAVED_POSTS} />}
        {activeTab === "activity" && <ActivityTab activities={ACTIVITIES} />}
        {activeTab === "forms" && <FormsTab forms={FORM_SUBMISSIONS} />}
      </div>
    </div>
  );
}