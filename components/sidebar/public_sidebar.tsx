"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bell,
  PanelLeft,
  Users,
  UserCircle,
  PlusCircle,
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
import { Separator } from "@/components/ui/separator";
type NavItem = {
  href: string;
  label: string;
  icon: any;
};

const mainNavItems: NavItem[] = [
  { href: "/", label: "Bài viết", icon: LayoutDashboard },
  { href: "/post", label: "Dự án", icon: Package },
  { href: "/hiring", label: "Đang tuyển", icon: Users },
];

const supportNavItems: NavItem[] = [
  { href: "/admin/notifications", label: "Thông báo", icon: Bell },
  { href: "/admin/users", label: "Tài khoản", icon: UserCircle },
  { href: "/admin/sellers", label: "Đăng bài", icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sidebar collapsible="icon" className="h-screen">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:hidden"
            >
              <Link href="/admin" className="flex items-center gap-3 px-2">
                <Image
                  src="/manix-log.png"
                  alt="ManixAI"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-semibold">Community Admin</span>
                  <span className="text-xs text-muted-foreground">
                    Quản lý nền tảng
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nền tảng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
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

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger>
              <SidebarMenuButton tooltip="Thu gọn menu">
                <PanelLeft className="size-5" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Thu gọn
                </span>
              </SidebarMenuButton>
            </SidebarTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
