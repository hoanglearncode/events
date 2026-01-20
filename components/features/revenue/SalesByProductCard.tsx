"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  analyticsPoints: { date: string; revenue: number }[];
};

export default function SalesByProductCard({ analyticsPoints }: Props) {
  const formatUsd = (value: number | string) => {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="lg:col-span-2 border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Sales by Product</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-70 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsPoints}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value: any) => formatUsd(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
