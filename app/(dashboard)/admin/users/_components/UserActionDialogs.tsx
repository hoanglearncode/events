// pages/admin/users/_components/UserActionDialogs.tsx
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface DialogProps {
  open: boolean;
  user: User | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Activate Dialog
export function ActivateDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kích hoạt tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn kích hoạt tài khoản của{" "}
            <strong>{user?.fullName}</strong> ({user?.email})?
            <br />
            <br />
            Người dùng sẽ có thể đăng nhập và sử dụng hệ thống sau khi được kích
            hoạt.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Kích hoạt"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Deactivate Dialog
export function DeactivateDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vô hiệu hóa tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn vô hiệu hóa tài khoản của{" "}
            <strong>{user?.fullName}</strong> ({user?.email})?
            <br />
            <br />
            Người dùng sẽ không thể đăng nhập cho đến khi tài khoản được kích
            hoạt lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Vô hiệu hóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Ban Dialog
export function BanDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cấm tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn cấm tài khoản của{" "}
            <strong>{user?.fullName}</strong> ({user?.email})?
            <br />
            <br />
            Đây là hành động nghiêm trọng. Người dùng sẽ bị chặn hoàn toàn khỏi
            hệ thống và không thể đăng nhập.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Đang xử lý..." : "Cấm tài khoản"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Unban Dialog
export function UnbanDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mở khóa tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn mở khóa tài khoản của{" "}
            <strong>{user?.fullName}</strong> ({user?.email})?
            <br />
            <br />
            Người dùng sẽ có thể đăng nhập lại sau khi được mở khóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Mở khóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Delete Dialog
export function DeleteDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tài khoản</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của{" "}
            <strong>{user?.fullName}</strong> ({user?.email})?
            <br />
            <br />
            <span className="text-destructive font-semibold">
              Hành động này không thể hoàn tác!
            </span>{" "}
            Tất cả dữ liệu liên quan đến người dùng sẽ bị xóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Đang xóa..." : "Xóa vĩnh viễn"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Reset Password Dialog
interface ResetPasswordDialogProps extends DialogProps {
  newPassword?: string;
}

export function ResetPasswordDialog({
  open,
  user,
  isLoading,
  onConfirm,
  onCancel,
  newPassword,
}: ResetPasswordDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đặt lại mật khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            {newPassword ? (
              <div className="space-y-4 mt-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Mật khẩu mới đã được tạo thành công cho{" "}
                    <strong>{user?.fullName}</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mật khẩu mới</label>
                  <div className="flex gap-2">
                    <Input value={newPassword} readOnly />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(newPassword)}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng lưu lại mật khẩu này và gửi cho người dùng
                  </p>
                </div>
              </div>
            ) : (
              <>
                Bạn có chắc chắn muốn đặt lại mật khẩu cho{" "}
                <strong>{user?.fullName}</strong> ({user?.email})?
                <br />
                <br />
                Hệ thống sẽ tạo một mật khẩu tạm thời mới. Người dùng cần thay
                đổi mật khẩu sau lần đăng nhập đầu tiên.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {newPassword ? "Đóng" : "Hủy"}
          </AlertDialogCancel>
          {!newPassword && (
            <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
