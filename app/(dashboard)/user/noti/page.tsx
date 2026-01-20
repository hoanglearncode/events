"use client";

import React, { useState } from "react";
import { 
  Bell, Briefcase, MessageSquare, Star, Info, 
  CheckCheck, MoreHorizontal, Trash2, Search,
  BellOff, Filter, ArrowUpRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: 'job',
      title: "Cơ hội việc làm mới",
      description: "Vị trí 'Senior Product Designer' tại VinGroup phù hợp với hồ sơ của bạn.",
      time: "2 phút trước",
      isRead: false,
    },
    {
      id: "2",
      type: 'message',
      title: "Lời mời phỏng vấn",
      description: "Bạn nhận được một lời mời phỏng vấn trực tuyến từ bộ phận HR của tập đoàn Viettel.",
      time: "1 giờ trước",
      isRead: false,
    },
    {
      id: "3",
      type: 'system',
      title: "Hệ thống bảo trì",
      description: "Hệ thống sẽ bảo trì định kỳ vào 2:00 AM ngày mai để nâng cấp trải nghiệm người dùng.",
      time: "5 giờ trước",
      isRead: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 px-4 py-10 my-10">
      <div className="mx-5 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-primary rounded-lg">
                    <Bell className="text-primary-foreground h-5 w-5" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Thông báo</h1>
            </div>
            <p className="text-muted-foreground">Cập nhật những tin tức và cơ hội mới nhất dành cho bạn.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-brand-secondary text-white hover:bg-brand-secondary/90 border-none px-3 py-1">
                {unreadCount} thông báo mới
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="text-brand-primary hover:bg-muted">
              <CheckCheck className="mr-2 h-4 w-4" /> Đọc tất cả
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Tìm kiếm nội dung..." 
                    className="pl-10 bg-card border-border focus:ring-brand-primary h-11"
                />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 border-border">
                <Filter className="h-4 w-4 text-brand-primary" />
            </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-muted/50 p-1 mb-6 border border-border inline-flex w-full sm:w-auto">
            <TabsTrigger value="all" className="px-6 data-[state=active]:bg-card data-[state=active]:text-brand-primary data-[state=active]:shadow-sm">Tất cả</TabsTrigger>
            <TabsTrigger value="jobs" className="px-6 data-[state=active]:bg-card data-[state=active]:text-brand-primary">Tuyển dụng</TabsTrigger>
            <TabsTrigger value="system" className="px-6 data-[state=active]:bg-card data-[state=active]:text-brand-primary">Hệ thống</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 outline-none">
            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              {notifications.map((n) => (
                <Card 
                    key={n.id} 
                    className={`group transition-all duration-200 border-l-4 mb-3 cursor-pointer
                        ${n.isRead 
                            ? 'bg-card border-l-transparent opacity-80' 
                            : 'card-elevated border-l-brand-secondary bg-card'
                        } hover:shadow-md hover:translate-x-1`}
                >
                  <CardContent className="p-5 flex items-start gap-4">
                    {/* Icon mapping with Palette colors */}
                    <div className={`mt-1 p-2.5 rounded-xl transition-colors ${
                        n.type === 'job' ? 'bg-brand-primary/10 text-brand-primary' : 
                        n.type === 'message' ? 'bg-brand-success/10 text-brand-success' :
                        'bg-brand-accent/10 text-brand-accent'
                    }`}>
                        {n.type === 'job' ? <Briefcase size={20} /> : 
                         n.type === 'message' ? <MessageSquare size={20} /> : <Info size={20} />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold uppercase tracking-wide ${!n.isRead ? 'text-brand-secondary' : 'text-muted-foreground'}`}>
                          {n.type === 'job' ? 'Tuyển dụng' : n.type === 'message' ? 'Tin nhắn' : 'Hệ thống'}
                        </h4>
                        <span className="text-[11px] font-medium text-muted-foreground/70">{n.time}</span>
                      </div>
                      
                      <p className="font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                        {n.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>

                      <div className="pt-2 flex items-center gap-4">
                         <button className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
                            Xem chi tiết <ArrowUpRight size={14} />
                         </button>
                         {!n.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary animate-pulse" />
                         )}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreHorizontal size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-dark border-border">
                                <DropdownMenuItem className="focus:bg-brand-primary/10 cursor-pointer">
                                    Đánh dấu đã đọc
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-brand-primary/10 cursor-pointer">
                                    Tắt thông báo này
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem className="text-brand-error focus:bg-brand-error/10 cursor-pointer">
                                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="bg-muted/30 p-4 rounded-2xl border border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <BellOff size={16} />
                <span>Bạn muốn quản lý cách nhận thông báo qua Email?</span>
            </div>
            <Button variant="outline" className="border-brand-accent text-brand-primary hover:bg-brand-accent/10 h-9">
                Cài đặt Email
            </Button>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;