// schemas/complaint.schema.ts
import * as z from "zod";

export const complaintSchema = z.object({
  reason: z
    .string()
    .min(10, "Lý do khiếu nại phải ít nhất 10 ký tự")
    .max(500, "Lý do khiếu nại tối đa 500 ký tự"),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;
