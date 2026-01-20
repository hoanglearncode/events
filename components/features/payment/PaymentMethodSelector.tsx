// components/payment/PaymentMethodSelector.tsx

"use client";

import { Building2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentProvider, PaymentCurrency } from "@/types/payment";

interface PaymentMethodSelectorProps {
  selected: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  currency: PaymentCurrency;
}

export function PaymentMethodSelector({
  selected,
  onChange,
  currency,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      provider: "PAYOS" as PaymentProvider,
      name: "Chuyển khoản ngân hàng",
      description: "Thanh toán qua QR Code hoặc số tài khoản",
      icon: Building2,
      available: currency === "VND",
      badge: "VND",
    },
    {
      provider: "PAYPAL" as PaymentProvider,
      name: "PayPal",
      description: "Thanh toán quốc tế qua PayPal",
      icon: CreditCard,
      available: currency === "USD",
      badge: "USD",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.provider;
        const isAvailable = method.available;

        return (
          <button
            key={method.provider}
            onClick={() => isAvailable && onChange(method.provider)}
            disabled={!isAvailable}
            className={cn(
              "relative rounded-lg border p-4 text-left transition-all",
              isSelected
                ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary ring-offset-2"
                : "border-border hover:border-brand-primary/50",
              !isAvailable && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "rounded-lg p-2",
                  isSelected
                    ? "bg-brand-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="font-semibold">{method.name}</h4>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      method.provider === "PAYOS"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}
                  >
                    {method.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
            {isSelected && (
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
