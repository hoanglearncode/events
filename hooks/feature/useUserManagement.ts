// hooks/feature/useUserManagement.ts
import { useState } from "react";
import {
  useActivateUser,
  useDeactivateUser,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
  useResetUserPassword,
} from "@/hooks/queries/useUserMutations";
import { toast } from "sonner";

type ActionType =
  | "activate"
  | "deactivate"
  | "ban"
  | "unban"
  | "delete"
  | "resetPassword"
  | null;

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}

interface UseUserManagementOptions {
  onSuccess?: () => void;
}

export function useUserManagement({
  onSuccess,
}: UseUserManagementOptions = {}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    type: ActionType;
  }>({ type: null });
  const [newPassword, setNewPassword] = useState<string | null>(null);

  // Mutations
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();
  const deleteMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();

  const isLoading =
    activateMutation.isPending ||
    deactivateMutation.isPending ||
    banMutation.isPending ||
    unbanMutation.isPending ||
    deleteMutation.isPending ||
    resetPasswordMutation.isPending;

  const openDialog = (type: ActionType, user: User) => {
    setSelectedUser(user);
    setActionDialog({ type });
    setNewPassword(null);
  };

  const closeDialog = () => {
    setActionDialog({ type: null });
    setSelectedUser(null);
    setNewPassword(null);
  };

  const handleActivate = () => {
    if (!selectedUser) return;

    activateMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("Kích hoạt tài khoản thành công");
        closeDialog();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  const handleDeactivate = () => {
    if (!selectedUser) return;

    deactivateMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("Vô hiệu hóa tài khoản thành công");
        closeDialog();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  const handleBan = () => {
    if (!selectedUser) return;

    banMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("Cấm tài khoản thành công");
        closeDialog();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  const handleUnban = () => {
    if (!selectedUser) return;

    unbanMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("Mở khóa tài khoản thành công");
        closeDialog();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("Xóa tài khoản thành công");
        closeDialog();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    resetPasswordMutation.mutate(selectedUser.id, {
      onSuccess: (data) => {
        console.log(data);
        setNewPassword(data);
        toast.success("Đặt lại mật khẩu thành công");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      },
    });
  };

  return {
    selectedUser,
    setSelectedUser,
    actionDialog,
    newPassword,
    isLoading,
    openDialog,
    closeDialog,
    handleActivate,
    handleDeactivate,
    handleBan,
    handleUnban,
    handleDelete,
    handleResetPassword,
  };
}

// Hook for filters
export function useUserFilters() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setRole("all");
    setPage(0);
  };

  const params = {
    page,
    search: search || undefined,
    status: status !== "all" ? status : undefined,
    role: role !== "all" ? role : undefined,
  };

  return {
    page,
    search,
    status,
    role,
    setPage,
    setSearch,
    setStatus,
    setRole,
    resetFilters,
    params,
  };
}
