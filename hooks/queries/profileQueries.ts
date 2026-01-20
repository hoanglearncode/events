import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { ProfileFormData, ProfileDetailData } from "@/types/profile";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "details"] as const,
  basic: () => [...profileKeys.all, "basic"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.basic(),
    queryFn: async () => {
      const response = await profileService.get();
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
}

export function useProfileDetails(enabled: boolean) {
  return useQuery({
    queryKey: profileKeys.details(),
    queryFn: () => profileService.getDetails(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled,
  });
}

// Hook cập nhật profile
export function useUpdateProfile(options?: {
  onSuccess?: (data: ProfileDetailData) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData | FormData) =>
      profileService.update(data as any),

    onSuccess: (response: any) => {
      const updatedProfile: ProfileDetailData =
        response?.result ?? response?.data ?? response;

      // 1) Update cache ngay (fast UI)
      try {
        queryClient.setQueryData(profileKeys.basic(), updatedProfile);
        queryClient.setQueryData(profileKeys.details(), updatedProfile);
      } catch (e) {
        // ignore if key not present
      }

      // 2) Invalidate để refetch các query liên quan (nếu cần)
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      toast.success("Cập nhật profile thành công!");
      options?.onSuccess?.(updatedProfile);
    },

    onError: (error: any) => {
      const message = error?.message ?? "Cập nhật profile thất bại";
      toast.error(message);
      // bạn có thể expose options.onError nếu muốn
    },
  });
}

// Hook đổi mật khẩu
export function useChangePassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: any) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      router.replace("/website");
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error(error.message || "Đổi mật khẩu thất bại");
    },
  });
}
