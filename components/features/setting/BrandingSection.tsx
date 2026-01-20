"use client";

import { SettingCard } from "./SettingCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export function BrandingSection({ data }: { data: any }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <SettingCard
      title="Cấu hình cửa hàng"
      description="Thiết lập nhận diện thương hiệu và trạng thái hoạt động."
    >
      {/* Store info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tên cửa hàng</Label>
          <Input defaultValue={data?.name} />
        </div>

        <div className="space-y-2">
          <Label>Slug cửa hàng</Label>
          <Input defaultValue={data?.slug} className="font-mono" />
        </div>
      </div>

      {/* Branding assets */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/40 transition">
          <ImageIcon />
          <span className="text-[10px] font-bold mt-2">LOGO</span>
        </div>

        <div className="md:col-span-3 aspect-[4/1] rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
          <ImageIcon />
        </div>
      </div>

      {/* Activation */}
      <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div>
          <p className="font-semibold">Kích hoạt cửa hàng</p>
          <p className="text-xs text-muted-foreground">
            Tắt để bảo trì tạm thời
          </p>
        </div>

        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
    </SettingCard>
  );
}
