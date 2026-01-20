import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SellerSettingsService } from "@/services/seller-settings.service";
import { toast } from "sonner";

export function useSellerSettings() {
  return useQuery({
    queryKey: ["seller-settings"],
    queryFn: async () => {
      const res = await SellerSettingsService.get();
      return res.data;
    },
  });
}

export function useUpdateSellerSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: SellerSettingsService.update,
    onSuccess: () => {
      toast.success("Đã lưu thiết lập cửa hàng");
      qc.invalidateQueries({ queryKey: ["seller-settings"] });
    },
  });
}
