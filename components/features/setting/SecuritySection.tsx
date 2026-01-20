"use client";

import { SettingCard } from "./SettingCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SecuritySection() {
  return (
    <SettingCard
      title="Bảo mật"
      description="Thiết lập các lớp bảo vệ cho tài khoản cửa hàng."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Xác thực 2 lớp (2FA)</Label>
            <p className="text-xs text-muted-foreground">
              Bảo vệ tài khoản bằng mã OTP
            </p>
          </div>
          <Switch />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Cảnh báo đăng nhập</Label>
            <p className="text-xs text-muted-foreground">
              Gửi email khi có đăng nhập mới
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </SettingCard>
  );
}
