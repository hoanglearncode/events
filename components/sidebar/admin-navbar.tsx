"use client";

import React from "react";
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
  User,
  LogOut,
  Search,
  Container,
  Handshake,
  CircleDollarSignIcon,
  LucideNewspaper,
  AlertCircle,
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

type NavItem = {
  href: string;
  label: string;
  icon: any;
  badge?: string | number;
};

const mainNavItems: NavItem[] = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Bài viết", icon: LucideNewspaper },
  { href: "/admin/reports", label: "Báo cáo", icon: AlertCircle },
  { href: "/admin/users", label: "Người dùng", icon: User },
  { href: "/admin/analytics", label: "Phân tích", icon: BarChart3 },
  { href: "/admin/messages", label: "Tin nhắn", icon: MessageSquare },
];

const supportNavItems: NavItem[] = [
  { href: "/admin/notifications", label: "Thông báo", icon: Bell },
  { href: "/admin/content", label: "Nội dung", icon: Container },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex">
      <Sidebar collapsible="icon" className="h-screen">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-between">
              <SidebarMenuButton
                size="lg"
                asChild
                className="group-data-[collapsible=icon]:hidden"
              >
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/event_logo.jpg"
                      alt="ManixAI"
                      width={40}
                      height={40}
                      className="transition-transform group-hover:scale-110 duration-300 rounded-full"
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 rounded-full" />
                  </div>

                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold">Kênh Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Quản lý hệ thống
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
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="size-5" />
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto text-xs font-semibold bg-primary/10 px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        ) : null}
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
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="size-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
