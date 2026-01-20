"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  date: string;
  product: string;
  customer: string;
  amount: string;
  fee: string;
  net: string;
  status: string;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionsTable({ transactions }: Props) {
  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Platform Fee
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Net Earnings
                </th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground">
                    {transaction.date}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {transaction.product}
                  </td>
                  <td className="p-4 text-sm">{transaction.customer}</td>
                  <td className="p-4 text-sm font-semibold">
                    {transaction.amount}
                  </td>
                  <td className="p-4 text-sm text-destructive">
                    -{transaction.fee}
                  </td>
                  <td className="p-4 text-sm font-semibold text-green-500">
                    {transaction.net}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px]"
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
