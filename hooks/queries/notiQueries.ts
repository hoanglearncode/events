import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "@/services/noti.service";

export type NotificationResponse = {
  id: number;
  title: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type NotificationFormValues = {
  title: string;
  message: string;
};

export const useMyNotifications = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["notifications", "my", page, size],
    queryFn: () => NotificationService.my({ page, size }),
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => NotificationService.read(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "my"],
      });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.readAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "my"],
      });
    },
  });
};

export const useBroadcastNotification = () => {
  return useMutation({
    mutationFn: (payload: NotificationFormValues) =>
      NotificationService.broadcast(payload),
  });
};
