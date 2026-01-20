import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, Clock, Shield, Activity } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

interface UserDetailDialogProps {
  open: boolean;
  user?: any;
  onClose: () => void;
}

const getStatusBadge = (status?: string) => {
  const statusConfig = {
    ACTIVE: { label: "Đã kích hoạt", variant: "default" as const },
    PENDING: { label: "Chưa kích hoạt", variant: "secondary" as const },
    BANNED: { label: "Bị cấm", variant: "destructive" as const },
  };
  return status && statusConfig[status as keyof typeof statusConfig]
    ? statusConfig[status as keyof typeof statusConfig]
    : statusConfig.PENDING;
};

const getRoleBadge = (role?: string) => {
  const roleConfig = {
    ADMIN: { label: "Quản trị viên", variant: "default" as const },
    USER: { label: "Người dùng", variant: "outline" as const },
    SELLER: { label: "Kiểm duyệt viên", variant: "secondary" as const },
  };
  return role && roleConfig[role as keyof typeof roleConfig]
    ? roleConfig[role as keyof typeof roleConfig]
    : roleConfig.USER;
};

export function UserDetailDialog({
  open,
  user,
  onClose,
}: UserDetailDialogProps) {
  // nếu không có user thì không render dialog content (nhưng Dialog vẫn điều khiển open)
  if (!user) return null;

  const statusBadge = getStatusBadge(user.status);
  const roleBadge = getRoleBadge(user.role);
  const isSeller = user.role === "SELLER";

  // xử lý avatar: có thể là url, avatarUrl, hoặc File
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(() => {
    if (typeof user.avatar === "string") return user.avatar;
    if (user.avatarUrl) return user.avatarUrl;
    return undefined;
  });

  useEffect(() => {
    let objectUrl: string | undefined;

    if (user) {
      if (typeof user.avatar === "string") {
        setAvatarSrc(user.avatar);
      } else if (user.avatar instanceof File) {
        objectUrl = URL.createObjectURL(user.avatar);
        setAvatarSrc(objectUrl);
      } else if (user.avatarUrl) {
        setAvatarSrc(user.avatarUrl);
      } else {
        setAvatarSrc(undefined);
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user]);

  const formattedCreatedAt = useMemo(() => {
    try {
      return format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", {
        locale: vi,
      });
    } catch {
      return "Không rõ";
    }
  }, [user.createdAt]);

  const formattedLastLogin = useMemo(() => {
    if (!user.lastLogin) return "Chưa đăng nhập";
    try {
      return format(new Date(user.lastLogin), "dd/MM/yyyy HH:mm", {
        locale: vi,
      });
    } catch {
      return "Không rõ";
    }
  }, [user.lastLogin]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 ring-1 ring-gray-50 shadow-lg">
              {avatarSrc ? (
                // AvatarImage expects a string src
                <AvatarImage src={avatarSrc} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold">
                  {(user.fullName && user.fullName.charAt(0).toUpperCase()) ||
                    "U"}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">{user.fullName}</h3>
              <div className="flex gap-2">
                {/* cast variant to any only if your Badge typing complains */}
                <Badge variant={statusBadge.variant as any}>
                  {statusBadge.label}
                </Badge>
                <Badge variant={roleBadge.variant as any}>
                  {roleBadge.label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Thông tin liên hệ
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">
                    {user.contactEmail || user.email || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">
                    {user.contactPhone || user.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase">
              Thông tin tài khoản
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vai trò</p>
                  <p className="font-medium">{roleBadge.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <p className="font-medium">{statusBadge.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{formattedCreatedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Lần đăng nhập gần nhất
                  </p>
                  <p className="font-medium">{formattedLastLogin}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(user.address || user.bio) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase">
                  Thông tin bổ sung
                </h4>
                {user.address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Địa chỉ
                    </p>
                    <p className="font-medium">{user.address}</p>
                  </div>
                )}
                {user.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Giới thiệu
                    </p>
                    <p className="font-medium">{user.bio}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Activity Stats */}
          {user.loginCount !== undefined && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase">
                  Thống kê hoạt động
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Số lần đăng nhập
                    </p>
                    <p className="text-2xl font-bold">{user.loginCount}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailDialog;
