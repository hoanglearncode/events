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

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await mutateAsync(data);

      toast.success("Đổi mật khẩu thành công", {
        description: "Bạn sẽ được chuyển về trang chủ",
        icon: <CheckCircle2 className="w-5 h-5 text-brand-success" />,
      });

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

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            {errors.newPassword && (
              <p className="text-xs text-brand-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword.message}
              </p>
            )}
          </div>

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
