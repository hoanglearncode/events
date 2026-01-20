"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useWithdrawalsHistory,
  useWithdrawalsList,
} from "@/hooks/queries/useWithdrawals";

export function WithdrawalHistoryTable() {
  const { data, isLoading } = useWithdrawalsHistory();

  console.log(data);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

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
              {data?.result?.map((w: any) => (
                <tr key={w.id} className="hover:bg-muted/20">
                  <td className="p-4 text-sm text-muted-foreground">
                    {w.createdAt ? new Date(w.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-4 text-sm font-semibold">{w.amount}</td>
                  <td className="p-4 text-sm">{w.currency || "-"}</td>
                  <td className="p-4 text-sm">{w.id}</td>
                  <td className="p-4 text-sm capitalize">
                    {w.provider || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {(w.status === "SUCCESS" || w.status === "completed") && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {(w.status === "PROCESSING" ||
                        w.status === "processing") && (
                        <Clock className="w-4 h-4 text-accent" />
                      )}
                      {(w.status === "FAILED" || w.status === "failed") && (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}

                      <Badge
                        variant={
                          w.status === "SUCCESS" || w.status === "completed"
                            ? "secondary"
                            : w.status === "FAILED" || w.status === "failed"
                              ? "destructive"
                              : "outline"
                        }
                        className="text-[10px]"
                      >
                        {w.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono text-muted-foreground">
                    {w.transactionCode || "-"}
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
