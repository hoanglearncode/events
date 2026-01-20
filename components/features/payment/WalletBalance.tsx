// components/payment/

import { Wallet as WalletIcon, Loader2 } from "lucide-react";
import type { Wallet } from "@/types/payment";
import { cn } from "@/lib/utils";

interface WalletBalanceProps {
  wallets: Wallet[];
  isLoading: boolean;
}

export function WalletBalance({ wallets, isLoading }: WalletBalanceProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-muted/50 p-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Đang tải số dư...
        </span>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
        <WalletIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Chưa có ví</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Số dư ví hiện tại
      </h3>
      <div className="grid gap-2 md:grid-cols-2">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "rounded-lg p-2",
                  wallet.currency === "VND"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-green-100 dark:bg-green-900/30"
                )}
              >
                <WalletIcon
                  className={cn(
                    "h-4 w-4",
                    wallet.currency === "VND"
                      ? "text-amber-600"
                      : "text-green-600"
                  )}
                />
              </div>
              <span className="font-medium">{wallet.currency}</span>
            </div>
            <span className="text-lg font-bold">
              {new Intl.NumberFormat("vi-VN").format(wallet.balance)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {wallet.currency === "VND" ? "₫" : "$"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
