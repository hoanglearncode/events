"use client";

import type React from "react";
import PublicFooter from "@/components/features/common/publicFooter";
import PublicHeader from "@/components/features/common/publicHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/sidebar/public_sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <aside className="hidden md:block flex-none">
          <UserSidebar />
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex-none">
            <PublicHeader />
          </header>

          <main className="relative flex-1 overflow-y-auto bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(156,98,15,0.05),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(98,74,43,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(98,74,43,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
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
