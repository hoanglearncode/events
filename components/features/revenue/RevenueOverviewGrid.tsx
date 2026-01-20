"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
} from "lucide-react";

type Props = {
  overview: {
    totalRevenue: number;
    totalSales: number;
    avgOrderValue: number;
    newCustomers: number;
  };
};

export default function RevenueOverviewGrid({ overview }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center text-xs font-medium text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">
            ${overview.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center text-xs font-medium text-blue-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
          <p className="text-2xl font-bold">{overview.totalSales}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold">
            ${overview.avgOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-center text-xs font-medium text-accent">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">New Customers</p>
          <p className="text-2xl font-bold">{overview.newCustomers}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
