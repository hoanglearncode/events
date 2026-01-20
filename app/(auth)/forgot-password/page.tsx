"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForgotPassword } from "@/hooks/queries/use-auth-queries";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/shared/validation/auth.schemas";

/* -------------------- Page -------------------- */
export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotAction = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotAction.mutateAsync(data as any);
      toast.success("Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn.");
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Gửi yêu cầu thất bại. Vui lòng thử lại.";

      const emailErrors = error?.response?.data?.errors?.email;
      if (emailErrors?.length) {
        setError("email", {
          type: "server",
          message: emailErrors[0],
        });
        toast.error(emailErrors[0]);
      } else {
        toast.error(serverMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border shadow-lg">
        {/* -------------------- Header -------------------- */}
        <CardHeader className="space-y-4 text-center">
          {/* Brand */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/event_logo.jpg"
              alt="volhub logo"
              width={40}
              height={40}
              priority
              className="rounded-md"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Volhub
            </span>
          </div>

          {/* Icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>

          <CardTitle className="text-2xl text-foreground">
            Quên mật khẩu?
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Nhập email đã đăng ký. Chúng tôi sẽ gửi thông tin khôi phục mật khẩu
            cho bạn.
          </CardDescription>
        </CardHeader>

        {/* -------------------- Content -------------------- */}
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="name@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Đang gửi yêu cầu...
                </div>
              ) : (
                "Gửi thông tin khôi phục"
              )}
            </Button>
          </form>
        </CardContent>

        {/* -------------------- Footer -------------------- */}
        <CardFooter className="flex justify-center">
          <a
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
