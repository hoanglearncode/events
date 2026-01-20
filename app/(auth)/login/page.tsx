"use client";

import React, { useCallback, useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Zap,
  Bot,
  Layers,
  Video,
  ShieldCheck,
  Sparkles,
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
import LoginForm from "@/components/features/auth/login-form";

function SocialButton({
  children,
  label,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  // keep as simple wrapper to ensure accessible name
  return (
    <Button
      {...(props as any)}
      aria-label={label}
      className={`gap-2 ${props.className || ""}`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
    <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-r border-border relative overflow-hidden">
      {/* background blur */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* BRAND */}
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

        {/* HERO */}
        <h1 className="text-4xl font-extrabold leading-tight mb-6">
          Kết nối Nhân sự <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sự kiện toàn quốc
          </span>
        </h1>

        <div className="space-y-6 max-w-lg">
          {/* ITEM 1 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-primary/10 p-2 rounded-md h-fit">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">
                Kết nối đúng người – đúng việc
              </h3>
              <p className="text-muted-foreground">
                Mạng lưới nhân sự sự kiện toàn quốc, kết nối nhanh chóng giữa
                Ban Tổ chức, Doanh nghiệp và Nhân sự sự kiện.
              </p>
            </div>
          </div>

          {/* ITEM 2 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-secondary/10 p-2 rounded-md h-fit">
              <Bot className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondary">
                Tuyển dụng linh hoạt – minh bạch
              </h3>
              <p className="text-muted-foreground">
                Tuyển Tình nguyện viên, Cộng tác viên, Nhân sự sự kiện
                với quy trình rõ ràng, thông tin minh bạch.
              </p>
            </div>
          </div>

          {/* ITEM 3 */}
          <div className="flex gap-4">
            <div className="mt-1 bg-accent/10 p-2 rounded-md h-fit">
              <Video className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-accent">
                Đồng hành cùng Ban Tổ chức
              </h3>
              <p className="text-muted-foreground">
                Hỗ trợ sự kiện từ nhỏ đến lớn – từ chuẩn bị, triển khai
                đến vận hành thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOT SLOGAN */}
      <div className="relative z-10 mt-12 pt-8 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground italic">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Nhanh chóng – Minh bạch – Đúng người
        </div>
      </div>
    </aside>


      <main className="flex items-center justify-center p-6 lg:p-12">
        <Card
          className="w-full max-w-md glass-dark"
          role="region"
          aria-labelledby={`title`}
        >
          <CardHeader className="space-y-1">
            <CardTitle id={`title`} className="text-2xl font-bold text-center">
              Chào mừng quay trở lại
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin để truy cập hệ thống ManixAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="w-full">
              <SocialButton
                label="Sign in with Google"
                variant="outline"
                className="border-border w-full"
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
                }}
              >
                <Globe className="w-4 h-4" />
                Google
              </SocialButton>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
