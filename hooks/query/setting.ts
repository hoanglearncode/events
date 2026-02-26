// src/queries/useSettingQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettingDetail,
  getVersionList,
  getSettingGeneral,
  getSettingRequirement,
  getSettingContent,
  getSettingPayment,
  getSettingSecurity,
  getSettingIntegration,
  updateSetting,
  rollbackVersion,
  deleteVersion,
} from "@/services/setting.service";
import {
  SettingVersion,
  SystemSetting,
} from "@/app/(dashboard)/admin/settings/_types/setting";
import { toast } from "sonner";
// src/queries/setting.keys.ts
export const settingKeys = {
  all: ["settings"] as const,
  detail: () => [...settingKeys.all, "detail"] as const,
  version: () => [...settingKeys.all, "version"] as const,
  general: () => [...settingKeys.all, "general"] as const,
  recruitment: () => [...settingKeys.all, "recruitment"] as const,
  content: () => [...settingKeys.all, "content"] as const,
  payment: () => [...settingKeys.all, "payment"] as const,
  security: () => [...settingKeys.all, "security"] as const,
  integration: () => [...settingKeys.all, "integration"] as const,
};

export const useSettingDetailQuery = () =>
  useQuery<SystemSetting>({
    queryKey: settingKeys.detail(),
    queryFn: getSettingDetail,
    staleTime: 5 * 60 * 1000, // 5 phút
  });

export const useSettingVersionQuery = () =>
  useQuery<SettingVersion[]>({
    queryKey: settingKeys.version(),
    queryFn: getVersionList,
    staleTime: 10 * 60 * 1000,
  });

export const useSettingGeneralQuery = () =>
  useQuery({
    queryKey: settingKeys.general(),
    queryFn: getSettingGeneral,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

export const useSettingRecruitmentQuery = () =>
  useQuery({
    queryKey: settingKeys.recruitment(),
    queryFn: getSettingRequirement,
    staleTime: 10 * 60 * 1000,
  });

export const useSettingContentQuery = () =>
  useQuery({
    queryKey: settingKeys.content(),
    queryFn: getSettingContent,
  });

export const useSettingPaymentQuery = () =>
  useQuery({
    queryKey: settingKeys.payment(),
    queryFn: getSettingPayment,
  });

export const useSettingSecurityQuery = () =>
  useQuery({
    queryKey: settingKeys.security(),
    queryFn: getSettingSecurity,
  });

export const useSettingIntegrationQuery = () =>
  useQuery({
    queryKey: settingKeys.integration(),
    queryFn: getSettingIntegration,
  });

export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
};

export const useRollbackSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rollbackVersion(id),
    onError: () => {
      toast.error("Rollback thất bại");
    },
    onSuccess: (_, rollbackId) => {
      toast.success(`Đã rollback về version`);
      queryClient.setQueryData<SettingVersion[]>(
        settingKeys.version(),
        (old) => {
          if (!old) return old;

          return old.map((v) => ({
            ...v,
            active: v.id === rollbackId,
          }));
        }
      );
      queryClient.invalidateQueries({
        queryKey: settingKeys.detail(),
      });
    },
  });
};

export const useDeleteSettingVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVersion(id),
    onError: () => {
      toast.error("Xóa version thất bại");
    },
    onSuccess: (_, rollbackId) => {
      toast.success("Xóa version thành công");
      queryClient.setQueryData<SettingVersion[]>(
        settingKeys.version(),
        (old) => {
          if (!old) return old;

          return old.map((v) => ({
            ...v,
            active: v.id === rollbackId,
          }));
        }
      );
      queryClient.invalidateQueries({
        queryKey: settingKeys.detail(),
      });
    },
  });
};
