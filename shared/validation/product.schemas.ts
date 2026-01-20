import { z } from "zod";

export const priceSchema = z.object({
  amount: z.number().min(1, "Giá phải lớn hơn 0"),
  currency: z.enum(["VND", "USD"]),
});

export const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  slug: z.string(),
  categoryId: z.number().min(1, "Vui lòng chọn danh mục"),

  prices: z
    .array(priceSchema)
    .min(1, "Phải có ít nhất một mức giá")
    .max(2, "Chỉ được tối đa 2 mức giá (VND và USD)")
    .superRefine((prices, ctx) => {
      const currencies = prices.map((p) => p.currency);
      const uniqueCurrencies = new Set(currencies);

      // ❌ Trùng currency
      if (uniqueCurrencies.size !== currencies.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mỗi loại tiền (VND, USD) chỉ được tạo một mức giá",
          path: ["currency"],
        });
      }

      prices.forEach((price, index) => {
        if (price.amount <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Giá phải lớn hơn 0",
            path: [index, "amount"],
          });
        }
      });
    }),

  inventoryType: z.enum(["UNLIMITED", "LIMITED"]),
  inventoryCount: z.number().min(0, "Số lượng tồn kho phải >= 0"),
  visibility: z.enum(["VISIBLE", "HIDDEN"]),
  seoDescription: z.string().optional(),
  detailedDescription: z.string().optional(),

  thumbnailUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),

  galleryUrls: z.array(
    z.string().url("URL không hợp lệ").optional().or(z.literal(""))
  ),

  supportEmail: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),

  detailJson: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      try {
        JSON.parse(val);
        return val;
      } catch {
        throw new Error("JSON không hợp lệ");
      }
    }),

  saveDraft: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
