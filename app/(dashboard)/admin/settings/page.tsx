"use client";

import React, { useState } from "react";
import {
  Settings, Building2, FileText, CreditCard, Shield, 
  Globe, Mail, Server, Save, Loader2, AlertTriangle,
  CheckCircle2, DollarSign, Users, Lock, Zap, Eye,
  Clock, Bell, Activity, Database, Coffee
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("general");

  const [config, setConfig] = useState({
    siteName: "TopDev clone",
    maintenanceMode: false,
    allowRegistration: true,
    jobApprovalRequired: true,
    newsCommentAutoApprove: false,
    cvViewPrice: 50,
    currency: "VND",
    supportEmail: "admin@platform.com",
    seoTitle: "Nền tảng tuyển dụng IT hàng đầu Việt Nam",
    paymentGateway: "vnpay",
    smtpServer: "smtp.sendgrid.net",
    cvBlurEnabled: true,
    jobPostDuration: "30",
    freeJobPosts: 3,
    pointValue: 1000,
    hotJobFee: 100
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Organic warm texture overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(156,98,15,0.05),transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(98,74,43,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(98,74,43,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      
      <div className="relative">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl shadow-lg shadow-brand-primary/20">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      System Configuration
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">Platform Administration & Settings</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="border-border hover:bg-muted transition-all duration-200"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg shadow-brand-primary/20 min-w-[140px] transition-all duration-200"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu cấu hình
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">System Status</p>
                    <p className="text-lg font-bold text-foreground">
                      {config.maintenanceMode ? "Maintenance" : "Active"}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${config.maintenanceMode ? 'bg-brand-warning/10' : 'bg-brand-success/10'}`}>
                    <Activity className={`w-5 h-5 ${config.maintenanceMode ? 'text-brand-warning' : 'text-brand-success'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Registration</p>
                    <p className="text-lg font-bold text-foreground">
                      {config.allowRegistration ? "Open" : "Closed"}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${config.allowRegistration ? 'bg-brand-primary/10' : 'bg-muted'}`}>
                    <Users className={`w-5 h-5 ${config.allowRegistration ? 'text-brand-primary' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Payment Gateway</p>
                    <p className="text-lg font-bold text-foreground uppercase">{config.paymentGateway}</p>
                  </div>
                  <div className="p-2.5 bg-brand-secondary/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-brand-secondary" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">CV View Price</p>
                    <p className="text-lg font-bold text-foreground">{config.cvViewPrice} Points</p>
                  </div>
                  <div className="p-2.5 bg-brand-accent/10 rounded-lg">
                    <Eye className="w-5 h-5 text-brand-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            {config.maintenanceMode && (
              <div className="bg-gradient-to-r from-brand-warning/10 to-brand-warning/5 border-l-4 border-brand-warning p-5 rounded-lg shadow-sm mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-warning/20 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-brand-warning" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Chế độ bảo trì đang hoạt động</h4>
                    <p className="text-sm text-muted-foreground">
                      Người dùng thông thường không thể truy cập website. Chỉ tài khoản Admin mới có thể đăng nhập và thao tác.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-1.5">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-1 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="general" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Chung</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="recruitment" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Building2 size={16} />
                  <span className="hidden sm:inline">Tuyển dụng</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">Nội dung</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="finance" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <CreditCard size={16} />
                  <span className="hidden sm:inline">Thanh toán</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Shield size={16} />
                  <span className="hidden sm:inline">Bảo mật</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="integration" 
                  className="gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-primary/10 data-[state=active]:to-brand-primary/5 data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Server size={16} />
                  <span className="hidden sm:inline">Tích hợp</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ================= TAB: CHUNG ================= */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 rounded-lg">
                          <Globe className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Thông tin Website</CardTitle>
                          <CardDescription>Cấu hình metadata và SEO cho nền tảng</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Tên nền tảng</Label>
                          <Input 
                            value={config.siteName} 
                            onChange={(e) => setConfig({...config, siteName: e.target.value})}
                            className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Email hỗ trợ</Label>
                          <Input 
                            value={config.supportEmail} 
                            onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                            className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">SEO Title</Label>
                        <Input 
                          value={config.seoTitle} 
                          onChange={(e) => setConfig({...config, seoTitle: e.target.value})}
                          className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Meta Description</Label>
                        <Textarea 
                          placeholder="Mô tả ngắn gọn về nền tảng để hiển thị trên kết quả tìm kiếm..."
                          className="border-border focus:border-brand-primary focus:ring-brand-primary/20 min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">Khuyến nghị: 150-160 ký tự</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 shadow-sm">
                    <CardHeader className="border-b border-brand-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary rounded-lg">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-brand-primary">Trạng thái hệ thống</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-semibold text-foreground">Chế độ bảo trì</Label>
                            {config.maintenanceMode && (
                              <Badge variant="secondary" className="bg-brand-warning/10 text-brand-warning border-brand-warning/20">Active</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Tắt website để thực hiện nâng cấp hoặc bảo trì hệ thống
                          </p>
                        </div>
                        <Switch 
                          checked={config.maintenanceMode}
                          onCheckedChange={(c) => setConfig({...config, maintenanceMode: c})}
                          className="data-[state=checked]:bg-brand-warning"
                        />
                      </div>
                      
                      <Separator className="bg-brand-primary/10" />
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-semibold text-foreground">Đăng ký thành viên</Label>
                            {config.allowRegistration && (
                              <Badge variant="secondary" className="bg-brand-success/10 text-brand-success border-brand-success/20">Open</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Cho phép người dùng mới tạo tài khoản trên nền tảng
                          </p>
                        </div>
                        <Switch 
                          checked={config.allowRegistration}
                          onCheckedChange={(c) => setConfig({...config, allowRegistration: c})}
                          className="data-[state=checked]:bg-brand-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border shadow-sm">
                    <CardHeader className="border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Database className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-foreground text-base">Thông tin hệ thống</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-mono font-medium text-foreground">v2.4.1</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Database</span>
                          <Badge variant="outline" className="font-mono text-xs">PostgreSQL 15</Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="font-medium text-brand-success">99.8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ================= TAB: TUYỂN DỤNG ================= */}
            <TabsContent value="recruitment" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-accent/10 rounded-lg">
                      <Building2 className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Cấu hình đăng tin tuyển dụng</CardTitle>
                      <CardDescription>Quản lý quy trình từ đăng tin đến hiển thị công khai</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-start justify-between p-5 border-2 border-dashed border-border rounded-xl bg-muted/30 hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all duration-200">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="text-base font-semibold text-foreground">Phê duyệt tin đăng</Label>
                        <Badge variant="secondary" className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Safety
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Khi bật, tin đăng mới sẽ ở trạng thái <span className="font-medium text-brand-warning">"Pending"</span> chờ Admin phê duyệt.
                        <br/>
                        Khi tắt, tin sẽ được công khai <span className="font-medium text-brand-success">"Public"</span> ngay lập tức.
                      </p>
                    </div>
                    <Switch 
                      checked={config.jobApprovalRequired}
                      onCheckedChange={(c) => setConfig({...config, jobApprovalRequired: c})}
                      className="data-[state=checked]:bg-brand-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Thời hạn tin đăng mặc định
                      </Label>
                      <Select 
                        value={config.jobPostDuration}
                        onValueChange={(v) => setConfig({...config, jobPostDuration: v})}
                      >
                        <SelectTrigger className="border-border focus:border-brand-accent focus:ring-brand-accent/20">
                          <SelectValue placeholder="Chọn thời hạn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 ngày</SelectItem>
                          <SelectItem value="30">30 ngày</SelectItem>
                          <SelectItem value="60">60 ngày</SelectItem>
                          <SelectItem value="90">90 ngày</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Tin đăng sẽ tự động hết hạn sau khoảng thời gian này</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        Số tin miễn phí / Doanh nghiệp
                      </Label>
                      <Input 
                        type="number" 
                        value={config.freeJobPosts}
                        onChange={(e) => setConfig({...config, freeJobPosts: parseInt(e.target.value)})}
                        className="border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                      <p className="text-xs text-muted-foreground">Mỗi doanh nghiệp mới sẽ có số tin đăng miễn phí này</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      <Eye className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Xem hồ sơ ứng viên (CV)</CardTitle>
                      <CardDescription>Quy định bảo vệ thông tin cá nhân của ứng viên</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between p-5 border border-border rounded-xl bg-gradient-to-br from-brand-primary/5 to-transparent hover:border-brand-primary/30 transition-all duration-200">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold text-foreground">Làm mờ thông tin liên hệ</Label>
                        <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                          <Lock className="w-3 h-3 mr-1" />
                          Privacy
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ẩn Email, SĐT và thông tin nhạy cảm của ứng viên. 
                        Nhà tuyển dụng cần sử dụng <span className="font-semibold text-brand-primary">{config.cvViewPrice} Points</span> để mở khóa.
                      </p>
                    </div>
                    <Switch 
                      checked={config.cvBlurEnabled}
                      onCheckedChange={(c) => setConfig({...config, cvBlurEnabled: c})}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= TAB: NỘI DUNG & TIN TỨC ================= */}
            <TabsContent value="content" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-success/10 rounded-lg">
                      <FileText className="w-4 h-4 text-brand-success" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Kiểm duyệt nội dung</CardTitle>
                      <CardDescription>Quản lý Blog, bài viết và bình luận trên nền tảng</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-start justify-between p-5 border border-border rounded-xl hover:border-brand-success/30 transition-all duration-200">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base font-semibold text-foreground">Tự động duyệt bình luận</Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Bình luận sẽ hiển thị công khai ngay lập tức mà không cần Admin kiểm tra.
                        Tắt tính năng này để kiểm soát chặt chẽ hơn.
                      </p>
                    </div>
                    <Switch 
                      checked={config.newsCommentAutoApprove}
                      onCheckedChange={(c) => setConfig({...config, newsCommentAutoApprove: c})}
                      className="data-[state=checked]:bg-brand-success"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-error" />
                      Từ khóa cấm (Blacklist)
                    </Label>
                    <Textarea 
                      className="min-h-[120px] border-border focus:border-brand-error focus:ring-brand-error/20 font-mono text-sm" 
                      placeholder="lừa đảo, cờ bạc, cheat, hack, spam..."
                    />
                    <div className="flex items-start gap-2 p-3 bg-brand-error/5 border border-brand-error/20 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-brand-error mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Các bài viết hoặc bình luận chứa từ khóa này sẽ bị chặn tự động và đưa vào hàng đợi kiểm duyệt.
                        Phân cách bằng dấu phẩy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= TAB: TÀI CHÍNH & POINT ================= */}
            <TabsContent value="finance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="border-b border-border bg-gradient-to-r from-brand-secondary/10 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-secondary rounded-lg">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Hệ thống Point</CardTitle>
                        <CardDescription>Cấu hình giá trị và quy đổi Point</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Giá trị quy đổi Point</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={config.pointValue}
                          onChange={(e) => setConfig({...config, pointValue: parseInt(e.target.value)})}
                          className="pr-16 border-border focus:border-brand-secondary focus:ring-brand-secondary/20"
                        />
                        <div className="absolute right-0 top-0 h-full px-4 flex items-center bg-muted border-l border-border rounded-r-lg">
                          <span className="text-sm font-medium text-muted-foreground">VND</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">1 Point = {config.pointValue.toLocaleString()} VND</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Phí xem 1 CV</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={config.cvViewPrice}
                          onChange={(e) => setConfig({...config, cvViewPrice: parseInt(e.target.value)})}
                          className="pr-20 border-border focus:border-brand-secondary focus:ring-brand-secondary/20"
                        />
                        <div className="absolute right-0 top-0 h-full px-4 flex items-center bg-brand-secondary/10 border-l border-brand-secondary/20 rounded-r-lg">
                          <span className="text-sm font-semibold text-brand-secondary">Points</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Phí đăng tin Hot</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={config.hotJobFee}
                          onChange={(e) => setConfig({...config, hotJobFee: parseInt(e.target.value)})}
                          className="pr-32 border-border focus:border-brand-secondary focus:ring-brand-secondary/20"
                        />
                        <div className="absolute right-0 top-0 h-full px-4 flex items-center bg-brand-warning/10 border-l border-brand-warning/20 rounded-r-lg">
                          <span className="text-sm font-semibold text-brand-warning">Points/Ngày</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="border-b border-border bg-gradient-to-r from-brand-primary/10 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary rounded-lg">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Cổng thanh toán</CardTitle>
                        <CardDescription>Tích hợp payment gateway</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Payment Gateway chính</Label>
                      <Select 
                        value={config.paymentGateway} 
                        onValueChange={(v) => setConfig({...config, paymentGateway: v})}
                      >
                        <SelectTrigger className="border-border focus:border-brand-primary focus:ring-brand-primary/20">
                          <SelectValue placeholder="Chọn cổng thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vnpay">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-brand-primary rounded flex items-center justify-center text-[8px] font-bold text-white">VP</div>
                              VNPay
                            </div>
                          </SelectItem>
                          <SelectItem value="momo">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-pink-600 rounded flex items-center justify-center text-[8px] font-bold text-white">M</div>
                              Momo
                            </div>
                          </SelectItem>
                          <SelectItem value="paypal">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-[8px] font-bold text-white">PP</div>
                              PayPal
                            </div>
                          </SelectItem>
                          <SelectItem value="stripe">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-brand-accent rounded flex items-center justify-center text-[8px] font-bold text-white">S</div>
                              Stripe
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="p-4 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-lg border border-brand-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-brand-primary rounded-lg flex-shrink-0">
                          <Server className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm">
                          <p className="text-foreground mb-1">
                            Để cấu hình chi tiết <span className="font-semibold">API Key, Secret Key, Webhook</span>
                          </p>
                          <button className="text-brand-primary font-medium hover:text-brand-secondary transition-colors hover:underline">
                            Mở trang quản lý Merchant →
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-muted rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Giao dịch hôm nay</p>
                        <p className="text-xl font-bold text-foreground">847</p>
                      </div>
                      <div className="p-3 bg-brand-success/10 rounded-lg border border-brand-success/20">
                        <p className="text-xs text-brand-success mb-1">Doanh thu tháng</p>
                        <p className="text-xl font-bold text-brand-success">₫156M</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ================= TAB: BẢO MẬT ================= */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border bg-gradient-to-r from-brand-error/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-error rounded-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bảo mật & Xác thực</CardTitle>
                      <CardDescription>Cấu hình các chính sách bảo mật cho người dùng</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-brand-error/30 transition-all">
                      <div className="space-y-1 flex-1">
                        <Label className="font-semibold text-foreground">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Bắt buộc 2FA cho tài khoản Admin</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-brand-error" />
                    </div>

                    <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-brand-error/30 transition-all">
                      <div className="space-y-1 flex-1">
                        <Label className="font-semibold text-foreground">Email Verification</Label>
                        <p className="text-xs text-muted-foreground">Yêu cầu xác thực email khi đăng ký</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-brand-error" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Session Timeout (phút)</Label>
                    <Input 
                      type="number" 
                      defaultValue="30"
                      className="max-w-xs border-border focus:border-brand-error focus:ring-brand-error/20"
                    />
                    <p className="text-xs text-muted-foreground">Tự động đăng xuất sau khoảng thời gian không hoạt động</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= TAB: TÍCH HỢP ================= */}
            <TabsContent value="integration" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-accent/10 rounded-lg">
                      <Mail className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email Server (SMTP)</CardTitle>
                      <CardDescription>Cấu hình gửi email tự động cho hệ thống</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">SMTP Host</Label>
                      <Input 
                        value={config.smtpServer}
                        onChange={(e) => setConfig({...config, smtpServer: e.target.value})}
                        placeholder="smtp.sendgrid.net"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">SMTP Port</Label>
                      <Input 
                        placeholder="587"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Username</Label>
                      <Input 
                        placeholder="apikey"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Password</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••••••••"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-brand-success/10 rounded-lg border border-brand-success/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-success rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Kết nối thành công</p>
                        <p className="text-xs text-muted-foreground">Email server đang hoạt động bình thường</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-brand-success/30 hover:bg-brand-success/10">
                      Gửi test email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      <Globe className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Analytics & Social Login</CardTitle>
                      <CardDescription>Tích hợp Google Analytics và xác thực bên thứ 3</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Google Analytics ID (GA4)</Label>
                    <div className="flex gap-3">
                      <Input 
                        placeholder="G-XXXXXXXXXX" 
                        className="font-mono border-border focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                      <Button variant="outline" className="whitespace-nowrap">
                        Verify
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Google OAuth Client ID</Label>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value="••••••••••••••••••••••••••••" 
                          readOnly 
                          className="bg-muted font-mono border-border pr-10"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Facebook App ID</Label>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value="••••••••••••••••••••••••••••" 
                          readOnly 
                          className="bg-muted font-mono border-border pr-10"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
                    <div className="flex items-start gap-3">
                      <Bell className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Các credential này đã được mã hóa và lưu trữ an toàn. 
                        Để cập nhật, vui lòng liên hệ Technical Admin hoặc sử dụng Secret Manager.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2024 TopDev Platform. Phiên bản 2.4.1</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-brand-primary transition-colors">Documentation</a>
                <a href="#" className="hover:text-brand-primary transition-colors">API Reference</a>
                <a href="#" className="hover:text-brand-primary transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminSettings;