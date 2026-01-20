import React from "react";
import { Crown, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCategories } from "@/hooks/queries/useCategories";

interface SellerData {
  shopName: string;
  description: string;
  shopPhone: string;
  shopEmail: string;
  address: string;
  category: string;
}

interface SellerRegistrationModalProps {
  isOpen: boolean;
  isEditMode: boolean; // 🆕 Prop mới
  isSubmitting: boolean;
  sellerData: SellerData;
  onClose: () => void;
  onConfirm: () => void;
  onSellerDataChange: (data: SellerData) => void;
}

export default function SellerRegistrationModal({
  isOpen,
  isEditMode, // 🆕
  isSubmitting,
  sellerData,
  onClose,
  onConfirm,
  onSellerDataChange,
}: SellerRegistrationModalProps) {
  const { categories } = useCategories();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-brand-success" />
            {isEditMode
              ? "Chỉnh sửa thông tin cửa hàng"
              : "Đăng ký tài khoản Seller"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin cửa hàng của bạn"
              : "Điền đầy đủ thông tin bên dưới để trở thành người bán trên nền tảng"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">
              Tên cửa hàng <span className="text-brand-error">*</span>
            </Label>
            <Input
              id="shopName"
              value={sellerData.shopName}
              onChange={(e) =>
                onSellerDataChange({ ...sellerData, shopName: e.target.value })
              }
              placeholder="VD: Shop Thời Trang ABC"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả cửa hàng <span className="text-brand-error">*</span>
            </Label>
            <Textarea
              id="description"
              value={sellerData.description}
              onChange={(e) =>
                onSellerDataChange({
                  ...sellerData,
                  description: e.target.value,
                })
              }
              placeholder="Giới thiệu về sản phẩm và dịch vụ của cửa hàng..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerPhone">
                Số điện thoại <span className="text-brand-error">*</span>
              </Label>
              <Input
                id="sellerPhone"
                type="tel"
                value={sellerData.shopPhone}
                onChange={(e) =>
                  onSellerDataChange({
                    ...sellerData,
                    shopPhone: e.target.value,
                  })
                }
                placeholder="0123456789"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục kinh doanh</Label>
              <Select
                value={sellerData.category}
                onValueChange={(val) =>
                  onSellerDataChange({ ...sellerData, category: val })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isEditMode && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Thông tin đăng ký sẽ được xét duyệt
                trong vòng 24-48 giờ. Chúng tôi sẽ liên hệ qua email hoặc số
                điện thoại bạn cung cấp.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-brand-success hover:bg-brand-success/90"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isSubmitting && <Crown className="w-4 h-4 mr-2" />}
            {isEditMode ? "Cập nhật" : "Đăng ký ngay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
