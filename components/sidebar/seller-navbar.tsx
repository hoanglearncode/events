"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  BarChart3,
  MessageSquare,
  Bell,
  ArrowDownToLine,
  Settings,
  Store,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Image from "next/image";

const mainNavItems = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    label: "Sản phẩm",
    href: "/seller/products",
    icon: Package,
  },
  {
    label: "Đơn hàng",
    href: "/seller/order",
    icon: ShoppingBag,
  },
  // {
  //   label: "Doanh thu",
  //   href: "/seller/revenue",
  //   icon: BarChart3,
  // },
];

const supportNavItems = [
  {
    label: "Thông báo",
    href: "/seller/notifications",
    icon: Bell,
  },
  {
    label: "Rút tiền",
    href: "/seller/withdrawals",
    icon: ArrowDownToLine,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:hidden"
            >
              <Link href="/seller">
                <div className="relative">
                  <Image
                    src="/manix-log.png"
                    alt="ManixAI"
                    width={40}
                    height={40}
                    className="transition-transform group-hover:scale-110 duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 rounded-full" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold">Kênh Người Bán</span>
                  <span className="text-xs text-muted-foreground">
                    Quản lý cửa hàng
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>

            <SidebarTrigger className="ml-auto">
              <PanelLeft className="size-4" />
            </SidebarTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Hỗ trợ & Cài đặt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Status */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1.5 group-data-[collapsible=icon]:hidden">
              <div className="rounded-lg bg-muted p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold">Đang hoạt động</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed group-data-[collapsible=icon]:hidden">
                  Cửa hàng của bạn đang mở và sẵn sàng nhận đơn
                </p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
