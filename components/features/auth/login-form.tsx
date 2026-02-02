"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/queries/use-auth-queries";
import { useCallback } from "react";
import { loginSchema } from "@/shared/validation/auth.schemas";
import { useAuth } from "@/hooks/feature/use-auth";
import { toast } from "sonner";

type LoginFormValues = z.infer<typeof loginSchema>;

function FieldError({ message }: { message?: string }) {
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

function PasswordInput({ id, registerReturn, error, placeholder }: any) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="bg-input pr-10"
        aria-invalid={!!error}
        {...(registerReturn as any)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="absolute inset-y-0 right-2 flex items-center px-2"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
    mode: "onTouched",
  });


  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);
    if (!result.success && result.error) {
      toast.error(result.error);
    }
  };

  const onError = useCallback(
    (errs: any) => {
      const firstKey = Object.keys(errs || {})[0];
      if (firstKey) {
        const field = errs[firstKey]?.ref?.name || firstKey;
        if (field === "email" || field === "password") setFocus(field as any);
      }
    },
    [setFocus]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor={`email`}>Email</Label>
        <Input
          id={`email`}
          type="email"
          placeholder={"demo@gmail.com"}
          className="bg-input"
          aria-invalid={!!errors.email}
          autoComplete="email"
          {...register("email")}
        />
        <FieldError message={errors.email?.message as string | undefined} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor={`password`}>Mật khẩu</Label>
        </div>

        <PasswordInput
          id={`password`}
          placeholder={"Mật khẩu"}
          registerReturn={register("password")}
          error={errors.password?.message as string | undefined}
        />
        <FieldError message={errors.password?.message as string | undefined} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("remember")}
            className="form-checkbox"
          />
          <span className="text-sm text-muted-foreground">
            Ghi nhớ đăng nhập
          </span>
        </label>
        <Link
          href="/forgot-password"
          className="text-xs text-primary hover:underline"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <Button
        type="submit"
        className="ml-auto w-full bg-primary hover:bg-primary/90 transition-all font-semibold"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting && isLoggingIn ? (
          <div className="flex items-center gap-2 justify-center w-full">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Đang đăng nhập...
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center w-full">
            Đăng nhập <Sparkles className="w-4 h-4" />
          </div>
        )}
      </Button>
    </form>
  );
}
