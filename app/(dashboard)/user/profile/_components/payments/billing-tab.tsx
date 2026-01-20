import React from "react";
import { Plus, Crown, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentMethodCard from "./paymenthod-card";

interface PaymentMethod {
  id: number;
  type: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface BillingTabProps {
  isSeller: boolean;
  userRole: string;
  paymentMethods: PaymentMethod[];
  onAddPayment: () => void;
  onEditPayment: (payment: PaymentMethod) => void;
  onDeletePayment: (id: number) => void;
  onSetDefaultPayment: (id: number) => void;
  onNavigateToSeller: () => void;
}

export default function BillingTab({
  isSeller,
  userRole,
  paymentMethods,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  onSetDefaultPayment,
  onNavigateToSeller,
}: BillingTabProps) {
  if (!isSeller && userRole !== "admin") {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 animate-in fade-in duration-300 px-3 sm:px-0">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center px-4 sm:px-6">
            <div className="bg-brand-warning/10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-brand-warning" />
            </div>
            <CardTitle className="mb-2 text-lg sm:text-xl">
              Chỉ dành cho Seller
            </CardTitle>
            <CardDescription className="mb-4 text-sm">
              Bạn cần đăng ký tài khoản Seller để quản lý phương thức thanh
              toán.
            </CardDescription>
            <Button
              onClick={onNavigateToSeller}
              className="bg-brand-success hover:bg-brand-success/90 w-full sm:w-auto"
              size="sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              Đăng ký Seller ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Phương thức thanh toán
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Quản lý tài khoản nhận tiền từ đơn hàng
          </p>
        </div>
        <Button
          onClick={onAddPayment}
          className="bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương thức
        </Button>
      </div>

      {/* Payment Methods List or Empty State */}
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 sm:py-16 text-center px-4 sm:px-6">
            <div className="bg-muted w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2 text-lg sm:text-xl">
              Chưa có phương thức thanh toán
            </CardTitle>
            <CardDescription className="mb-4 max-w-md mx-auto text-sm">
              Thêm tài khoản ngân hàng hoặc ví điện tử để nhận tiền từ đơn hàng
              của bạn
            </CardDescription>
            <Button
              onClick={onAddPayment}
              className="bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {paymentMethods.map((payment) => (
            <PaymentMethodCard
              key={payment.id}
              payment={payment}
              onEdit={onEditPayment}
              onDelete={onDeletePayment}
              onSetDefault={onSetDefaultPayment}
            />
          ))}
        </div>
      )}

      {/* Security Notice */}
      <Alert className="border-brand-primary/20 bg-brand-primary/5">
        <Shield className="w-4 h-4 text-brand-primary flex-shrink-0" />
        <AlertDescription className="text-xs sm:text-sm">
          <strong>Bảo mật:</strong> Thông tin thanh toán của bạn được mã hóa và
          bảo mật. Tiền sẽ được chuyển vào tài khoản mặc định sau 3-7 ngày làm
          việc kể từ khi đơn hàng hoàn thành.
        </AlertDescription>
      </Alert>
    </div>
  );
}
