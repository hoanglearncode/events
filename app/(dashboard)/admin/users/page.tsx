// pages/admin/users/index.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { UserStatsCard } from "./_components/UserStatsCard";
import { UserCredentialsModal } from "./_components/UserCredentialsModal";
import { UserFilters } from "./_components/UserFilters";
import { UsersTable } from "./_components/UsersTable";
import { UserDetailDialog } from "./_components/UserDetailDialog";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import {
  ActivateDialog,
  DeactivateDialog,
  BanDialog,
  UnbanDialog,
  DeleteDialog,
  ResetPasswordDialog,
} from "./_components/UserActionDialogs";

// Hooks
import { useUsersList, useUsersStats } from "@/hooks/queries/userQueries";
import {
  useUserManagement,
  useUserFilters,
} from "@/hooks/feature/useUserManagement";

export default function AdminUsersPage() {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleCredentialsClose = () => {
    setIsCredentialsModalOpen(false);
    setUserCredentials(null);
  };

  const handleCreateSuccess = (credentials: {
    email: string;
    password: string;
  }) => {
    setUserCredentials(credentials);
    setIsCredentialsModalOpen(true);
  };

  const filters = useUserFilters();

  // Queries
  const { data: statsData, isLoading: statsLoading } = useUsersStats();
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch,
  } = useUsersList(filters.params);

  const userManagement = useUserManagement({
    onSuccess: () => {
      refetch();
    },
  });

  const users = usersData?.result || [];
  const pagination = usersData?.pagination;

  // ===== PAGINATION FIX (CORE) =====
  const apiCurrentPage = pagination?.current_page ?? 0; // 0-based
  const totalPages = pagination?.last_page ?? 1; // total pages
  const uiCurrentPage = apiCurrentPage + 1; // 1-based (UI)
  // =================================

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={usersLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${usersLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Tạo tài khoản mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStatsCard stats={statsData} isLoading={statsLoading} />

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <UserFilters
            search={filters.search}
            status={filters.status}
            role={filters.role}
            onSearchChange={filters.setSearch}
            onStatusChange={filters.setStatus}
            onRoleChange={filters.setRole}
            onReset={filters.resetFilters}
          /> */}

          <UsersTable
            users={users}
            isLoading={usersLoading}
            onViewDetail={(user) => {
              userManagement.setSelectedUser(user);
              setShowDetailDialog(true);
            }}
            onActivate={(user) => userManagement.openDialog("unban", user)}
            onDeactivate={(user) =>
              userManagement.openDialog("deactivate", user)
            }
            onBan={(user) => userManagement.openDialog("ban", user)}
            onUnban={(user) => userManagement.openDialog("unban", user)}
            onResetPassword={(user) =>
              userManagement.openDialog("resetPassword", user)
            }
            onDelete={(user) => userManagement.openDialog("delete", user)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        filters.setPage(Math.max(0, apiCurrentPage - 1))
                      }
                      className={
                        apiCurrentPage === 0
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1; // UI (1-based)

                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - uiCurrentPage) <= 1
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => filters.setPage(pageNum - 1)}
                            isActive={uiCurrentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      pageNum === uiCurrentPage - 2 ||
                      pageNum === uiCurrentPage + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      );
                    }

                    return null;
                  })}

                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        filters.setPage(
                          Math.min(totalPages - 1, apiCurrentPage + 1)
                        )
                      }
                      className={
                        apiCurrentPage === totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />

      <UserCredentialsModal
        open={isCredentialsModalOpen}
        onClose={handleCredentialsClose}
        credentials={userCredentials}
      />

      <UserDetailDialog
        open={showDetailDialog}
        user={userManagement.selectedUser}
        onClose={() => {
          setShowDetailDialog(false);
          userManagement.closeDialog();
        }}
      />

      <ActivateDialog
        open={userManagement.actionDialog.type === "activate"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleActivate}
        onCancel={userManagement.closeDialog}
      />

      <DeactivateDialog
        open={userManagement.actionDialog.type === "deactivate"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleDeactivate}
        onCancel={userManagement.closeDialog}
      />

      <BanDialog
        open={userManagement.actionDialog.type === "ban"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleBan}
        onCancel={userManagement.closeDialog}
      />

      <UnbanDialog
        open={userManagement.actionDialog.type === "unban"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleUnban}
        onCancel={userManagement.closeDialog}
      />

      <ResetPasswordDialog
        open={userManagement.actionDialog.type === "resetPassword"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleResetPassword}
        onCancel={userManagement.closeDialog}
      />

      <DeleteDialog
        open={userManagement.actionDialog.type === "delete"}
        user={userManagement.selectedUser}
        isLoading={userManagement.isLoading}
        onConfirm={userManagement.handleDelete}
        onCancel={userManagement.closeDialog}
      />
    </div>
  );
}
