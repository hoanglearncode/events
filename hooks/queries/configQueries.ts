import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SetFeePayload {
  id: string;
  value: number | null;
}

export function useConfig() {
  const queryClient = useQueryClient();

  return useMutation({

    onSuccess: () => {
      toast.success("Đã cập nhật phí danh mục");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật phí thất bại");
    },
  });
}
