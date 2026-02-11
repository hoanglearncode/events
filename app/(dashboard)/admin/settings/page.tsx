"use client";

import React, { useEffect, useState } from "react";
import {
  Settings, Building2, FileText, CreditCard, Shield, 
  Globe, Mail, Server, Save, Loader2, AlertTriangle,
  CheckCircle2, DollarSign, Users, Lock, Zap, Eye,
  Clock, Bell, Activity, Database, Coffee,
  Plus
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

import { General, Content, Recruitment, Authentication, PaymentGatewayConfig, Integration } from "./_types/setting";
import { useRouter, useSearchParams } from "next/navigation";
import { platformSettingSchema } from "./_helper/validation";
import { ZodError } from "zod";
import { toast } from "sonner";
import { useSettingDetailQuery } from "@/hooks/query/setting";

import { PlatformSettingsSkeleton } from "./_components/Loading"

const listOfDate = ["1", "5", "10", "15", "20", "30", "60", "90"]

const PlatformAdminSettings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromUrl = searchParams.get("tab") || "general";
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [showSecret, setShowSecret] = useState({
    google: false,
    facebook: false,
  });

  // data value 
  const [general, setGeneral] = useState<General>({
    systemName: "",
    systemEmail: "",
    systemTitle: "",
    systemDescription: "",
    maintainMode: false,
    allowRegister: true
  });

  const [recruitment, setRecruitment] = useState<Recruitment>({
    viewProfile: true,
    approval: true,
    freeCounter: 10,
    timeReset: "30"
  })

  const [content, setContent] = useState<Content>({
    allowComment: true,
    blacklistKeywords : []
  });

  const [paymentConfig, setPaymentConfig] = useState<{gateways : PaymentGatewayConfig[]} >({
    gateways: [],
  });

  const [integration, setIntegration] = useState<Integration>({
    email: {
      username: "",
      password: "",
      host: "",
      port: "",
    },

    analytics: {
      ga4: {
        measurementId: "",
        verified: false,
      },
    },

    oauth: {
      google: {
        clientId: "",
        enabled: false,
        verified: false,
      },
      facebook: {
        clientId: "",
        enabled: false,
        verified: false,
      },
    },

    meta: {
      encrypted: true,
      managedBy: "SECRET_MANAGER",
    },
  });

  const [auth, setAuth] = useState<Authentication>({
    twoFactor: true,
    emailVerification: true,
    tokenLifetime: "30"
  });

  const { data, isLoading, error } = useSettingDetailQuery();

  useEffect(()=> {
    if(!data) return;
    console.log(data)
    setGeneral(data.general);
    setRecruitment(data.recruitment);
    setContent({
      allowComment: data.content.allowComment,
      blacklistKeywords : data.content.blacklistKeywords ?? [],
    });

    setPaymentConfig({
      gateways: data.paymentGateways,
    });

    setAuth(data.authentication);

  }, [data])

  const handleSave = () => {
    try {
      setIsSaving(true);

      platformSettingSchema.parse({
        general,
        recruitment,
        content,
        auth,
        integration,
      });

      setTimeout(() => {
        setIsSaving(false);
        toast.success("Cập nhật thành công!")
      }, 1000);

    } catch (error) {
      setIsSaving(false);

      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        toast.error(`Lỗi ${firstError.message}`);
        return;
      }

      console.error(error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };


  const setDefaultGateway = (key: string) => {
    setPaymentConfig(prev => ({
      gateways: prev.gateways.map(g => ({
        ...g,
        isDefault: g.gatewayCode === key,
      })),
    }));
  };

  const addGateway = () => {
    const newGateway: PaymentGatewayConfig = {
      gatewayCode: "zalopay",
      enabled: false,
      isDefault: false,
    };

    setPaymentConfig(prev => ({
      gateways: [...prev.gateways, newGateway],
    }));
  };

  const toggleGateway = (key: string) => {
    setPaymentConfig(prev => ({
      gateways: prev.gateways.map(g =>
        g.gatewayCode === key
          ? { ...g, enabled: !g.enabled, isDefault: g.enabled ? false : g.isDefault }
          : g
      ),
    }));
  };

  const handleTestEmail = () => {}

  const verifyGA = () => {
    // call backend
    // if success:
    setIntegration(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        ga4: {
          ...prev.analytics.ga4,
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      },
    }));
  }

  const verifyOAuth = (provider: "google" | "facebook") => {
    // call backend verify OAuth config
    setIntegration(prev => ({
      ...prev,
      oauth: {
        ...prev.oauth,
        [provider]: {
          ...prev.oauth[provider],
          verified: true,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  }

  if(isLoading) return <PlatformSettingsSkeleton />


  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-brand-primary/20">
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
                  className="bg-primary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg shadow-brand-primary/20 min-w-[140px] transition-all duration-200"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">System Status</p>
                    <p className="text-lg font-bold text-foreground">
                      {general.maintainMode ? "Maintenance" : "Active"}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${general.maintainMode ? 'bg-brand-warning/10' : 'bg-brand-success/10'}`}>
                    <Activity className={`w-5 h-5 ${general.maintainMode ? 'text-brand-warning' : 'text-brand-success'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Registration</p>
                    <p className="text-lg font-bold text-foreground">
                      {general.allowRegister ? "Open" : "Closed"}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${general.allowRegister ? 'bg-brand-primary/10' : 'bg-muted'}`}>
                    <Users className={`w-5 h-5 ${general.allowRegister ? 'text-brand-primary' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Payment Gateway</p>
                    <p className="text-lg font-bold text-foreground uppercase">{paymentConfig.gateways.find(i => i.isDefault)?.gatewayCode}</p>
                  </div>
                  <div className="p-2.5 bg-brand-secondary/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-brand-secondary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            {general.maintainMode && (
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
                  <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 pt-0">
                    <CardHeader className="border-b border-border bg-muted rounded-t-xl py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-primary/10 rounded-lg">
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
                            value={general.systemName} 
                            placeholder="System Name"
                            onChange={(e) => setGeneral({...general, systemName: e.target.value})}
                            className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Email hỗ trợ</Label>
                          <Input 
                            value={general.systemEmail} 
                            placeholder="contact@gmail.com"
                            onChange={(e) => setGeneral({...general, systemEmail: e.target.value})}
                            className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">SEO Title</Label>
                        <Input 
                          value={general.systemTitle} 
                          placeholder="A brief name of the platform...."
                          onChange={(e) => setGeneral({...general, systemTitle: e.target.value})}
                          className="border-border focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Meta Description</Label>
                        <Textarea 
                          value={general.systemDescription}
                          onChange={(e) => setGeneral({...general, systemDescription: e.target.value})}
                          placeholder="A brief description of the platform...."
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
                            {general.maintainMode && (
                              <Badge variant="secondary" className="bg-brand-warning/10 text-brand-warning border-brand-warning/20">Active</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Tắt website để thực hiện nâng cấp hoặc bảo trì hệ thống
                          </p>
                        </div>
                        <Switch 
                          checked={general.maintainMode}
                          onCheckedChange={(c) => setGeneral({...general, maintainMode: c})}
                          className="data-[state=checked]:bg-primary bg-gray-400"
                        />
                      </div>
                      
                      <Separator className="bg-brand-primary/10" />
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-semibold text-foreground">Đăng ký thành viên</Label>
                            {general.allowRegister && (
                              <Badge variant="secondary" className="bg-brand-success/10 text-brand-success border-brand-success/20">Open</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Cho phép người dùng mới tạo tài khoản trên nền tảng
                          </p>
                        </div>
                        <Switch 
                          checked={general.allowRegister}
                          onCheckedChange={(c) => setGeneral({...general, allowRegister: c})}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ================= TAB: TUYỂN DỤNG ================= */}
            <TabsContent value="recruitment" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 pt-0">
                <CardHeader className="border-b border-border bg-muted rounded-t-xl py-4">
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
                  <div className="flex items-start justify-between p-5 border-2 border-dashed border-border rounded-xl bg-muted/10 hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all duration-200">
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
                      checked={recruitment.approval}
                      onCheckedChange={(c) => setRecruitment({...recruitment, approval: c})}
                      className="data-[state=checked]:bg-primary bg-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Thời hạn tin đăng mặc định
                      </Label>
                      <Select 
                        value={recruitment.timeReset}
                        onValueChange={(v) => setRecruitment({...recruitment, timeReset: v})}
                      >
                        <SelectTrigger className="border-border focus:border-brand-accent focus:ring-brand-accent/20">
                          <SelectValue placeholder="Chọn thời hạn" />
                        </SelectTrigger>
                        <SelectContent>
                          {listOfDate.map((i) => (<SelectItem key={i} value={i}>{i} ngày</SelectItem>))}
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
                        value={recruitment.freeCounter}
                        onChange={(e) => setRecruitment({...recruitment, freeCounter: parseInt(e.target.value)})}
                        className="border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                      <p className="text-xs text-muted-foreground">Mỗi doanh nghiệp mới sẽ có số tin đăng miễn phí này</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= TAB: NỘI DUNG & TIN TỨC ================= */}
            <TabsContent value="content" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 pt-0">
                <CardHeader className="border-b border-border bg-muted rounded-t-xl py-4">
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
                      checked={content.allowComment}
                      onCheckedChange={(c) => setContent({...content, allowComment: c})}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-error" />
                      Từ khóa cấm (Blacklist)
                    </Label>
                    <Textarea 
                      value={content.blacklistKeywords .join(', ').toString()}
                      onChange={(e) => setContent({...content, blacklistKeywords : e.target.value.toString().split(',').map(i => i.trim())})}
                      className="min-h-[120px] border-border focus:border-brand-error focus:ring-brand-error/20 text-sm" 
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
              <div className="grid gap-6 md:grid-cols-1">
                {/* <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
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
                </Card> */}

                <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="border-b border-border bg-gradient-to-r from-brand-primary/10 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary rounded-lg">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Cổng thanh toán</CardTitle>
                          <CardDescription>Tích hợp payment gateway</CardDescription>
                        </div>
                      </div>
                      <Button
                        onClick={addGateway}
                        className="bg-primary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg shadow-brand-primary/20 min-w-[140px] transition-all duration-200"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm cổng thanh toán
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Danh sách Payment Gateway
                      </Label>

                      <CardContent className="space-y-3 px-1">
                        {paymentConfig.gateways.map((g) => (
                          <div
                            key={g.gatewayCode}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                          >
                            {/* LEFT */}
                            <div>
                              <p className="font-medium">{g.gatewayCode}</p>
                              <p className="text-xs text-muted-foreground">
                                {g.enabled ? "Đang hoạt động" : "Chưa kích hoạt"}
                              </p>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-3">
                              {/* DEFAULT BADGE */}
                              {g.isDefault && (
                                <Badge variant="default">Mặc định</Badge>
                              )}

                              {/* SET DEFAULT */}
                              {!g.isDefault && g.enabled && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDefaultGateway(g.gatewayCode)}
                                >
                                  Đặt mặc định
                                </Button>
                              )}

                              {/* TOGGLE ENABLE */}
                              <Switch
                                checked={g.enabled}
                                onCheckedChange={() => toggleGateway(g.gatewayCode)}
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
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
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-brand-error/30 transition-all">
                      <div className="space-y-1 flex-1">
                        <Label className="font-semibold text-foreground">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Bắt buộc 2FA cho tài khoản Admin</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" checked={auth.twoFactor} onCheckedChange={(isCheck)=> setAuth({...auth, twoFactor: isCheck})} />
                    </div>

                    <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-brand-error/30 transition-all">
                      <div className="space-y-1 flex-1">
                        <Label className="font-semibold text-foreground">Email Verification</Label>
                        <p className="text-xs text-muted-foreground">Yêu cầu xác thực email khi đăng ký</p>
                      </div>
                      <Switch checked={auth.emailVerification} onCheckedChange={(isCheck)=> setAuth({...auth, emailVerification: isCheck})} className="data-[state=checked]:bg-primary" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Session Timeout (phút)</Label>
                    <Input 
                      type="number" 
                      value={auth.tokenLifetime}
                      onChange={(e)=> setAuth({...auth, tokenLifetime: e.target.value})}
                      className="max-w-xs border-border focus:border-brand-error focus:ring-brand-error/20"
                    />
                    <p className="text-xs text-muted-foreground">Tự động đăng xuất sau khoảng thời gian không hoạt động</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= TAB: TÍCH HỢP ================= */}
            <TabsContent value="integration" className="space-y-6 mt-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 pt-0">
                <CardHeader className="border-b border-border bg-muted rounded-t-xl py-4">
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
                        value={integration.email.host}
                        onChange={(e) => setIntegration({...integration, email: {...integration.email, host: e.target.value}})}
                        placeholder="smtp.sendgrid.net"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">SMTP Port</Label>
                      <Input 
                        value={integration.email.port}
                        onChange={(e) => setIntegration({...integration, email: {...integration.email, port: e.target.value}})}
                        placeholder="587"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Username</Label>
                      <Input 
                        value={integration.email.username}
                        onChange={(e) => setIntegration({...integration, email: {...integration.email, username: e.target.value}})}
                        placeholder="username"
                        className="font-mono border-border focus:border-brand-accent focus:ring-brand-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Password</Label>
                      <Input 
                        type="password" 
                        value={integration.email.password}
                        onChange={(e) => setIntegration({...integration, email: {...integration.email, password: e.target.value}})}
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
                    <Button onClick={handleTestEmail} variant="outline" size="sm" className="border-brand-success/30 hover:bg-brand-success/10">
                      Gửi test email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 pt-0">
                <CardHeader className="border-b border-border bg-muted rounded-t-xl py-4">
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
                        value={integration.analytics.ga4.measurementId}
                        onChange={(e) =>
                          setIntegration({
                            ...integration,
                            analytics: {
                              ...integration.analytics,
                              ga4: {
                                ...integration.analytics.ga4,
                                measurementId: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="G-XXXXXXXXXX" 
                        className="font-mono border-border focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                      <Button variant="outline" onClick={verifyGA} className="whitespace-nowrap">
                        Verify
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* GOOGLE OAUTH */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Google OAuth Client ID</Label>

                      <div className="relative">
                        <Input
                          type={showSecret.google ? "text" : "password"}
                          value={integration.oauth.google.clientId}
                          onChange={(e)=> setIntegration({...integration, oauth: {...integration.oauth, google: {...integration.oauth.google, clientId: e.target.value}}})}
                          placeholder="••••••••••••••••••••••••••••"
                          className="bg-muted font-mono border-border pr-24"
                        />

                        {/* ACTIONS */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setShowSecret(s => ({ ...s, google: !s.google }))
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Switch
                            checked={integration.oauth.google.enabled}
                            onCheckedChange={(v) =>
                              setIntegration({
                                ...integration,
                                oauth: {
                                  ...integration.oauth,
                                  google: {
                                    ...integration.oauth.google,
                                    enabled: v,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {integration.oauth.google.enabled
                            ? "Đang hoạt động"
                            : "Đã tắt"}
                        </span>

                        {integration.oauth.google.verified ? (
                          <span className="text-brand-success font-medium">✔ Verified</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyOAuth("google")}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* FACEBOOK OAUTH */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Facebook App ID</Label>

                      <div className="relative">
                        <Input
                          type={showSecret.facebook ? "text" : "password"}
                          value={integration.oauth.facebook.clientId}
                          
                          onChange={(e)=> setIntegration({...integration, oauth: {...integration.oauth, facebook: {...integration.oauth.facebook, clientId: e.target.value}}})}
                          className="bg-muted font-mono border-border pr-24"
                        />

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setShowSecret(s => ({ ...s, facebook: !s.facebook }))
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Switch
                            checked={integration.oauth.facebook.enabled}
                            onCheckedChange={(v) =>
                              setIntegration({
                                ...integration,
                                oauth: {
                                  ...integration.oauth,
                                  facebook: {
                                    ...integration.oauth.facebook,
                                    enabled: v,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {integration.oauth.facebook.enabled
                            ? "Đang hoạt động"
                            : "Đã tắt"}
                        </span>

                        {integration.oauth.facebook.verified ? (
                          <span className="text-brand-success font-medium">✔ Verified</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyOAuth("facebook")}
                          >
                            Verify
                          </Button>
                        )}
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
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminSettings;