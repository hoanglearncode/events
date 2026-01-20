import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBanks, useSavePaymentInfo } from "@/hooks/usePayment";
import type { PaymentProvider } from "@/types/payment";

interface PaymentInfoFormProps {
  provider: PaymentProvider;
  userId: string;
}

export function PaymentInfoForm({ provider, userId }: PaymentInfoFormProps) {
  const { data: banks } = useBanks();
  const saveInfo = useSavePaymentInfo();

  const [formData, setFormData] = useState({
    bankCode: "",
    receiverAccount: "",
    receiverName: "",
  });

  if (provider === "PAYPAL") {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Thanh toán sẽ được chuyển hướng đến PayPal. Bạn cần có tài khoản
          PayPal để hoàn tất giao dịch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <Label htmlFor="bankCode">Ngân hàng</Label>
        <Select
          value={formData.bankCode}
          onValueChange={(value) =>
            setFormData({ ...formData, bankCode: value })
          }
        >
          <SelectTrigger id="bankCode">
            <SelectValue placeholder="Chọn ngân hàng" />
          </SelectTrigger>
          <SelectContent>
            {banks?.map((bank: any) => (
              <SelectItem key={bank.code} value={bank.code}>
                {bank.code} - {bank.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="receiverAccount">Số tài khoản</Label>
        <Input
          id="receiverAccount"
          value={formData.receiverAccount}
          onChange={(e) =>
            setFormData({ ...formData, receiverAccount: e.target.value })
          }
          placeholder="Nhập số tài khoản"
        />
      </div>

      <div>
        <Label htmlFor="receiverName">Tên chủ tài khoản</Label>
        <Input
          id="receiverName"
          value={formData.receiverName}
          onChange={(e) =>
            setFormData({ ...formData, receiverName: e.target.value })
          }
          placeholder="Nhập tên chủ tài khoản"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Thông tin này sẽ được sử dụng cho các giao dịch rút tiền sau này.
      </p>
    </div>
  );
}
