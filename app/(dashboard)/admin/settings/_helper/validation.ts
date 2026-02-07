import { z } from "zod";

/* ================== GENERAL ================== */
export const settingGeneralSchema = z.object({
  systemName: z
    .string()
    .min(1, "Tên nền tảng không được rỗng")
    .max(100, "Tên nền tảng không được vượt quá 100 ký tự"),

  systemEmail: z
    .string()
    .email("Email hỗ trợ không hợp lệ"),

  systemTitle: z
    .string()
    .min(1, "SEO Title không được rỗng")
    .max(150, "SEO Title không quá 150 ký tự"),

  systemDescription: z
    .string()
    .min(10, "Meta Description tối thiểu 10 ký tự")
    .max(300, "Meta Description không quá 300 ký tự"),

  maintainMode: z.boolean(),
  allowRegister: z.boolean(),
});

/* ================== RECRUITMENT ================== */
export const recruitmentSchema = z.object({
  isViewProfile: z.boolean(),
  isApproval: z.boolean(),

  freeCounter: z
    .number()
    .min(0, "Số tin miễn phí phải >= 0")
    .max(1000, "Số tin miễn phí không hợp lý"),

  timeReset: z.enum(["1", "5", "10", "15", "20", "30", "60", "90"]),
});

/* ================== CONTENT ================== */
export const systemBlackListKeySchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Từ khóa không được rỗng")
    .max(50, "Từ khóa quá dài")
});

export const contentSchema = z.object({
  allowComment: z.boolean(),
  blackListKey: z
    .array(z.string().min(1))
    .min(1, "Danh sách blacklist không được rỗng"),
});

/* ================== AUTH ================== */
export const authSchema = z.object({
  twoFactor: z.boolean(),
  emailVerification: z.boolean(),
  lifeTimeOfToken: z
    .string()
    .regex(/^\d+$/, "Session timeout phải là số")
    .refine(v => Number(v) >= 5, "Timeout tối thiểu 5 phút"),
});

/* ================== INTEGRATION ================== */
export const integrationSchema = z.object({
  email: z.object({
    host: z.string(),
    port: z.string().regex(/^\d+$/, "SMTP Port phải là số").optional().or(z.literal("")),
    username: z.string(),
    password: z.string(),
  }),

  analytics: z.object({
    ga4: z.object({
      measurementId: z
        .string()
        .regex(/^G-[A-Z0-9]+$/, "GA4 Measurement ID không hợp lệ")
        .optional()
        .or(z.literal("")),
      verified: z.boolean(),
    }),
  }),

  oauth: z.object({
    google: z.object({
      clientId: z.string().optional(),
      enabled: z.boolean(),
      verified: z.boolean(),
    }),
    facebook: z.object({
      clientId: z.string().optional(),
      enabled: z.boolean(),
      verified: z.boolean(),
    }),
  }),
});

/* ================== ROOT ================== */
export const platformSettingSchema = z.object({
  general: settingGeneralSchema,
  recruitment: recruitmentSchema,
  content: contentSchema,
  auth: authSchema,
  integration: integrationSchema,
});
