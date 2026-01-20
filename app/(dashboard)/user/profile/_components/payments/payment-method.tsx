import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentMethod {
  type: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  isEditing: boolean;
  paymentData: PaymentMethod;
  onClose: () => void;
  onSave: () => void;
  onPaymentDataChange: (data: PaymentMethod) => void;
}

const BANKS = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MBBank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
];

export default function PaymentMethodModal({
  isOpen,
  isEditing,
  paymentData,
  onClose,
  onSave,
  onPaymentDataChange,
}: PaymentMethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing
              ? "Chỉnh sửa phương thức"
              : "Thêm phương thức thanh toán"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing
              ? "Cập nhật thông tin tài khoản"
              : "Thêm tài khoản ngân hàng hoặc PayPal"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2">
          {/* Payment Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm">
              Loại phương thức <span className="text-brand-error">*</span>
            </Label>
            <Select
              value={paymentData.type}
              onValueChange={(val) =>
                onPaymentDataChange({ ...paymentData, type: val })
              }
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Ngân hàng (VND)</SelectItem>
                <SelectItem value="paypal">PayPal (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Selection (for bank type) */}
          {paymentData.type === "bank" && (
            <div className="space-y-2">
              <Label className="text-sm">
                Ngân hàng <span className="text-brand-error">*</span>
              </Label>
              <Select
                value={paymentData.bankName}
                onValueChange={(val) =>
                  onPaymentDataChange({ ...paymentData, bankName: val })
                }
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* PayPal Email or Account Number */}
          <div className="space-y-2">
            <Label className="text-sm">
              {paymentData.type === "paypal" ? "PayPal Email" : "Số tài khoản"}{" "}
              <span className="text-brand-error">*</span>
            </Label>
            <Input
              value={paymentData.accountNumber}
              onChange={(e) =>
                onPaymentDataChange({
                  ...paymentData,
                  accountNumber: e.target.value,
                })
              }
              placeholder={
                paymentData.type === "paypal"
                  ? "example@paypal.com"
                  : "Nhập số tài khoản"
              }
              className={`h-10 text-sm ${
                paymentData.type === "bank" ? "font-mono" : ""
              }`}
              type={paymentData.type === "paypal" ? "email" : "text"}
            />
          </div>

          {/* Account Name (only for bank) */}
          {paymentData.type === "bank" && (
            <div className="space-y-2">
              <Label className="text-sm">
                Chủ tài khoản <span className="text-brand-error">*</span>
              </Label>
              <Input
                value={paymentData.accountName}
                onChange={(e) =>
                  onPaymentDataChange({
                    ...paymentData,
                    accountName: e.target.value.toUpperCase(),
                  })
                }
                placeholder="NGUYEN VAN A"
                className="uppercase h-10 text-sm"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
            size="sm"
          >
            Hủy
          </Button>
          <Button
            onClick={onSave}
            className="bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto order-1 sm:order-2"
            size="sm"
          >
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
