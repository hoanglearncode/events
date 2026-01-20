"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* 404 Visual */}
        <div className="relative select-none">
          <h1 className="text-[140px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary/30 to-primary/5 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-primary/10 animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="-mt-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trang không tồn tại
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Có thể đường dẫn đã bị thay đổi, bị xoá hoặc bạn nhập sai URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>

          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t border-border/60">
          <p className="text-sm text-muted-foreground mb-4">
            Có thể bạn đang tìm:
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/courses" className="text-primary hover:underline">
              Khóa học
            </Link>
            <Link href="/blog" className="text-primary hover:underline">
              Blog
            </Link>
            <Link href="/marketplace" className="text-primary hover:underline">
              Marketplace
            </Link>
            <Link href="/tool" className="text-primary hover:underline">
              Công cụ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
