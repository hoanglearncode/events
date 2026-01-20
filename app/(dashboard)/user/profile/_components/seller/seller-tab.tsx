import React from "react";
import { Crown, Check, ChevronRight, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SellerData {
  shopName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  category: string;
}

type SellerStatus = string;

interface SellerTabProps {
  isSeller: boolean;
  sellerData: any;
  isCancelling: boolean;
  sellerStatus: SellerStatus;
  onRegisterSeller: () => void;
  onCancelSeller: () => void;
  onEditSeller: () => void;
}

const SELLER_BENEFITS = [
  { icon: "🎯", text: "Tiếp cận hàng triệu khách hàng tiềm năng" },
  { icon: "⚙️", text: "Công cụ quản lý bán hàng chuyên nghiệp" },
  { icon: "🚚", text: "Hỗ trợ vận chuyển & thanh toán" },
  { icon: "📊", text: "Dashboard phân tích chi tiết" },
  { icon: "🎁", text: "Chương trình ưu đãi cho seller" },
  { icon: "📢", text: "Hỗ trợ marketing miễn phí" },
];

export default function SellerTab({
  isSeller,
  sellerData,
  isCancelling,
  sellerStatus,
  onRegisterSeller,
  onCancelSeller,
  onEditSeller,
}: SellerTabProps) {
  /* =======================
     CHƯA PHẢI SELLER
  ======================= */
  if (!isSeller) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Card className="bg-gradient-to-br from-brand-success/10 to-brand-accent/10 border-brand-success overflow-hidden">
          <CardContent className="pt-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col md:flex-row items-start gap-4 relative z-10">
              <div className="bg-brand-success text-white p-4 rounded-full">
                <Crown className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Trở thành Seller</h2>
                <p className="text-muted-foreground mb-4">
                  Mở cửa hàng và bán hàng trên nền tảng. Tiếp cận hàng triệu
                  khách hàng tiềm năng và phát triển doanh nghiệp của bạn!
                </p>
                <Button
                  onClick={onRegisterSeller}
                  className="bg-brand-success hover:bg-brand-success/90"
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Đăng ký ngay
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lợi ích khi trở thành Seller</CardTitle>
            <CardDescription>
              Những điều bạn nhận được khi tham gia bán hàng trên nền tảng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {SELLER_BENEFITS.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">{benefit.icon}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <Check className="w-5 h-5 text-brand-success flex-shrink-0" />
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =======================
     ĐÃ LÀ SELLER
  ======================= */
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Alert className="border-brand-success bg-brand-success/10">
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {sellerStatus === "ACTIVE" && (
            <div>
              <p className="font-semibold">Tài khoản Seller đã kích hoạt</p>
              <p className="text-sm">
                Bạn có thể bắt đầu bán hàng ngay bây giờ
              </p>
            </div>
          )}

          {sellerStatus === "pending" && (
            <>
              <div>
                <p className="font-semibold">
                  Tài khoản Seller đang chờ kích hoạt
                </p>
                <p className="text-sm">
                  Admin sẽ xét duyệt trong thời gian sớm nhất
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={onCancelSeller}
                disabled={isCancelling}
              >
                {isCancelling && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Hủy đăng ký
              </Button>
            </>
          )}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Thông tin cửa hàng</CardTitle>

            {/* Nút sửa luôn hiện cho seller, chỉ ẩn khi pending */}
            {sellerStatus !== "pending" && (
              <Button variant="outline" size="sm" onClick={onEditSeller}>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
          <CardDescription>
            {sellerStatus === "ACTIVE"
              ? "Quản lý thông tin cửa hàng của bạn"
              : "Thông tin đang chờ xét duyệt"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InfoItem label="Tên cửa hàng" value={sellerData.shopName} />
            <InfoItem label="Số điện thoại" value={sellerData.shopPhone} />
            <InfoItem label="Email" value={sellerData.shopEmail} />
          </div>

          <Separator />

          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">
              Mô tả cửa hàng
            </Label>
            <p className="text-sm">
              {sellerData.description || "Chưa có mô tả"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =======================
   COMPONENT PHỤ
======================= */

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <p className="font-medium">{value || "Chưa cập nhật"}</p>
    </div>
  );
}
