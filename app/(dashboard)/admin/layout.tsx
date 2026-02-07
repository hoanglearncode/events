// app/admin/layout.tsx
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebar/admin-navbar";
import { DashboardHeader } from "@/components/features/common/DashboardHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground">
        <aside className="hidden md:flex md:w-64 border-r border-border bg-background">
          <AdminSidebar />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <DashboardHeader />
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(156,98,15,0.05),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(98,74,43,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(98,74,43,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        
            <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 py-6">
              {children}
            </div>
            <footer className="border-t border-border px-4 py-4 text-sm text-muted-foreground">
              <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-center justify-between gap-3">
                <span>© 2024 TopDev Platform · v2.4.1</span>
                <div className="flex items-center gap-4">
                  <a className="hover:text-brand-primary" href="#">
                    Documentation
                  </a>
                  <a className="hover:text-brand-primary" href="#">
                    API Reference
                  </a>
                  <a className="hover:text-brand-primary" href="#">
                    Support
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
