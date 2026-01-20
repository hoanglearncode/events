"use client";

import { SettingCard } from "./SettingCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function SeoSocialSection() {
  return (
    <SettingCard
      title="SEO & Social"
      description="Tối ưu hiển thị cửa hàng trên Google và mạng xã hội."
    >
      {/* SEO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">SEO</Badge>
        </div>

        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input placeholder="Tên cửa hàng | Nền tảng bán hàng" />
        </div>

        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea
            rows={3}
            placeholder="Mô tả ngắn hiển thị trên Google (140–160 ký tự)"
          />
        </div>
      </div>

      {/* Social */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Social</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Facebook Page</Label>
            <Input placeholder="https://facebook.com/yourpage" />
          </div>

          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input placeholder="https://instagram.com/yourstore" />
          </div>
        </div>
      </div>
    </SettingCard>
  );
}
