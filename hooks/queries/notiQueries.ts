import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


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
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "my"],
      });
    },
  });
};

export const useBroadcastNotification = () => {
  return useMutation({
  });
};
