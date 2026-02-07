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
  Settings,
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
import { RecentPostsSidebar } from "@/components/sidebar/RecentPostsSidebar";

import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";

type NavItem = {
  id: number;
  href: string;
  label: string;
  icon: any;
};

export const mainNavItems: NavItem[] = [
  { id: 1, href: "/post", label: "Bài viết", icon: LayoutDashboard },
  { id: 2, href: "/project", label: "Dự án", icon: Package },
  { id: 3, href: "/hiring", label: "Đang tuyển", icon: Users },
];

export const supportNavItems: NavItem[] = [
  { id: 1, href: "/user/notification", label: "Thông báo", icon: Bell },
  { id: 2, href: "/user/data", label: "Dữ liệu", icon: UserCircle },
  { id: 3, href: "/user/post/new", label: "Đăng bài", icon: PlusCircle },
  { id: 4, href: "/user/settings", label: "Cài đặt", icon: Settings },
];

export function UserSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");
  
  const token = Cookies.get(ACCESS_TOKEN);

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
                  src="/event_logo.jpg"
                  alt="Event Logo"
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

        {token && (
          <>
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
          </>
        )}


        <Separator />
        <RecentPostsSidebar />

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
