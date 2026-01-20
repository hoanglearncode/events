"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  balance: {
    available: number;
    pending: number;
    totalWithdrawn: number;
  };
};

export default function PayoutStatusCard({ balance }: Props) {
  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Payout Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Available Balance
            </p>
            <p className="text-3xl font-bold text-green-500">
              ${balance.available.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Pending Clearance
            </p>
            <p className="text-2xl font-bold">${balance.pending.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Available in 3 days
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Total Withdrawn
            </p>
            <p className="text-2xl font-bold">
              ${balance.totalWithdrawn.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
