"use client";

import React, { useState } from "react";
import {
  Settings, Building2, FileText, CreditCard, Shield, 
  Globe, Mail, Server, Save, Loader2, AlertTriangle,
  CheckCircle2, DollarSign, Users
} from "lucide-react";

// Giả định các component shadcn/ui đã được cài đặt
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const PlatformAdminSettings = () => {
  const [isSaving, setIsSaving] = useState(false);

  // State mô phỏng cấu hình hệ thống
  const [config, setConfig] = useState({
    siteName: "TopDev clone",
    maintenanceMode: false,
    allowRegistration: true,
    jobApprovalRequired: true,
    newsCommentAutoApprove: false,
    cvViewPrice: 50, // Số point để xem 1 CV
    currency: "VND",
    supportEmail: "admin@platform.com",
    seoTitle: "Nền tảng tuyển dụng IT hàng đầu Việt Nam",
    paymentGateway: "vnpay",
    smtpServer: "smtp.sendgrid.net"
  });

  const handleSave = () => {
    setIsSaving(true);
    // Giả lập call API lưu cấu hình
    setTimeout(() => {
      setIsSaving(false);
      alert("Đã cập nhật cấu hình hệ thống!");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl bg-slate-50/50 min-h-screen">
      <div className="flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cấu hình hệ thống</h1>
                <p className="text-muted-foreground mt-1">Quản lý toàn bộ cài đặt vận hành cho nền tảng Tin tức & Tuyển dụng.</p>
            </div>
            <div className="flex items-center gap-3">
                 <Button variant="outline" className="bg-white">Hủy bỏ</Button>
                 <Button onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
                 </Button>
            </div>
        </div>

        {/* Warning Alert nếu đang bảo trì */}
        {config.maintenanceMode && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-sm flex items-center" role="alert">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <div>
              <p className="font-bold">Chế độ bảo trì đang BẬT</p>
              <p className="text-sm">Người dùng thông thường sẽ không thể truy cập website. Chỉ Admin mới có thể đăng nhập.</p>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex lg:grid-cols-none h-auto p-1 bg-white border shadow-sm rounded-lg">
            <TabsTrigger value="general" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><Settings size={16} /> Chung</TabsTrigger>
            <TabsTrigger value="recruitment" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><Building2 size={16} /> Tuyển dụng</TabsTrigger>
            <TabsTrigger value="content" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><FileText size={16} /> Nội dung & Tin tức</TabsTrigger>
            <TabsTrigger value="finance" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><CreditCard size={16} /> Thanh toán & Point</TabsTrigger>
            <TabsTrigger value="security" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><Shield size={16} /> Bảo mật & User</TabsTrigger>
            <TabsTrigger value="integration" className="gap-2 py-2.5 data-[state=active]:bg-slate-100"><Server size={16} /> Tích hợp (API)</TabsTrigger>
          </TabsList>

          {/* ================= TAB: CHUNG ================= */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin Website</CardTitle>
                            <CardDescription>Các thông tin cơ bản hiển thị trên tiêu đề trang và metadata.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tên nền tảng</Label>
                                    <Input value={config.siteName} onChange={(e) => setConfig({...config, siteName: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email hỗ trợ (System Email)</Label>
                                    <Input value={config.supportEmail} onChange={(e) => setConfig({...config, supportEmail: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>SEO Title Mặc định</Label>
                                <Input value={config.seoTitle} onChange={(e) => setConfig({...config, seoTitle: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Mô tả (Meta Description)</Label>
                                <Textarea placeholder="Nhập mô tả ngắn gọn về nền tảng..." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="md:col-span-4 space-y-6">
                    <Card className="border-amber-200 bg-amber-50/30">
                        <CardHeader>
                            <CardTitle className="text-amber-900">Trạng thái vận hành</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Chế độ bảo trì</Label>
                                    <p className="text-xs text-muted-foreground">Đóng site để nâng cấp hệ thống.</p>
                                </div>
                                <Switch 
                                    checked={config.maintenanceMode}
                                    onCheckedChange={(c) => setConfig({...config, maintenanceMode: c})}
                                />
                            </div>
                            <Separator className="bg-amber-200" />
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Đăng ký thành viên</Label>
                                    <p className="text-xs text-muted-foreground">Cho phép người dùng mới đăng ký.</p>
                                </div>
                                <Switch 
                                    checked={config.allowRegistration}
                                    onCheckedChange={(c) => setConfig({...config, allowRegistration: c})}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>

          {/* ================= TAB: TUYỂN DỤNG ================= */}
          <TabsContent value="recruitment" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cấu hình đăng tin tuyển dụng</CardTitle>
                    <CardDescription>Kiểm soát quy trình từ lúc Employer đăng tin đến lúc hiển thị.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                     <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-semibold">Phê duyệt tin đăng</Label>
                                <Badge variant="secondary">Safety</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Nếu bật, tin đăng mới sẽ ở trạng thái "Pending" chờ Admin duyệt.
                                <br/>Nếu tắt, tin sẽ hiển thị ngay lập tức (Public).
                            </p>
                        </div>
                        <Switch 
                            checked={config.jobApprovalRequired}
                            onCheckedChange={(c) => setConfig({...config, jobApprovalRequired: c})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Thời hạn tin đăng mặc định (ngày)</Label>
                            <Select defaultValue="30">
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn số ngày" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 ngày</SelectItem>
                                    <SelectItem value="30">30 ngày</SelectItem>
                                    <SelectItem value="60">60 ngày</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Số lượng tin miễn phí / Doanh nghiệp</Label>
                            <Input type="number" placeholder="Ví dụ: 3" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cấu hình hiển thị hồ sơ (CV)</CardTitle>
                    <CardDescription>Quy định về việc xem thông tin ứng viên.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                             <Label>Làm mờ thông tin liên hệ</Label>
                             <p className="text-sm text-muted-foreground">Ẩn Email/SĐT ứng viên cho đến khi Nhà tuyển dụng dùng Point để mở khóa.</p>
                         </div>
                         <Switch defaultChecked={true} />
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          {/* ================= TAB: NỘI DUNG & TIN TỨC ================= */}
          <TabsContent value="content" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Kiểm duyệt nội dung</CardTitle>
                    <CardDescription>Cài đặt cho Blog, Bài viết chuyên ngành.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Tự động duyệt bình luận</Label>
                            <p className="text-sm text-muted-foreground">
                                Bình luận sẽ hiển thị ngay lập tức mà không cần Admin duyệt.
                            </p>
                        </div>
                        <Switch 
                            checked={config.newsCommentAutoApprove}
                            onCheckedChange={(c) => setConfig({...config, newsCommentAutoApprove: c})}
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <Label>Từ khóa cấm (Blacklist Keywords)</Label>
                        <Textarea 
                            className="min-h-[100px]" 
                            placeholder="Nhập các từ khóa cách nhau bằng dấu phẩy. Ví dụ: lừa đảo, cờ bạc..." 
                        />
                        <p className="text-xs text-muted-foreground">Các bài viết hoặc bình luận chứa từ khóa này sẽ bị chặn tự động.</p>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          {/* ================= TAB: TÀI CHÍNH & POINT ================= */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign size={18} /> Hệ thống Point</CardTitle>
                        <CardDescription>Quy đổi giá trị Point trong hệ thống.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Giá trị quy đổi (1 Point = ? VND)</Label>
                            <div className="relative">
                                <Input type="number" defaultValue="1000" />
                                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">VND</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phí xem 1 CV (Point)</Label>
                            <Input 
                                type="number" 
                                value={config.cvViewPrice}
                                onChange={(e) => setConfig({...config, cvViewPrice: parseInt(e.target.value)})}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Phí đăng tin Hot (Point/Ngày)</Label>
                            <Input type="number" defaultValue="100" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard size={18} /> Cổng thanh toán</CardTitle>
                        <CardDescription>Tích hợp các đơn vị trung gian.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cổng thanh toán chính</Label>
                            <Select 
                                value={config.paymentGateway} 
                                onValueChange={(v) => setConfig({...config, paymentGateway: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn cổng thanh toán" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vnpay">VNPay</SelectItem>
                                    <SelectItem value="momo">Momo</SelectItem>
                                    <SelectItem value="paypal">Paypal</SelectItem>
                                    <SelectItem value="stripe">Stripe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-4 bg-slate-100 rounded text-sm text-slate-600">
                            Để cấu hình chi tiết API Key/Secret Key, vui lòng truy cập trang <span className="text-blue-600 font-medium cursor-pointer hover:underline">Quản lý Merchant</span>.
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* ================= TAB: TÍCH HỢP HỆ THỐNG ================= */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Email Server (SMTP)</CardTitle>
                    <CardDescription>Cấu hình gửi email tự động (Xác thực, Thông báo ứng tuyển).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>SMTP Host</Label>
                            <Input value={config.smtpServer} placeholder="smtp.example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>SMTP Port</Label>
                            <Input placeholder="587" />
                        </div>
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input placeholder="apikey" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="••••••••••••••" />
                        </div>
                     </div>
                     <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={16} className="text-green-500" /> Đã kết nối thành công
                        </div>
                        <Button variant="outline" size="sm">Gửi mail test</Button>
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Google & Social Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Google Analytics ID (GA4)</Label>
                        <div className="flex gap-2">
                            <Input placeholder="G-XXXXXXXXXX" className="font-mono" />
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Google Client ID</Label>
                            <Input type="password" value="••••••••••••••••••••" readOnly className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Facebook App ID</Label>
                            <Input type="password" value="••••••••••••••••••••" readOnly className="bg-slate-50" />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default PlatformAdminSettings;