// app/admin/layout.tsx
"use client";

import { Search, Bell } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebar } from "@/components/sidebar/admin-navbar";
import { DashboardHeader } from "@/components/features/common/DashboardHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="hidden bg-background md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-background text-foreground overflow-hidden relative">
          <DashboardHeader />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
