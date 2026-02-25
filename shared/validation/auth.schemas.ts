import { z } from "zod";
import { getValidationMessage } from "../helpers/validation";

// Password validation with translator text
export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 ký tự in hoa")
  .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 ký tự thường")
  .regex(/\d/, "Mật khẩu phải chứa ít nhất 1 ký tự số")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
  );
// Email validation
export const emailSchema = z
  .string()
  .email("Mail không hợp lệ")
  .min(1, "Mail là bắt buộc");

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  remember: z.boolean().optional(),
});

// Register schema with proper password validation
export const registerSchema = z
  .object({
    fullName: z.string().optional().nullable(),
    email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 ký tự in hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 ký tự thường")
      .regex(/\d/, "Mật khẩu phải chứa ít nhất 1 ký tự số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),

    newPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Verify email schema
export const verifyEmailSchema = z.object({
  email: emailSchema,
  otpCode: z.string().min(1, "Mã xác nhận là bắt buộc"),
});

// Resend verification email schema
export const resendVerificationEmailSchema = z.object({
  email: emailSchema,
});

// Change password schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 ký tự in hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 ký tự thường")
      .regex(/\d/, "Mật khẩu phải chứa ít nhất 1 ký tự số")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
      ),
    password_confirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

// ... existing code ...

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailFormData = z.infer<
  typeof resendVerificationEmailSchema
>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const passwordRequirements = [
  {
    label: "Mật khẩu phải có ít nhất 8 ký tự",
    test: (password: string) => password.length >= 8,
    params: { min: 8 },
  },
  {
    label: "Mật khẩu phải chứa ít nhất 1 ký tự in hoa",
    test: (password: string) => /[A-Z]/.test(password),
    params: { count: 1 },
  },
  {
    label: "Mật khẩu phải chứa ít nhất 1 ký tự thường",
    test: (password: string) => /[a-z]/.test(password),
    params: { count: 1 },
  },
  {
    label: "Mật khẩu phải chứa ít nhất 1 ký tự số",
    test: (password: string) => /\d/.test(password),
    params: { count: 1 },
  },
  {
    label: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    params: { count: 1 },
  },
];

export const PASSWORD_VALIDATION_PARAMS: Record<string, any> = {
  "validation.password.min": { min: 8 },
  "validation.password.uppercase": { count: 1 },
  "validation.password.lowercase": { count: 1 },
  "validation.password.number": { count: 1 },
  "validation.password.special": { count: 1 },
};

export const getPasswordValidationMessage = (
  t: any,
  message: string | undefined
): string => {
  return getValidationMessage(t, PASSWORD_VALIDATION_PARAMS, message);
};
