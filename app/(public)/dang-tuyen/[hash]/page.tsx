"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronLeft,
  Send,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data cho bài viết nổi bật
const featuredPosts = [
  {
    id: 1,
    title: "Học bổng Vingroup Innovation Foundation 2026",
    category: "Học bổng",
    date: "15 Tháng 1, 2026",
    deadline: "28 Tháng 2, 2026",
    image: "/scholarship-1.jpg",
    isHot: true,
  },
  {
    id: 2,
    title: "Chương trình Du học Chevening Scholarship UK",
    category: "Du học",
    date: "10 Tháng 1, 2026",
    deadline: "5 Tháng 3, 2026",
    image: "/scholarship-2.jpg",
    isHot: true,
  },
  {
    id: 3,
    title: "Học bổng ASEAN Undergraduate 2026",
    category: "Học bổng",
    date: "8 Tháng 1, 2026",
    deadline: "20 Tháng 2, 2026",
    image: "/scholarship-3.jpg",
    isHot: false,
  },
  {
    id: 4,
    title: "Fulbright Master's Degree Program",
    category: "Thạc sĩ",
    date: "5 Tháng 1, 2026",
    deadline: "15 Tháng 3, 2026",
    image: "/scholarship-4.jpg",
    isHot: false,
  },
];

export default function PostDetail() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar - Không sticky */}
      <div className="w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-14 sm:h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary -ml-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark
                className={`h-4 w-4 sm:h-5 sm:w-5 ${bookmarked ? "fill-current text-brand-primary" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header Section */}
            <header className="space-y-4 sm:space-y-6 mb-6 sm:mb-10">
              <div className="space-y-3 sm:space-y-4">
                <Badge
                  variant="outline"
                  className="text-brand-secondary border-brand-secondary/30 bg-brand-secondary/5 px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest text-[9px] sm:text-[10px] font-bold"
                >
                  học bổng 2025-2026
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground tracking-tight">
                  Học bổng Marvell Vietnam Excellence Scholarship 2026
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-brand-accent flex-shrink-0">
                    <AvatarImage src="/avatar-placeholder.png" />
                    <AvatarFallback className="bg-brand-primary text-white text-sm">
                      H
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm truncate">
                        Học bổng cho sinh viên
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-blue-500 fill-current flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3 w-3" /> 12/01/2026
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="h-3 w-3" /> 5 phút đọc
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex flex-col items-start sm:items-end flex-1 sm:flex-initial">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">
                      Hạn chót ứng tuyển
                    </span>
                    <span className="text-sm sm:text-base font-bold text-brand-error whitespace-nowrap">
                      22/02/2026
                    </span>
                  </div>
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 sm:px-8 h-10 sm:h-12 rounded-xl shadow-lg shadow-brand-primary/20 flex items-center gap-2 group transition-all text-sm sm:text-base whitespace-nowrap">
                    Apply Now
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Banner Image */}
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-xl sm:shadow-2xl mb-8 sm:mb-12 border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2 p-4">
                  <div className="text-4xl sm:text-6xl font-bold text-white">
                    🎓
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white">
                    Marvell Scholarship
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6 sm:space-y-8">
              <div className="prose prose-sm sm:prose-base prose-stone dark:prose-invert max-w-none">
                <h2 className="text-xl sm:text-2xl font-bold text-brand-primary">
                  Thông tin chung
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Marvell Vietnam tự hào thông báo chương trình học bổng{" "}
                  <strong>Excellence Scholarship 2026</strong>. Đây là cơ hội
                  vàng dành cho các bạn sinh viên tài năng thuộc khối ngành Kỹ
                  thuật Điện tử, Công nghệ thông tin và Khoa học máy tính...
                </p>

                <div className="p-4 sm:p-6 bg-muted/50 rounded-xl sm:rounded-2xl border border-border space-y-3 sm:space-y-4 my-6">
                  <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                    <Badge className="bg-brand-secondary text-xs">
                      Gói học bổng
                    </Badge>
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li>30 suất học bổng tổng trị giá $30,000 USD.</li>
                    <li>
                      Cơ hội thực tập và làm việc tại các dự án Chip hàng đầu.
                    </li>
                    <li>Được dẫn dắt bởi các chuyên gia (Mentorship).</li>
                  </ul>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-brand-primary pt-4 sm:pt-6">
                  Yêu cầu hồ sơ
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Ứng viên cần chuẩn bị CV tiếng Anh, bảng điểm học tập gần nhất
                  và một bài luận ngắn (Statement of Purpose) nói về định hướng
                  nghề nghiệp trong ngành bán dẫn.
                </p>
              </div>

              {/* Contact Info - Mobile */}
              <div className="lg:hidden p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-muted/30">
                <h4 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                  Thông tin liên hệ
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      Phụ trách chương trình
                    </span>
                    <span className="font-semibold text-foreground italic">
                      Mr. Hieu Phung
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      Website chính thức
                    </span>
                    <a
                      href="#"
                      className="text-brand-secondary flex items-center gap-1 hover:underline text-sm"
                    >
                      marvell.com/vietnam <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    Chia sẻ bài viết:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10"
                    >
                      <MessageCircle size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10 text-blue-500"
                    >
                      <Send size={18} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg h-10 w-10 text-brand-primary"
                    >
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Apply Section */}
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-brand-primary text-white flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold">
                    Sẵn sàng để bứt phá?
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Hãy nộp hồ sơ trước ngày 22/02/2026 để không bỏ lỡ cơ hội
                    này.
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-primary hover:bg-white/90 font-bold px-8 sm:px-10 rounded-xl w-full sm:w-auto"
                >
                  Nộp hồ sơ ngay
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Contact Info - Desktop */}
            <div className="hidden lg:block p-6 rounded-2xl border border-border bg-muted/30">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                Thông tin liên hệ
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Phụ trách chương trình
                  </span>
                  <span className="font-semibold text-foreground italic">
                    Mr. Hieu Phung
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Website chính thức
                  </span>
                  <a
                    href="#"
                    className="text-brand-secondary flex items-center gap-1 hover:underline"
                  >
                    marvell.com/vietnam <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">
                  Chia sẻ bài viết:
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg h-10 w-10"
                  >
                    <MessageCircle size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg h-10 w-10 text-blue-500"
                  >
                    <Send size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg h-10 w-10 text-brand-primary"
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-primary" />
                  Bài viết nổi bật
                </h4>
              </div>

              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <a
                    key={post.id}
                    href="#"
                    className="group block p-3 sm:p-4 rounded-xl border border-border hover:border-brand-primary/50 hover:bg-muted/50 transition-all duration-200"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          🎓
                        </div>
                        {post.isHot && (
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-brand-error text-white text-[9px] px-1.5 py-0.5 h-auto">
                              HOT
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-2 py-0.5 h-auto"
                        >
                          {post.category}
                        </Badge>
                        <h5 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
                          {post.title}
                        </h5>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1 text-brand-error font-medium">
                            <Clock className="h-3 w-3" />
                            Hạn: {post.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 rounded-lg group"
              >
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
