"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";

export function WithdrawalQuickStats({ total, pending }: any) {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <ArrowUpRight className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-sm text-muted-foreground">Total Withdrawn</p>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <Clock className="w-5 h-5 text-accent mb-2" />
          <p className="text-sm text-muted-foreground">Pending Clearance</p>
          <p className="text-2xl font-bold">${pending.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
