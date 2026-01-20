"use client";

import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  Bell,
  MoreVertical,
  Send,
  Plus,
  Phone,
  Video,
  Info,
  User,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  BarChart3,
  LogOut,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Archive,
  Bookmark,
} from "lucide-react";

export default function SellerMessaging() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedThread, setSelectedThread] = useState<any>(null);

  const sidebarLinks = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      href: "#seller",
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: <Package size={18} />,
      href: "#seller/products",
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: <ShoppingBag size={18} />,
      href: "#seller/orders",
    },
    {
      id: "finances",
      label: "Tài chính",
      icon: <Wallet size={18} />,
      href: "#seller/finances",
    },
    {
      id: "analytics",
      label: "Báo cáo",
      icon: <BarChart3 size={18} />,
      href: "#seller/analytics",
    },
    {
      id: "messages",
      label: "Tin nhắn",
      icon: <MessageSquare size={18} />,
      href: "#seller/messaging",
    },
  ];

  const threads = [
    {
      id: 1,
      user: "Hoàng Tuấn",
      lastMsg: "Hỗ trợ mình kích hoạt tài khoản với...",
      time: "10:30",
      unread: 2,
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      user: "Minh Anh",
      lastMsg: "Ok mình đã nhận được quyền, cảm ơn shop",
      time: "09:45",
      unread: 0,
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      user: "Ngọc Lan",
      lastMsg: "Mã code này không áp dụng được?",
      time: "Hôm qua",
      unread: 0,
      avatar: "https://i.pravatar.cc/150?u=3",
    },
  ];

  const notifications = [
    {
      id: 101,
      title: "Đơn hàng mới #ORD-9921",
      desc: "Sora Account Premium vừa được bán.",
      time: "5 phút trước",
      type: "sale",
    },
    {
      id: 102,
      title: "Yêu cầu rút tiền thành công",
      desc: "5,000,000₫ đã được chuyển vào tài khoản.",
      time: "1 giờ trước",
      type: "system",
    },
    {
      id: 103,
      title: "Sắp hết hàng",
      desc: "Sản phẩm 'Prompt Pack 4K' chỉ còn 2 slot.",
      time: "3 giờ trước",
      type: "alert",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* MAIN MESSAGING INTERFACE */}
      <main className="flex-1 flex overflow-hidden">
        {/* List Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-card/30 backdrop-blur-sm">
          <div className="p-6 border-b border-border space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Inbox</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${activeTab === "inbox" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                Tin nhắn
              </button>
              <button
                onClick={() => setActiveTab("notif")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${activeTab === "notif" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                Thông báo
              </button>
            </div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={14}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-muted border border-border rounded-lg py-2 pl-9 pr-4 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "inbox" ? (
              <div className="divide-y divide-border">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full flex gap-4 p-5 hover:bg-muted/30 transition-all text-left group ${selectedThread?.id === thread.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                  >
                    <div className="w-11 h-11 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border group-hover:scale-105 transition-transform">
                      <img src={thread.avatar} alt="u" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {thread.user}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">
                          {thread.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                        {thread.lastMsg}
                      </p>
                    </div>
                    {thread.unread > 0 && (
                      <div className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-primary/20">
                        {thread.unread}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {notifications.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-border bg-card/50 hover:bg-muted transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {note.type === "sale" ? (
                        <ShoppingBag size={14} className="text-brand-success" />
                      ) : note.type === "alert" ? (
                        <AlertCircle size={14} className="text-brand-warning" />
                      ) : (
                        <Zap size={14} className="text-primary" />
                      )}
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {note.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
                      {note.desc}
                    </p>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      {note.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 flex flex-col bg-background relative">
          {selectedThread ? (
            <>
              <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/10 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden">
                    <img src={selectedThread.avatar} alt="u" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {selectedThread.user}
                    </h3>
                    <p className="text-[10px] text-brand-success font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success" />{" "}
                      Trực tuyến
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                    <Video size={18} />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                    <Info size={18} />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/20">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full border border-border">
                    Hôm nay, 12/05/2024
                  </span>
                </div>

                <div className="flex gap-4 max-w-[70%]">
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                  <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none space-y-2">
                    <p className="text-sm leading-relaxed">
                      {selectedThread.lastMsg}
                    </p>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">
                      {selectedThread.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row-reverse gap-4 max-w-[70%] ml-auto">
                  <div className="w-8 h-8 rounded-full brand-gradient flex-shrink-0 flex items-center justify-center text-white">
                    <User size={14} />
                  </div>
                  <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-none space-y-2 shadow-lg shadow-primary/10">
                    <p className="text-sm leading-relaxed">
                      Chào {selectedThread.user}, mình đã kiểm tra và thấy đơn
                      hàng của bạn rồi. Bạn vui lòng check mail nhé!
                    </p>
                    <span className="text-[9px] opacity-70 font-bold uppercase">
                      10:45
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card/30">
                <div className="max-w-4xl mx-auto flex items-center gap-4 bg-muted border border-border rounded-2xl px-4 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                  <button className="p-2 text-muted-foreground hover:text-foreground">
                    <Plus size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent py-2 text-sm outline-none"
                  />
                  <button className="p-2 text-primary hover:scale-110 transition-transform">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-[2.5rem] bg-muted flex items-center justify-center text-muted-foreground animate-pulse">
                <MessageSquare size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">
                  Chọn một cuộc trò chuyện
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Bắt đầu hỗ trợ khách hàng hoặc xem các thông báo hệ thống mới
                  nhất.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
