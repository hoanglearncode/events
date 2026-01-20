"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/shared/validation/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useChangePassword } from "@/hooks/queries/profileQueries";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ChangePasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { mutateAsync, isPending } = useChangePassword();
  const router = useRouter();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Watch password để hiển thị strength indicator
  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await mutateAsync(data);

      toast.success("Đổi mật khẩu thành công", {
        description: "Bạn sẽ được chuyển về trang chủ",
        icon: <CheckCircle2 className="w-5 h-5 text-brand-success" />,
      });

      // Delay để user thấy toast
      setTimeout(() => {
        window.location.href = "/website";
      }, 1000);

      reset();
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error: any) {
      toast.error("Đổi mật khẩu thất bại", {
        description: error?.message || "Vui lòng kiểm tra lại thông tin",
        icon: <AlertCircle className="w-5 h-5 text-brand-error" />,
      });
    }
  };

  // Password strength calculator
  const getPasswordStrength = (password: string = "") => {
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { level: 33, text: "Yếu", color: "bg-brand-error" };
    if (strength <= 3)
      return { level: 66, text: "Trung bình", color: "bg-brand-warning" };
    return { level: 100, text: "Mạnh", color: "bg-brand-success" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Lock className="w-5 h-5 text-primary" />
          Đổi mật khẩu
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Cập nhật mật khẩu của bạn để bảo vệ tài khoản
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Mật khẩu cũ */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-card-foreground">
              Mật khẩu cũ
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOld ? "text" : "password"}
                placeholder="Nhập mật khẩu cũ"
                className="bg-input border-border pr-12 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                {...register("oldPassword")}
                aria-invalid={!!errors.oldPassword}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showOld ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showOld ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-brand-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-card-foreground">
              Mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Tạo mật khẩu mới (tối thiểu 8 ký tự)"
                className="bg-input border-border pr-12 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Độ mạnh mật khẩu:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength.level === 100
                        ? "text-brand-success"
                        : passwordStrength.level === 66
                          ? "text-brand-warning"
                          : "text-brand-error"
                    }`}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.level}%` }}
                  />
                </div>
              </div>
            )}

            {errors.newPassword && (
              <p className="text-xs text-brand-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-card-foreground">
              Xác nhận mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className="bg-input border-border pr-12 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-brand-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password requirements */}
          <div className="rounded-lg bg-muted/50 border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Mật khẩu cần có:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${newPassword?.length >= 8 ? "bg-brand-success" : "bg-border"}`}
                />
                Tối thiểu 8 ký tự
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword || "") ? "bg-brand-success" : "bg-border"}`}
                />
                Ít nhất 1 chữ hoa
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${/[a-z]/.test(newPassword || "") ? "bg-brand-success" : "bg-border"}`}
                />
                Ít nhất 1 chữ thường
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${/\d/.test(newPassword || "") ? "bg-brand-success" : "bg-border"}`}
                />
                Ít nhất 1 số
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-success hover:bg-brand-success/90 text-white py-6 font-medium shadow-lg shadow-brand-success/20 transition-all hover:shadow-xl hover:shadow-brand-success/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang cập nhật...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Cập nhật mật khẩu
              </span>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="px-0 flex-col items-start gap-3">
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg p-3 w-full">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-warning" />
          <p>
            Nếu bạn quên mật khẩu, hãy sử dụng chức năng{" "}
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-primary hover:underline font-medium"
            >
              Quên mật khẩu
            </button>
            .
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordForm;
