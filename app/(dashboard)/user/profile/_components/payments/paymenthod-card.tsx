import React from "react";
import { CreditCard, Wallet, Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentMethod {
  id: number;
  type: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface PaymentMethodCardProps {
  payment: PaymentMethod;
  onEdit: (payment: PaymentMethod) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function PaymentMethodCard({
  payment,
  onEdit,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        payment.isDefault
          ? "border-brand-primary shadow-lg ring-2 ring-brand-primary/20"
          : ""
      }`}
    >
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          {/* Left Section - Payment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="bg-brand-primary/10 text-brand-primary p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                {payment.type === "bank" ? (
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {payment.bankName}
                </h3>
                {payment.isDefault && (
                  <Badge className="bg-brand-primary text-white mt-1 text-xs">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Mặc định
                  </Badge>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-muted-foreground sm:min-w-[110px] font-medium sm:font-normal">
                  Số tài khoản:
                </span>
                <span className="font-mono font-medium break-all">
                  {payment.accountNumber}
                </span>
              </div>
              {payment.accountName && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-muted-foreground sm:min-w-[110px] font-medium sm:font-normal">
                    Chủ tài khoản:
                  </span>
                  <span className="font-medium break-words">
                    {payment.accountName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex gap-1 sm:gap-1 justify-end sm:justify-start flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(payment.id)}
              className="text-brand-error hover:text-brand-error hover:bg-brand-error/10 h-8 w-8 sm:h-9 sm:w-9 p-0"
              title="Xóa"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
