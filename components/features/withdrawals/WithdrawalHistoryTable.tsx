"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WithdrawalHistoryTable() {

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Withdrawal History</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                {[
                  "Date",
                  "Amount",
                  "Currency",
                  "ID",
                  "Provider",
                  "Status",
                  "Transaction Code",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
            
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
