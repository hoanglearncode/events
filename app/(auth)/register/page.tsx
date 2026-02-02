"use client";

import React, { useCallback, useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Zap,
  Sparkles,
  UserPlus,
  ArrowRight,
  Bot,
  Layers,
  Video,
  Eye,
  EyeOff,
  Github,
  Globe,
} from "lucide-react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterComponent from "@/components/features/auth/sign-form";

function SocialButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      className="border-border flex items-center justify-center gap-2 w-full"
      onClick={onClick}
      aria-label={label}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-tr from-secondary/10 via-background to-primary/10 border-r border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none dark:opacity-20">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary rounded-full blur-[130px]" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/event_logo.jpg"
              alt="Nhà Có Event logo"
              width={55}
              height={55}
              priority
              className="rounded-md"
            />
            <span className="text-2xl font-bold tracking-tight">
              Nhà Có Event
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Tham gia cộng đồng <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nhân sự Sự kiện
            </span>
          </h1>

          <div className="space-y-6 max-w-lg">
            <p className="text-lg text-muted-foreground">
              Nơi kết nối Ban Tổ chức, Doanh nghiệp với Nhân sự,
              Cộng tác viên và Tình nguyện viên sự kiện trên toàn quốc.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-accent/20 p-1 rounded-full">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground">
                  Cơ hội tham gia đa dạng sự kiện lớn nhỏ
                </span>
              </li>

              <li className="flex items-center gap-3">
                <div className="bg-accent/20 p-1 rounded-full">
                  <Layers className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground">
                  Tuyển dụng minh bạch – thông tin rõ ràng
                </span>
              </li>

              <li className="flex items-center gap-3">
                <div className="bg-accent/20 p-1 rounded-full">
                  <Video className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground">
                  Đồng hành cùng Ban Tổ chức & Doanh nghiệp
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative z-10 text-sm text-muted-foreground italic">
          Nhanh chóng – Minh bạch – Đúng người
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 lg:p-12">
        <Card
          className="w-full max-w-md glass-dark"
          role="region"
          aria-labelledby={`title`}
        >
          <CardHeader className="space-y-1">
            <CardTitle
              id={`title`}
              className="text-2xl font-bold text-center flex items-center justify-center gap-2"
            >
              <UserPlus className="w-6 h-6 text-primary" /> Đăng ký tài khoản
            </CardTitle>
            <CardDescription className="text-center">
              Chỉ mất 30 giây để bắt đầu quy trình render siêu tốc
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterComponent />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Đăng nhập
              </Link>
            </p>

            <div className="w-full">
              <SocialButton
                label="Sign in with Google"
                onClick={() =>
                  (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`)
                }
              >
                <Globe className="w-4 h-4" />
                Google
              </SocialButton>
            </div>

            <div className="text-[10px] text-center text-muted-foreground px-6">
              Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách
              bảo mật của chúng tôi.
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
