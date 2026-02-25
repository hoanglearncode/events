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
}
