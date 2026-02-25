import { z } from "zod";

/* ================== GENERAL ================== */
export const settingGeneralSchema = z.object({
  systemName: z
    .string()
    .min(1, "Tên nền tảng không được rỗng")
    .max(100, "Tên nền tảng không được vượt quá 100 ký tự"),

  systemEmail: z.string().email("Email hỗ trợ không hợp lệ"),

  systemTitle: z
    .string()
    .min(1, "SEO Title không được rỗng")
    .max(150, "SEO Title không quá 150 ký tự"),

  systemDescription: z
    .string()
    .min(10, "Meta Description tối thiểu 10 ký tự")
    .max(300, "Meta Description không quá 300 ký tự"),

  maintainMode: z.boolean().default(false),
  allowRegister: z.boolean().default(true),
});

/* ================== RECRUITMENT ================== */
export const recruitmentSchema = z.object({
  isViewProfile: z.boolean().default(true),
  isApproval: z.boolean().default(false),

  freeCounter: z.number().min(0).max(1000).default(0),

  timeReset: z
    .enum(["1", "5", "10", "15", "20", "30", "60", "90"])
    .default("30"),
});

/* ================== CONTENT ================== */
export const contentSchema = z.object({
  allowComment: z.boolean().default(true),

  // thống nhất: string[]
  blackListKey: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Từ khóa không được rỗng")
        .max(50, "Từ khóa quá dài")
    )
    .default([]),
});

/* ================== AUTH ================== */
export const authSchema = z.object({
  twoFactor: z.boolean().default(false),
  emailVerification: z.boolean().default(false),

  lifeTimeOfToken: z
    .string()
    .regex(/^\d+$/, "Session timeout phải là số")
    .transform((v) => Number(v))
    .refine((v) => v >= 5, "Timeout tối thiểu 5 phút"),
});

/* ================== INTEGRATION ================== */
export const integrationSchema = z
  .object({
    email: z.object({
      host: z.string(),
      port: z.union([z.string().regex(/^\d+$/), z.literal("")]).optional(),
      username: z.string(),
      password: z.string(),
    }),

    analytics: z.object({
      ga4: z.object({
        measurementId: z
          .string()
          .regex(/^G-[A-Z0-9]+$/)
          .optional()
          .or(z.literal("")),
        verified: z.boolean().default(false),
      }),
    }),

    oauth: z.object({
      google: z.object({
        clientId: z.string().optional().or(z.literal("")),
        enabled: z.boolean().default(false),
        verified: z.boolean().default(false),
      }),
      facebook: z.object({
        clientId: z.string().optional().or(z.literal("")),
        enabled: z.boolean().default(false),
        verified: z.boolean().default(false),
      }),
    }),
  })
  .passthrough();

/* ================== ROOT ================== */
export const platformSettingSchema = z.object({
  general: settingGeneralSchema,
  recruitment: recruitmentSchema,
  content: contentSchema,
  auth: authSchema,
  integration: integrationSchema,
});
