// src/queries/useSettingQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSettingDetail,
  getSettingGeneral,
  getSettingRequirement,
  getSettingContent,
  getSettingPayment,
  getSettingSecurity,
  getSettingIntegration,
  updateSetting,
} from '@/services/setting.service';
import { SystemSetting } from '@/app/(dashboard)/admin/settings/_types/setting';


// src/queries/setting.keys.ts
export const settingKeys = {
  all: ['settings'] as const,
  detail: () => [...settingKeys.all, 'detail'] as const,

  general: () => [...settingKeys.all, 'general'] as const,
  recruitment: () => [...settingKeys.all, 'recruitment'] as const,
  content: () => [...settingKeys.all, 'content'] as const,
  payment: () => [...settingKeys.all, 'payment'] as const,
  security: () => [...settingKeys.all, 'security'] as const,
  integration: () => [...settingKeys.all, 'integration'] as const,
};


export const useSettingDetailQuery = () =>
  useQuery<SystemSetting>({
    queryKey: settingKeys.detail(),
    queryFn: getSettingDetail,
    staleTime: 5 * 60 * 1000, // 5 phút
  });


export const useSettingGeneralQuery = () =>
  useQuery({
    queryKey: settingKeys.general(),
    queryFn: getSettingGeneral,
    staleTime: 10 * 60 * 1000,
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
