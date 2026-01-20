"use client";

import { SettingCard } from "./SettingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ShareSection() {
  const storeUrl = "https://yourstore.platform.com";

  const copyLink = async () => {
    await navigator.clipboard.writeText(storeUrl);
    toast.success("Đã sao chép link cửa hàng");
  };

  return (
    <SettingCard
      title="Chia sẻ cửa hàng"
      description="Gửi link cửa hàng cho khách hàng hoặc đối tác."
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Input readOnly value={storeUrl} className="font-mono" />

        <Button variant="secondary" onClick={copyLink} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy
        </Button>

        <Button variant="outline" className="gap-2" asChild>
          <a href={storeUrl} target="_blank">
            <ExternalLink className="w-4 h-4" />
            Mở
          </a>
        </Button>
      </div>
    </SettingCard>
  );
}
