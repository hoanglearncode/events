import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { toast } from "sonner";

interface SetFeePayload {
  id: string;
  value: number | null;
}

export function useConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }: SetFeePayload) =>
      CategoryService.setFee(id, value),

    onSuccess: () => {
      toast.success("Đã cập nhật phí danh mục");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật phí thất bại");
    },
  });
}
