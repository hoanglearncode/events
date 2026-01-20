"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, CalendarDays, TrendingUp, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* MOCK DATA */
/* ------------------------------------------------------------------ */

const pinnedPost = {
  id: 1,
  title: "Học bổng Quỹ TNT “Ươm Mầm Ước Mơ” – Niên khóa 2025–2026",
  excerpt:
    "Quỹ Học bổng TNT “Ươm Mầm Ước Mơ” trân trọng thông báo bắt đầu nhận hồ sơ xin học bổng năm học 2025–2026 với nhiều quyền lợi hấp dẫn...",
  image: "/mock/pinned.jpg",
  category: "Học bổng 2025–2026",
  updatedAt: "08 thg 11, 2026",
};

const popularPosts = [
  {
    id: 2,
    title: "HỌC BỔNG PANASONIC 2025 CHÍNH THỨC MỞ CỔNG ĐĂNG KÝ",
    image: "/mock/popular-1.jpg",
    date: "15 thg 4",
    rank: 1,
  },
  {
    id: 3,
    title: "Học Bổng CHAM 2024: Cơ Hội Học Tập Cho Sinh Viên Vượt Khó",
    image: "/mock/popular-2.jpg", // Added dummy image for consistency
    date: "19 thg 12",
    rank: 2,
  },
  {
    id: 4,
    title: "Học Bổng Đồng Hành VCSA – Cơ Hội Vươn Xa Cho Sinh Viên",
    image: null,
    date: "30 thg 12",
    rank: 3,
  },
];

const latestPosts = [
  {
    id: 5,
    title: "Học bổng Marvell Vietnam Excellence Scholarship 2026",
    image: "/mock/latest-1.jpg",
    category: "Học bổng doanh nghiệp",
    date: "2 giờ trước",
  },
  {
    id: 6,
    title: "Chương trình học bổng Hessen năm học 2025 – 2026",
    image: null,
    category: "Học bổng chính phủ",
    date: "1 ngày trước",
  },
  {
    id: 7,
    title: "Chương trình học bổng khuyến học Lương Định Của “Mừng Xuân Bình Ngọ – 2026”",
    image: "/mock/latest-3.jpg",
    category: "Học bổng khuyến học",
    date: "3 ngày trước",
  },
];

/* ------------------------------------------------------------------ */
/* COMPONENTS */
/* ------------------------------------------------------------------ */

export default function HomePortalPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-20 pb-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-10">
          
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Tin tức & Sự kiện</h1>
            <p className="text-muted-foreground">Cập nhật những thông tin học bổng mới nhất.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ================= LEFT COLUMN (MAIN CONTENT) ================= */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* -------- PINNED POST -------- */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                  <Pin className="w-4 h-4" />
                  <h3 className="uppercase tracking-wider text-sm">Nổi bật nhất</h3>
                </div>

                <Card className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300">
                  {/* Mobile: Flex-col, Desktop: Flex-row */}
                  <div className="flex flex-col md:flex-row">
                    {/* Image Container */}
                    <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto">
                      <Image
                        src={pinnedPost.image}
                        alt={pinnedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                      <Badge className="absolute top-3 left-3 md:bottom-3 md:top-auto md:left-3 bg-primary/90 hover:bg-primary">
                        {pinnedPost.category}
                      </Badge>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col p-5 md:p-6 md:w-3/5 justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="w-3 h-3" />
                          <span>{pinnedPost.updatedAt}</span>
                        </div>
                        
                        <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                          <a href="#" className="hover:underline decoration-primary/30 underline-offset-4">
                            {pinnedPost.title}
                          </a>
                        </h2>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3 md:line-clamp-2 lg:line-clamp-3">
                          {pinnedPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-2">
                         <Button variant="ghost" size="sm" className="pl-0 group/btn hover:bg-transparent hover:text-primary">
                            Xem chi tiết <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                         </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

              {/* -------- LATEST POSTS -------- */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Mới cập nhật</h3>
                  <Button variant="link" className="text-muted-foreground h-auto p-0">Xem tất cả</Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestPosts.map((post) => (
                    <a
                      key={post.id}
                      href="#"
                      className="group flex flex-col h-full"
                    >
                      <Card className="h-full border-border/60 overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
                        <div className="relative w-full aspect-[16/9] bg-muted">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                <Image 
                                    src="/placeholder.svg" // Fallback icon or image
                                    width={40} height={40} 
                                    className="opacity-20" alt="" 
                                />
                            </div>
                          )}
                          <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] bg-background/80 backdrop-blur-sm">
                            {post.category}
                          </Badge>
                        </div>

                        <CardContent className="p-4 flex flex-col flex-1 gap-3">
                          <h4 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="mt-auto pt-2 flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {post.date}
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* ================= RIGHT COLUMN (SIDEBAR) ================= */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Popular Widget */}
              <Card className="border-none shadow-none bg-secondary/20 lg:bg-card lg:border lg:border-border lg:shadow-sm">
                <CardContent className="p-0 lg:p-6">
                  <div className="flex items-center gap-2 mb-4 lg:mb-6 px-4 pt-4 lg:p-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Đọc nhiều nhất</h3>
                  </div>

                  <div className="flex flex-col divide-y divide-border/50">
                    {popularPosts.map((post, index) => (
                      <a
                        key={post.id}
                        href="#"
                        className="group flex gap-4 py-4 px-4 lg:px-0 first:pt-0 last:pb-0 hover:bg-muted/50 lg:hover:bg-transparent transition-colors rounded-lg lg:rounded-none"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                           {post.image ? (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                           ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground font-medium">
                                    #{post.rank}
                                </div>
                           )}
                           {/* Rank Badge for Mobile visual */}
                           <div className="absolute top-0 left-0 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center rounded-br-lg">
                             {post.rank}
                           </div>
                        </div>

                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advertisement / Banner Placeholder */}
              <div className="hidden lg:block relative w-full aspect-[3/4] rounded-xl bg-muted border border-border overflow-hidden p-6 text-center flex flex-col items-center justify-center">
                 <span className="text-muted-foreground text-sm">Banner Quảng cáo</span>
              </div>

            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}