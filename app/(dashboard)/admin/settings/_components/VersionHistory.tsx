"use client";

import React, { useState } from "react";
import {
  History,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { SettingVersion } from "../_types/setting";

interface VersionHistoryProps {
  versions: SettingVersion[];
  onRollback: (versionId: number) => void;
  onDelete: (versionId: number) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  onRollback,
  onDelete,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    versionId: number | null;
  }>({
    open: false,
    versionId: null,
  });

  const [rollbackDialog, setRollbackDialog] = useState<{
    open: boolean;
    versionId: number | null;
  }>({
    open: false,
    versionId: null,
  });

  const handleDeleteClick = (versionId: number) => {
    const version = versions.find((v) => v.id === versionId);

    if (version?.active) {
      toast.error("Không thể xóa version đang hoạt động!");
      return;
    }

    if (versions.length <= 1) {
      toast.error("Phải giữ lại ít nhất một version!");
      return;
    }

    setDeleteDialog({ open: true, versionId });
  };

  const handleRollbackClick = (versionId: number) => {
    setRollbackDialog({ open: true, versionId });
  };

  const confirmDelete = () => {
    if (deleteDialog.versionId) {
      onDelete(deleteDialog.versionId as number);
      setDeleteDialog({ open: false, versionId: null });
    }
  };

  const confirmRollback = () => {
    if (rollbackDialog.versionId) {
      onRollback(rollbackDialog.versionId);
      setRollbackDialog({ open: false, versionId: null });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b border-border bg-gradient-to-r from-brand-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary rounded-lg">
              <History className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Lịch sử Version</CardTitle>
              <CardDescription>
                Quản lý và rollback các phiên bản cấu hình hệ thống
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            {sortedVersions.map((version, index) => (
              <div
                key={version.id}
                className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                  version.active
                    ? "border-brand-primary bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 shadow-md"
                    : "border-border hover:border-brand-primary/30 hover:shadow-sm"
                }`}
              >
                {/* Active Badge */}
                {version.active && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-brand-primary text-white shadow-lg">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Đang hoạt động
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  {/* Left: Version Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          version.active
                            ? "bg-brand-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-foreground">
                            Version {version.version}
                          </h3>
                          {index === 0 && !version.active && (
                            <Badge variant="outline" className="text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>

                        {version.note && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {version.note}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{version.createdBy}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(version.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {!version.active && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRollbackClick(version.id)}
                          className="border-brand-primary/30 text-brand-primary"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Rollback
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(version.id)}
                          className="border-brand-error/30 text-brand-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}

                    {version.active && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-success/10 rounded-lg border border-brand-success/20">
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        <span className="text-xs font-medium text-brand-success">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {sortedVersions.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Chưa có lịch sử version
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lịch sử các phiên bản cấu hình sẽ hiển thị tại đây
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, versionId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa version</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa version này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-brand-error hover:bg-brand-error/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rollback Confirmation Dialog */}
      <AlertDialog
        open={rollbackDialog.open}
        onOpenChange={(open) =>
          !open && setRollbackDialog({ open: false, versionId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận rollback version</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn rollback về version này? Tất cả cấu hình
              hiện tại sẽ được thay thế bằng cấu hình của version này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRollback}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Rollback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
