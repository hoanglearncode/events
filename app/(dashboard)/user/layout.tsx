"use client";

import type React from "react";
import PublicFooter from "@/components/features/common/publicFooter";
import PublicHeader from "@/components/features/common/publicHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebar/public_sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <aside className="hidden md:block flex-none">
          <AdminSidebar />
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex-none">
            <PublicHeader />
          </header>

          <main className="relative flex-1 overflow-y-auto bg-background text-foreground">
            {children}
          </main>

          <footer className="flex-none">
            <PublicFooter />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
