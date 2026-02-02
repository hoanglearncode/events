"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangePasswordFrom from "@/components/features/auth/change-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg bg-card/50 border-border backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-success/20 flex items-center justify-center ring-1 ring-brand-success/30">
            <ShieldCheck className="w-6 h-6 text-brand-success" />
          </div>

          <CardTitle className="text-2xl text-card-foreground">
            Thiết lập mật khẩu mới
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Mật khẩu mới phải khác với mật khẩu cũ của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordFrom />
        </CardContent>
      </Card>

      {/* Gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
