"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Package,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  MessageSquare,
  LogOut,
  Zap,
  Download,
  Filter,
  History,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SellerAnalytics() {
  const auditLogs = [
    {
      id: 1,
      action: "Cấp quyền truy cập",
      user: "Admin",
      target: "Hoàng Tuấn (Sora Acc)",
      time: "10 phút trước",
    },
    {
      id: 2,
      action: "Cập nhật sản phẩm",
      user: "Seller",
      target: "Prompt Pack 4K (Giá)",
      time: "2 giờ trước",
    },
    {
      id: 3,
      action: "Rút tiền",
      user: "Seller",
      target: "Yêu cầu 5,000,000₫",
      time: "5 giờ trước",
    },
    {
      id: 4,
      action: "Đổi mật khẩu",
      user: "System",
      target: "Seller Account",
      time: "Hôm qua",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <h2 className="text-md font-bold text-foreground">
            Báo cáo & Phân tích
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={14}
              />
              <select className="bg-muted border border-border rounded-xl py-2 pl-9 pr-8 text-xs font-bold outline-none appearance-none">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
                <option>Tháng này</option>
                <option>Quý này</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={14}
              />
            </div>
            <button className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground">
              <Download size={18} />
            </button>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
          {/* High Level Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                label: "Lượt ghé Shop",
                val: "12,450",
                trend: "+15.2%",
                color: "text-brand-success",
                icon: <MousePointerClick />,
              },
              {
                label: "Tỷ lệ chuyển đổi",
                val: "2.45%",
                trend: "+0.5%",
                color: "text-brand-success",
                icon: <TrendingUp />,
              },
              {
                label: "Giá trị đơn TB",
                val: "850k₫",
                trend: "-2.1%",
                color: "text-brand-error",
                icon: <ShoppingBag />,
              },
              {
                label: "Tỉ lệ quay lại",
                val: "12%",
                trend: "+5.0%",
                color: "text-brand-success",
                icon: <Users />,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-card border border-border p-6 rounded-[2rem] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                    {s.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}
                  >
                    {s.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {s.label}
                  </p>
                  <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                    {s.val}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Traffic Sources */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                  Nguồn lưu lượng (UTM)
                </h3>
                <Globe size={20} className="text-primary" />
              </div>
              <div className="space-y-6">
                {[
                  { source: "YouTube (Bio Link)", val: 4500, percent: "45%" },
                  { source: "Facebook Ads", val: 3200, percent: "32%" },
                  { source: "Direct Traffic", val: 1200, percent: "12%" },
                  { source: "Affiliate Referral", val: 800, percent: "8%" },
                  { source: "Others", val: 300, percent: "3%" },
                ].map((source, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground">{source.source}</span>
                      <span className="text-muted-foreground">
                        {source.val} clicks ({source.percent})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: source.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                  Phễu chuyển đổi
                </h3>
                <TrendingUp size={20} className="text-brand-success" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
                <div className="w-full max-w-[280px] bg-primary/20 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase border border-primary/20">
                  Visits: 12.4k
                </div>
                <div className="w-[85%] max-w-[240px] bg-primary/40 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase border border-primary/20">
                  Add to cart: 2.1k
                </div>
                <div className="w-[70%] max-w-[200px] bg-primary/60 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase border border-primary/20 text-white">
                  Checkout: 850
                </div>
                <div className="w-[50%] max-w-[140px] bg-primary h-12 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase shadow-lg shadow-primary/20 text-white">
                  Purchase: 310
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={20} className="text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Nhật ký hoạt động (Audit Logs)
                </h3>
              </div>
              <button className="text-xs font-bold text-primary underline">
                Xem toàn bộ lịch sử
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Hành động
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Thực hiện bởi
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Đối tượng tác động
                    </th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Thời gian
                    </th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-foreground">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${log.user === "Admin" ? "bg-brand-error" : "bg-primary"}`}
                          />
                          {log.user}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-mono">
                        {log.target}
                      </td>
                      <td className="px-8 py-5 text-xs text-muted-foreground">
                        {log.time}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-muted rounded-lg">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
