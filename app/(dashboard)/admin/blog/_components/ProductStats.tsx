// components/admin/products/ProductStats.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export function ProductStats() {

  // Loading skeleton (giữ layout giống nhau)
  if (true) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  // Khi có lỗi, vẫn giữ giao diện nhẹ, không crash
  if (false) {
    // Bạn có thể thay bằng message hiển thị lỗi nếu muốn
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Chờ duyệt", value: "—", color: "text-yellow-600" },
          { label: "Đã duyệt", value: "—", color: "text-green-600" },
          { label: "Vi phạm", value: "—", color: "text-red-600" },
          { label: "Tổng", value: "—", color: "text-blue-600" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>
    );
  }


}
