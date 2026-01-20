"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

export function WithdrawalRequestCard({
  amount,
  setAmount,
  method,
  setMethod,
  balance,
  onSubmit,
}: any) {
  return (
    <Card className="lg:col-span-2 border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Request New Withdrawal</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-500">
            ${balance.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Withdrawal Amount (USD)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label>Payout Method</Label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 rounded-lg bg-background border border-border text-sm"
          >
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
            <option value="wise">Wise</option>
          </select>
        </div>

        <Button onClick={onSubmit} className="w-full">
          Submit Withdrawal Request
        </Button>
      </CardContent>
    </Card>
  );
}
