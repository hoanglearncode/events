"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/shared/validation/auth.schemas";
import { useForm } from "react-hook-form";
import {
  isValidationError,
  extractValidationErrors,
} from "@/hooks/shared/use-validation-errors";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRegister } from "@/hooks/queries/use-auth-queries";

type RegisterFormValues = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string | null }) {
  const { t } = useTranslation();
  if (!message) return null;
  const displayMessage = message.startsWith("validation.")
    ? t(message)
    : message;
  return (
    <p
      className="text-sm text-brand-error mt-1"
      role="alert"
      aria-live="polite"
    >
      {displayMessage}
    </p>
  );
}

function PasswordField({
  id,
  placeholder,
  registerReturn,
  error,
}: {
  id: string;
  placeholder?: string;
  registerReturn: any;
  error?: string | null;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className="bg-input pr-10"
        aria-invalid={!!error}
        {...registerReturn}
      />
      <button
        type="button"
        onClick={() => setVisible((s) => !s)}
        className="absolute inset-y-0 right-2 flex items-center px-2"
        aria-label={
          visible ? t("common.hidePassword") : t("common.showPassword")
        }
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function RegisterComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setFocus,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const registerMutation = useRegister();

  // Focus first error after validation
  const onError = (errs: any) => {
    const firstKey = Object.keys(errs || {})[0];
    if (firstKey) {
      if (
        ["fullName", "email", "password", "confirmPassword"].includes(firstKey)
      ) {
        setFocus(firstKey as any);
      }
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      clearErrors();
      await registerMutation.mutateAsync(data as any);
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
      );
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (isValidationError(error)) {
        const validationErrors = extractValidationErrors(error);
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof RegisterFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        });
        toast.error("Vui lòng kiểm tra lại thông tin đăng ký.");
      } else {
        const errorMessage =
          (error as Error)?.message ||
          "Đăng ký thất bại. Vui lòng thử lại sau.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-4"
      noValidate
    >
      {/* Full name */}
      <div className="space-y-2">
        <Label htmlFor={`fullName`}>Họ và tên</Label>
        <Input
          id={`fullName`}
          placeholder="Nhập họ và tên"
          className="bg-input"
          autoComplete="name"
          {...register("fullName")}
          aria-invalid={!!errors.fullName}
        />
        <FieldError message={errors.fullName?.message as string | undefined} />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor={`email`}>Email</Label>
        <Input
          id={`email`}
          type="email"
          placeholder="Nhập email"
          className="bg-input"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        <FieldError message={errors.email?.message as string | undefined} />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor={`password`}>Mật khẩu</Label>
        <PasswordField
          id={`password`}
          placeholder="Nhập mật khẩu"
          registerReturn={register("password")}
          error={errors.password?.message as string | undefined}
        />
        <FieldError message={errors.password?.message as string | undefined} />
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor={`confirmPassword`}>Xác nhận mật khẩu</Label>
        <PasswordField
          id={`confirmPassword`}
          placeholder="Nhập lại mật khẩu"
          registerReturn={register("confirmPassword")}
          error={errors.confirmPassword?.message as string | undefined}
        />
        <FieldError
          message={errors.confirmPassword?.message as string | undefined}
        />
      </div>

      {/* Agree to terms */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-primary"
            {...register("agreeToTerms")}
          />
          <span className="text-xs">
            Tôi đồng ý với Điều khoản và Chính sách
          </span>
        </label>
        <FieldError
          message={errors.agreeToTerms?.message as string | undefined}
        />
      </div>

      {/* server/root error */}
      {errors.root?.message && (
        <p className="text-sm text-brand-error" role="alert">
          {errors.root.message as string}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:opacity-90 transition-all font-semibold py-6"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2 justify-center w-full">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Đang tạo tài khoản...
          </div>
        ) : (
          <div className="flex items-center gap-2 text-md justify-center w-full">
            Đăng ký <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  );
}
