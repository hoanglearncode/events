// hooks/useSellerManagement.ts
import { useState, useCallback, useMemo } from "react";
import {
  useApproveSeller,
  useRejectSeller,
  useBanSeller,
  useUnbanSeller,
  useDeleteSeller,
} from "@/hooks/queries/sellerQueries";
import { SellerRequest, SellerStatus } from "@/types/seller";

interface UseSellerManagementProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSellerManagement(props?: UseSellerManagementProps) {
  const [selectedSeller, setSelectedSeller] = useState<SellerRequest | null>(
    null
  );
  const [actionDialog, setActionDialog] = useState<{
    type: "approve" | "reject" | "ban" | "unban" | "delete" | null;
    open: boolean;
  }>({ type: null, open: false });

  // Mutations
  const approveMutation = useApproveSeller();
  const rejectMutation = useRejectSeller();
  const banMutation = useBanSeller();
  const unbanMutation = useUnbanSeller();
  const deleteMutation = useDeleteSeller();

  const isLoading = useMemo(
    () =>
      approveMutation.isPending ||
      rejectMutation.isPending ||
      banMutation.isPending ||
      unbanMutation.isPending ||
      deleteMutation.isPending,
    [
      approveMutation.isPending,
      rejectMutation.isPending,
      banMutation.isPending,
      unbanMutation.isPending,
      deleteMutation.isPending,
    ]
  );

  // Action handlers
  const openDialog = useCallback(
    (
      type: "approve" | "reject" | "ban" | "unban" | "delete",
      seller: SellerRequest
    ) => {
      setSelectedSeller(seller);
      setActionDialog({ type, open: true });
    },
    []
  );

  const closeDialog = useCallback(() => {
    setActionDialog({ type: null, open: false });
    setSelectedSeller(null);
  }, []);

  const handleApprove = useCallback(
    async (userId: string, note?: string) => {
      try {
        await approveMutation.mutateAsync({ userId, note });
        closeDialog();
        props?.onSuccess?.();
      } catch (error) {
        props?.onError?.(error as Error);
      }
    },
    [approveMutation, closeDialog, props]
  );

  const handleReject = useCallback(
    async (userId: string, reason: string) => {
      try {
        await rejectMutation.mutateAsync(userId);
        closeDialog();
        props?.onSuccess?.();
      } catch (error) {
        props?.onError?.(error as Error);
      }
    },
    [rejectMutation, closeDialog, props]
  );

  const handleBan = useCallback(
    async (userId: string, reason: string, duration?: number) => {
      try {
        await banMutation.mutateAsync({ userId, reason, duration });
        closeDialog();
        props?.onSuccess?.();
      } catch (error) {
        props?.onError?.(error as Error);
      }
    },
    [banMutation, closeDialog, props]
  );

  const handleUnban = useCallback(
    async (userId: string) => {
      try {
        await unbanMutation.mutateAsync(userId);
        closeDialog();
        props?.onSuccess?.();
      } catch (error) {
        props?.onError?.(error as Error);
      }
    },
    [unbanMutation, closeDialog, props]
  );

  const handleDelete = useCallback(
    async (userId: string) => {
      try {
        await deleteMutation.mutateAsync(userId);
        closeDialog();
        props?.onSuccess?.();
      } catch (error) {
        props?.onError?.(error as Error);
      }
    },
    [deleteMutation, closeDialog, props]
  );

  return {
    selectedSeller,
    actionDialog,
    isLoading,
    openDialog,
    closeDialog,
    handleApprove,
    handleReject,
    handleBan,
    handleUnban,
    handleDelete,
  };
}

// Hook cho filters và pagination
export function useSellerFilters() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
    }),
    [page, limit, search]
  );

  const resetFilters = useCallback(() => {
    setPage(0);
    setStatus("ALL");
    setSearch("");
  }, []);

  return {
    page,
    setPage,
    limit,
    setLimit,
    status,
    setStatus,
    search,
    setSearch,
    params,
    resetFilters,
  };
}
