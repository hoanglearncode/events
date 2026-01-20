// components/admin/mobile-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  PackageSearch,
  Settings,
  UserCheck,
  TrendingUp,
  Wallet,
  LogOut,
  Bell,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Duyệt Seller",
    href: "/admin/sellers/pending",
    icon: UserCheck,
    badge: 5,
  },
  { name: "Quản lý Users", href: "/admin/users", icon: Users },
  { name: "Quản lý Sellers", href: "/admin/sellers", icon: UserCheck },
  { name: "Quản lý Sản phẩm", href: "/admin/products", icon: ShoppingBag },
  { name: "Quản lý Đơn hàng", href: "/admin/orders", icon: PackageSearch },
  { name: "Doanh thu & Lợi nhuận", href: "/admin/revenue", icon: TrendingUp },
  {
    name: "Yêu cầu Rút tiền",
    href: "/admin/withdrawals",
    icon: Wallet,
    badge: 12,
  },
  { name: "Cấu hình hệ thống", href: "/admin/settings", icon: Settings },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-base">
              MA
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">ManixAI</span>
              <span className="text-xs text-gray-500">Admin Portal</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-red-500 text-white hover:bg-red-600 text-xs px-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                HM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold text-gray-900">
                Hoàng Đức Mạnh
              </span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
            >
              <Bell className="mr-2 h-4 w-4" />
              Thông báo
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
