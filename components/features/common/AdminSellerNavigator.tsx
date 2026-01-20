"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Wallet,
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: 1,
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    label: "Sản phẩm",
    href: "/products",
    icon: Package,
  },
  {
    id: 3,
    label: "Đơn hàng",
    href: "/order",
    icon: ShoppingBag,
  },
  {
    id: 4,
    label: "Tài chính",
    href: "/finances",
    icon: Wallet,
  },
  {
    id: 5,
    label: "Doanh thu",
    href: "/revenue",
    icon: BarChart3,
  },
];

export function AdminSellerNavigator() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const sellerId = params?.seller_id as string;

  if (!sellerId) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border bg-background shadow-lg">
      <div className="flex items-center gap-1 p-1">
        {NAV_ITEMS.map((item) => {
          const href = `/admin/sellers/${sellerId}/${item.href}`;
          const isActive = pathname.startsWith(href);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => router.push(href)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
