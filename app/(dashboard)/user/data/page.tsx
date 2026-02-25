"use client";

import { useState } from "react";
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
} from "lucide-react";

// Types
interface Post {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "pending";
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
  thumbnail?: string;
}

interface Activity {
  id: string;
  type: "comment" | "like" | "share" | "view";
  postTitle: string;
  content?: string;
  timestamp: string;
}

interface FormSubmission {
  id: string;
  formType: "application" | "contact" | "survey";
  title: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  submittedAt: string;
  responseTime?: string;
}

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<
    "posts" | "saved" | "activity" | "forms"
  >("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const myPosts: Post[] = [
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
  ];

  const savedPosts: SavedPost[] = [
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
  ];

  const activities: Activity[] = [
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
  ];

  const formSubmissions: FormSubmission[] = [
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

  const tabs = [
    {
      id: "posts" as const,
      label: "Bài viết của tôi",
      icon: FileText,
      count: myPosts.length,
    },
    {
      id: "saved" as const,
      label: "Đã lưu",
      icon: Heart,
      count: savedPosts.length,
    },
    {
      id: "activity" as const,
      label: "Hoạt động",
      icon: Activity,
      count: activities.length,
    },
    {
      id: "forms" as const,
      label: "Form đã gửi",
      icon: FileCheck,
      count: formSubmissions.length,
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      published: {
        label: "Đã xuất bản",
        color: "bg-brand-success/10 text-brand-success",
      },
      draft: { label: "Nháp", color: "bg-muted text-muted-foreground" },
      pending: {
        label: "Chờ duyệt",
        color: "bg-brand-warning/10 text-brand-warning",
      },
      reviewed: {
        label: "Đã xem",
        color: "bg-brand-secondary/10 text-brand-secondary",
      },
      approved: {
        label: "Đã duyệt",
        color: "bg-brand-success/10 text-brand-success",
      },
      rejected: {
        label: "Từ chối",
        color: "bg-brand-error/10 text-brand-error",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
    const icons = {
      comment: <MessageSquare className="w-4 h-4" />,
      like: <Heart className="w-4 h-4" />,
      share: <Share2 className="w-4 h-4" />,
      view: <Eye className="w-4 h-4" />,
    };
    return icons[type];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="space-y-4">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng bài viết
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {myPosts.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-success/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-brand-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lượt xem</p>
                    <p className="text-2xl font-bold text-foreground">
                      {myPosts.reduce((sum, p) => sum + p.views, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-secondary/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bình luận</p>
                    <p className="text-2xl font-bold text-foreground">
                      {myPosts.reduce((sum, p) => sum + p.comments, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-error/10 rounded-lg">
                    <Heart className="w-5 h-5 text-brand-error" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lượt thích</p>
                    <p className="text-2xl font-bold text-foreground">
                      {myPosts.reduce((sum, p) => sum + p.likes, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts list */}
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground hover:text-brand-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <StatusBadge status={post.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.category} • Tạo ngày {post.createdAt}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views.toLocaleString()} lượt xem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments} bình luận</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes} lượt thích</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Cập nhật {post.lastModified}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Xem
                  </button>
                  <button className="px-4 py-2 text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors flex items-center gap-2 ml-auto">
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "saved":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <BookmarkPlus className="w-6 h-6 text-brand-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Bài viết đã lưu
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Bạn có {savedPosts.length} bài viết đã lưu để đọc sau
              </p>
            </div>

            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-brand-primary transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="px-2 py-1 bg-brand-accent/10 text-brand-accent rounded">
                        {post.category}
                      </span>
                      <span>Tác giả: {post.author}</span>
                      <span>Lưu ngày {post.savedAt}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-brand-error fill-brand-error" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
                    Đọc ngay
                  </button>
                  <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                    Chia sẻ
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "activity":
        return (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Hoạt động gần đây
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MessageSquare className="w-6 h-6 text-brand-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {activities.filter((a) => a.type === "comment").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Bình luận</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Heart className="w-6 h-6 text-brand-error mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {activities.filter((a) => a.type === "like").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Thích</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Share2 className="w-6 h-6 text-brand-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {activities.filter((a) => a.type === "share").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Chia sẻ</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Eye className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">847</p>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                </div>
              </div>
            </div>

            {/* Activity timeline */}
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-brand-primary/10 rounded-lg mt-1">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-foreground">
                          Bạn đã{" "}
                          <span className="font-semibold">
                            {activity.type === "comment" && "bình luận"}
                            {activity.type === "like" && "thích"}
                            {activity.type === "share" && "chia sẻ"}
                            {activity.type === "view" && "xem"}
                          </span>{" "}
                          bài viết{" "}
                          <span className="font-medium text-brand-primary">
                            {activity.postTitle}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.timestamp}
                        </span>
                      </div>
                      {activity.content && (
                        <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground italic">
                          "{activity.content}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "forms":
        return (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Tổng số form
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formSubmissions.length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Chờ duyệt</p>
                <p className="text-2xl font-bold text-brand-warning">
                  {formSubmissions.filter((f) => f.status === "pending").length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Đã duyệt</p>
                <p className="text-2xl font-bold text-brand-success">
                  {
                    formSubmissions.filter((f) => f.status === "approved")
                      .length
                  }
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Đã xem</p>
                <p className="text-2xl font-bold text-brand-secondary">
                  {
                    formSubmissions.filter((f) => f.status === "reviewed")
                      .length
                  }
                </p>
              </div>
            </div>

            {/* Form submissions list */}
            {formSubmissions.map((form) => (
              <div
                key={form.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileCheck className="w-5 h-5 text-brand-primary" />
                      <h3 className="text-lg font-semibold text-foreground">
                        {form.title}
                      </h3>
                      <StatusBadge status={form.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">
                        {form.formType === "application" && "Đơn ứng tuyển"}
                        {form.formType === "contact" && "Liên hệ"}
                        {form.formType === "survey" && "Khảo sát"}
                      </span>
                      <span>Gửi lúc {form.submittedAt}</span>
                      {form.responseTime && (
                        <span className="text-brand-success">
                          ⚡ Phản hồi trong {form.responseTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="mx-6 py-8 lg:mx-12 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dữ liệu của tôi
          </h1>
          <p className="text-muted-foreground">
            Quản lý bài viết, hoạt động và dữ liệu cá nhân của bạn
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            <button className="px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Xuất dữ liệu</span>
            </button>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
