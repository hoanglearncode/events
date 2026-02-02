"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, CalendarDays, TrendingUp, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Advertisement } from "./_components/AdvertisementDefautl";


const pinnedPosts = [
  {
    id: 1,
    title: `Học bổng Quỹ TNT "Ươm Mầm Ước Mơ" – Niên khóa 2025–2026`,
    excerpt:
      `Quỹ Học bổng TNT "Ươm Mầm Ước Mơ" trân trọng thông báo bắt đầu nhận hồ sơ xin học bổng năm học 2025–2026 với nhiều quyền lợi hấp dẫn...`,
    image: "/mock/pinned.jpg",
    category: "Học bổng 2025–2026",
    updatedAt: "08 thg 11, 2026",
  },
  {
    id: 2,
    title: "HỌC BỔNG PANASONIC 2025 CHÍNH THỨC MỞ CỔNG ĐĂNG KÝ",
    excerpt:
      "Học bổng Panasonic dành cho sinh viên xuất sắc với mức hỗ trợ lên đến 50 triệu đồng/năm. Thời gian nộp hồ sơ từ nay đến hết tháng 5/2025...",
    image: "/mock/popular-1.jpg",
    category: "Học bổng doanh nghiệp",
    updatedAt: "15 thg 4, 2025",
  },
  {
    id: 3,
    title: "Học Bổng CHAM 2024: Cơ Hội Học Tập Cho Sinh Viên Vượt Khó",
    excerpt:
      "Chương trình học bổng CHAM hỗ trợ sinh viên có hoàn cảnh khó khăn với mức học bổng từ 10-30 triệu đồng. Ưu tiên sinh viên có thành tích học tập tốt...",
    image: "/mock/popular-2.jpg",
    category: "Học bổng khuyến học",
    updatedAt: "19 thg 12, 2024",
  },
  {
    id: 4,
    title: "Học Bổng Đồng Hành VCSA – Cơ Hội Vươn Xa Cho Sinh Viên",
    excerpt:
      "VCSA triển khai chương trình học bổng Đồng Hành năm 2025 với tổng giá trị lên đến 2 tỷ đồng dành cho sinh viên ngành Kinh tế - Tài chính...",
    image: "/mock/latest-1.jpg",
    category: "Học bổng doanh nghiệp",
    updatedAt: "30 thg 12, 2024",
  },
];

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
    image: "/mock/popular-2.jpg",
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
    image: "/mock/latest-2.jpg",
    category: "Học bổng chính phủ",
    date: "1 ngày trước",
  },
  {
    id: 7,
    title: `Chương trình học bổng khuyến học Lương Định Của "Mừng Xuân Bình Ngọ – 2026"`,
    image: "/mock/latest-3.jpg",
    category: "Học bổng khuyến học",
    date: "3 ngày trước",
  },
  {
    id: 8,
    title: "Học bổng Fulbright cho sinh viên Việt Nam 2026",
    image: "/mock/latest-1.jpg",
    category: "Học bổng quốc tế",
    date: "4 ngày trước",
  },
  {
    id: 9,
    title: "Chương trình học bổng Vingroup 2026 - Đào tạo nhân tài công nghệ",
    image: "/mock/latest-2.jpg",
    category: "Học bổng doanh nghiệp",
    date: "5 ngày trước",
  },
  {
    id: 10,
    title: "Học bổng Toyota cho sinh viên ngành Kỹ thuật",
    image: "/mock/latest-3.jpg",
    category: "Học bổng doanh nghiệp",
    date: "1 tuần trước",
  },
];

export default function HomePortalPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % pinnedPosts.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + pinnedPosts.length) % pinnedPosts.length);
  }, []);

  const goToSlide = useCallback((index : number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-8 md:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ================= LEFT COLUMN (MAIN CONTENT) ================= */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              
              {/* -------- PINNED POST SLIDER -------- */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                  <Pin className="w-4 h-4" />
                  <h3 className="uppercase tracking-wider text-xs md:text-sm">Nổi bật nhất</h3>
                </div>

                <div 
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Slider Container */}
                  <div className="overflow-hidden rounded-lg">
                    <div 
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {pinnedPosts.map((post) => (
                        <div key={post.id} className="w-full flex-shrink-0">
                          <Card className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                              {/* Image Container */}
                              <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto md:min-h-[280px]">
                                <Image
                                  src={post.image}
                                  alt={post.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                <Badge className="absolute top-3 left-3 md:bottom-3 md:top-auto md:left-3 bg-primary/90 hover:bg-primary text-xs">
                                  {post.category}
                                </Badge>
                              </div>

                              {/* Content Container */}
                              <div className="flex flex-col p-4 md:p-6 md:w-3/5 justify-between gap-3 md:gap-4">
                                <div className="space-y-2 md:space-y-3">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CalendarDays className="w-3 h-3" />
                                    <span>{post.updatedAt}</span>
                                  </div>
                                  
                                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                    <a href="#" className="hover:underline decoration-primary/30 underline-offset-4">
                                      {post.title}
                                    </a>
                                  </h2>
                                  
                                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                                    {post.excerpt}
                                  </p>
                                </div>

                                <div className="pt-2">
                                  <Button variant="ghost" size="sm" className="pl-0 group/btn hover:bg-transparent hover:text-primary text-sm">
                                    Xem chi tiết <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons - Hidden on mobile */}
                  <button
                    onClick={prevSlide}
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:border-primary transition-all shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:border-primary transition-all shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {pinnedPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentSlide 
                            ? 'w-8 bg-primary' 
                            : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* -------- LATEST POSTS -------- */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-bold">Mới cập nhật</h3>
                  <Button variant="link" className="text-muted-foreground h-auto p-0 text-sm">Xem tất cả</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                                src="/placeholder.svg"
                                width={40} 
                                height={40} 
                                className="opacity-20" 
                                alt="" 
                              />
                            </div>
                          )}
                          <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] bg-background/80 backdrop-blur-sm">
                            {post.category}
                          </Badge>
                        </div>

                        <CardContent className="p-3 md:p-4 flex flex-col flex-1 gap-2 md:gap-3">
                          <h4 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="mt-auto pt-1 md:pt-2 flex items-center text-xs text-muted-foreground">
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
            <aside className="lg:col-span-4 space-y-6 md:space-y-8">
              
              {/* Popular Widget */}
              <Card className="border-none shadow-none bg-secondary/20 lg:bg-card lg:border lg:border-border lg:shadow-sm">
                <CardContent className="p-0 lg:p-6">
                  <div className="flex items-center gap-2 mb-3 md:mb-4 lg:mb-6 px-4 pt-4 lg:p-0">
                    <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                    <h3 className="font-bold text-base md:text-lg">Đọc nhiều nhất</h3>
                  </div>

                  <div className="flex flex-col divide-y divide-border/50">
                    {popularPosts.map((post) => (
                      <a
                        key={post.id}
                        href="#"
                        className="group flex gap-3 md:gap-4 py-3 md:py-4 px-4 lg:px-0 first:pt-0 last:pb-0 hover:bg-muted/50 lg:hover:bg-transparent transition-colors rounded-lg lg:rounded-none"
                      >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
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
                          <div className="absolute top-0 left-0 w-5 h-5 md:w-6 md:h-6 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold flex items-center justify-center rounded-br-lg">
                            {post.rank}
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <span className="text-[10px] md:text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advertisement Banner */}
              <Advertisement />
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}