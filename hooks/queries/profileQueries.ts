'use client';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { ProfileFormData } from "@/types/profile";
import { UserProfile } from "@/types/auth";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "details"] as const,
  basic: () => [...profileKeys.all, "basic"] as const,
};

export function useProfileDetails() {
  return useQuery({
    queryKey: profileKeys.details(),
    queryFn: () => profileService.getDetails(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
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
