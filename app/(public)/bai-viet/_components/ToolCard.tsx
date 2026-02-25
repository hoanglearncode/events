"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bookmark, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  product: any;
}

export default function ScholarshipCard({ product }: Props) {
  const router = useRouter();

  // Dữ liệu giả định dựa trên cấu trúc Component cũ của bạn
  const title =
    product.name || "Học bổng Marvell Vietnam Excellence Scholarship 2026";
  const category = product.categoryName || "hoc bong 2025 2026";
  const thumbnail = product.thumbnailUrl || "/path-to-scholarship-image.jpg";
  const description =
    product.seoDescription ||
    "Chương trình hỗ trợ tài năng trẻ ngành công nghệ tại Việt Nam...";
  const date = "thg 1 12, 2026";

  return (
    <article
      onClick={() => router.push(`/scholarship/${product.id}`)}
      className="group card-elevated rounded-[2rem] p-5 flex flex-col gap-5 w-full max-w-md transition-all duration-300 hover:border-brand-primary/50 cursor-pointer"
    >
      {/* Container Ảnh - Sử dụng biến --muted cho nền */}
      <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-muted">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bookmark - Sử dụng glass-dark utility */}
        <button className="absolute top-4 right-4 z-10 p-2 glass-dark rounded-lg text-foreground/80 hover:text-brand-secondary transition-colors">
          <Bookmark size={20} className="fill-none" />
        </button>

        {/* Badge nổi trên ảnh - Sử dụng brand-primary */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
          <span className="text-foreground text-sm font-medium">
            Học bổng cho sinh viên
          </span>
          <div className="w-4 h-4 bg-brand-secondary rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-white w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Nội dung text */}
      <div className="flex flex-col gap-3 px-1">
        {/* Phân loại - Sử dụng muted-foreground */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
          <span>in</span>
          <span className="text-brand-accent hover:text-brand-secondary transition-colors uppercase tracking-wider text-xs">
            {category}
          </span>
        </div>

        {/* Tiêu đề - Sử dụng foreground (Shadow Black) */}
        <h3 className="text-foreground text-xl font-bold leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>

        {/* Mô tả ngắn - Sử dụng muted-foreground */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Footer Card */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            {/* Badge trạng thái - Sử dụng màu Success */}
            <Badge className="bg-brand-success/10 hover:bg-brand-success/20 text-brand-success border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">
              Published
            </Badge>
            <span className="text-muted-foreground text-xs font-medium italic">
              {date}
            </span>
          </div>

          <button className="text-brand-secondary text-sm font-bold flex items-center gap-0.5 hover:translate-x-1 transition-transform">
            Xem thêm »
          </button>
        </div>
      </div>
    </article>
  );
}
