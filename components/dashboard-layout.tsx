import type React from "react";
import Link from "next/link";
import { Navbar } from "./sidebar/navbar";
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Wallet,
  Users,
  DollarSign,
  Package,
  Bell,
  ArrowUpRight,
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userRole = "admin"; // This would come from auth context in production

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border hidden lg:block bg-card/30">
          <div className="flex flex-col h-full py-6 px-4">
            <nav className="space-y-1 flex-1">
              {userRole === "admin" ? (
                <>
                  <SidebarLink
                    href="/admin/dashboard"
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="Dashboard"
                    active
                  />
                  <SidebarLink
                    href="/admin/sellers"
                    icon={<Users className="w-4 h-4" />}
                    label="Seller Management"
                  />
                  <SidebarLink
                    href="/admin/finance"
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Finance & Fees"
                  />
                  <SidebarLink
                    href="/admin/content"
                    icon={<Package className="w-4 h-4" />}
                    label="Content Management"
                  />
                </>
              ) : userRole === "seller" ? (
                <>
                  <SidebarLink
                    href="/seller/dashboard"
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="Dashboard"
                    active
                  />
                  <SidebarLink
                    href="/seller/products"
                    icon={<Package className="w-4 h-4" />}
                    label="My Products"
                  />
                  <SidebarLink
                    href="/seller/revenue"
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Revenue"
                  />
                  <SidebarLink
                    href="/seller/withdrawals"
                    icon={<ArrowUpRight className="w-4 h-4" />}
                    label="Withdrawals"
                  />
                  <SidebarLink
                    href="/seller/notifications"
                    icon={<Bell className="w-4 h-4" />}
                    label="Notifications"
                  />
                </>
              ) : (
                <>
                  <SidebarLink
                    href="/dashboard"
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="Overview"
                    active
                  />
                  <SidebarLink
                    href="/marketplace"
                    icon={<ShoppingBag className="w-4 h-4" />}
                    label="Marketplace"
                  />
                  <SidebarLink
                    href="/my-courses"
                    icon={<BookOpen className="w-4 h-4" />}
                    label="My Courses"
                  />
                  <SidebarLink
                    href="/chatbots"
                    icon={<MessageSquare className="w-4 h-4" />}
                    label="AI Chatbots"
                  />
                  <SidebarLink
                    href="/wallet"
                    icon={<Wallet className="w-4 h-4" />}
                    label="Wallet & Billing"
                  />
                </>
              )}
            </nav>

            <div className="pt-6 border-t border-border space-y-1">
              <SidebarLink
                href="/settings"
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
              />
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
