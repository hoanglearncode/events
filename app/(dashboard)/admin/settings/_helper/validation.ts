import { z } from "zod";

const settingGeneral  = z.object({
    systemName: z.string().min(0, "Tên nền tảng không được rỗng").max(100, "Tên nền tảng không được vượt quá 100 kí tự"),
    systemSupportEmail: z.string().email("Email phải đúng định dạng"),
    systemMetaDescription: z.string()
});

const systemBlackList = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Key không được rỗng")
    .regex(
      /^[a-zA-Z0-9]+([._:-][a-zA-Z0-9]+)+$/,
      "Key phải có dấu ngăn cách (., _, :, -) và không được kết thúc bằng dấu"
    )
    .optional(),
});

export default {
    settingGeneral,
};