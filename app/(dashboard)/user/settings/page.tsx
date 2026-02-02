"use client";

import React, { useState } from "react";
import {
  User, Lock, Bell, Shield, Monitor, Briefcase, CreditCard,
  Camera, Eye, EyeOff, Check, AlertCircle, Loader2,
  Linkedin, Twitter, Github, Globe, Phone, Sun, Moon
} from "lucide-react";

// Import các component của shadcn/ui
// Lưu ý: Đường dẫn import có thể khác tùy vào cấu trúc dự án của bạn (thường là @/components/ui/...)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const PlatformSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "+84 912 345 678",
    title: "Senior Product Manager",
    company: "Tech Solutions Vietnam",
    location: "Hà Nội, Việt Nam",
    bio: "Chuyên gia quản lý sản phẩm với hơn 8 năm kinh nghiệm trong lĩnh vực công nghệ.",
    website: "https://example.com",
    linkedin: "linkedin.com/in/nguyenvanan",
    twitter: "@nguyenvanan",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNews: true,
    emailJobs: true,
    emailMessages: false,
    pushNews: true,
    pushJobs: false,
    pushMessages: true,
    weeklyDigest: true,
    jobAlerts: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    searchEngineIndex: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    // Giả lập API call
    setTimeout(() => {
      setIsSaving(false);
      // Bạn có thể dùng toast ở đây: toast({ title: "Đã lưu thay đổi" })
      alert("Đã lưu thay đổi thành công!");
    }, 1000);
  };

  return (
    <div className="mx-6 py-18 lg:mx-12 lg:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
                <p className="text-muted-foreground">Quản lý cài đặt tài khoản và tùy chọn của bạn.</p>
            </div>
            <div className="flex items-center gap-2">
                 <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                 >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                 </Button>
            </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex lg:grid-cols-none h-auto p-1 bg-muted">
            <TabsTrigger value="profile" className="gap-2 py-2"><User size={16} /> Hồ sơ</TabsTrigger>
            <TabsTrigger value="account" className="gap-2 py-2"><Lock size={16} /> Tài khoản</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 py-2"><Bell size={16} /> Thông báo</TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2 py-2"><Shield size={16} /> Quyền riêng tư</TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2 py-2"><Monitor size={16} /> Hiển thị</TabsTrigger>
          </TabsList>

          {/* ================= PROFILE TAB ================= */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
                {/* Avatar Column */}
                <Card className="md:col-span-4 lg:col-span-3 h-fit">
                    <CardHeader>
                        <CardTitle>Ảnh đại diện</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">NA</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <Button variant="outline" className="w-full">Tải ảnh lên</Button>
                            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">Xóa ảnh</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Column */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cá nhân</CardTitle>
                            <CardDescription>Cập nhật thông tin công khai của bạn.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Họ và tên</Label>
                                    <Input id="fullName" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input id="phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Địa điểm</Label>
                                    <Input id="location" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Chức danh</Label>
                                    <Input id="title" value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Công ty</Label>
                                    <Input id="company" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Giới thiệu</Label>
                                <Textarea 
                                    id="bio" 
                                    value={profile.bio} 
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    className="min-h-[100px]"
                                />
                                <p className="text-xs text-muted-foreground text-right">{profile.bio.length}/500</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mạng xã hội</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Linkedin className="w-5 h-5 text-blue-600" />
                                <Input value={profile.linkedin} onChange={(e) => setProfile({...profile, linkedin: e.target.value})} placeholder="Linkedin Profile" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Twitter className="w-5 h-5 text-sky-400" />
                                <Input value={profile.twitter} onChange={(e) => setProfile({...profile, twitter: e.target.value})} placeholder="Twitter Handle" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-gray-500" />
                                <Input value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} placeholder="Website URL" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>

          {/* ================= ACCOUNT TAB ================= */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo vệ tài khoản.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Mật khẩu mới</Label>
                        <Input type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label>Xác nhận mật khẩu</Label>
                        <Input type="password" />
                    </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Yêu cầu mật khẩu:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Ít nhất 8 ký tự</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Có chữ hoa và chữ thường</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Có ít nhất 1 số</li>
                    </ul>
                </div>
              </CardContent>
              <CardFooter>
                  <Button>Cập nhật mật khẩu</Button>
              </CardFooter>
            </Card>

            <Card className="border-destructive/30">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle size={20} />
                        <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
                    </p>
                    <Button variant="destructive">Xóa tài khoản</Button>
                </CardContent>
            </Card>
          </TabsContent>

          {/* ================= NOTIFICATIONS TAB ================= */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                    <CardDescription>Chọn cách bạn muốn nhận thông báo.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div>
                        <h4 className="mb-4 text-sm font-medium leading-none">Thông báo qua Email</h4>
                        <div className="space-y-4">
                            {[
                                { key: 'emailNews', label: 'Tin tức mới', desc: 'Nhận thông báo về các bài viết mới' },
                                { key: 'emailJobs', label: 'Việc làm phù hợp', desc: 'Công việc phù hợp với hồ sơ của bạn' },
                                { key: 'weeklyDigest', label: 'Tổng hợp hàng tuần', desc: 'Bản tin tổng hợp các hoạt động' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between space-x-2">
                                    <Label htmlFor={item.key} className="flex flex-col space-y-1">
                                        <span>{item.label}</span>
                                        <span className="font-normal text-xs text-muted-foreground">{item.desc}</span>
                                    </Label>
                                    <Switch 
                                        id={item.key} 
                                        checked={notifications[item.key as keyof typeof notifications]}
                                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />

                    <div>
                        <h4 className="mb-4 text-sm font-medium leading-none">Thông báo đẩy (Push)</h4>
                        <div className="space-y-4">
                             {[
                                { key: 'pushMessages', label: 'Tin nhắn mới', desc: 'Thông báo tin nhắn real-time' },
                                { key: 'jobAlerts', label: 'Cảnh báo việc làm', desc: 'Công việc mới theo tiêu chí' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between space-x-2">
                                    <Label htmlFor={item.key} className="flex flex-col space-y-1">
                                        <span>{item.label}</span>
                                        <span className="font-normal text-xs text-muted-foreground">{item.desc}</span>
                                    </Label>
                                    <Switch 
                                        id={item.key} 
                                        checked={notifications[item.key as keyof typeof notifications]}
                                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          {/* ================= PRIVACY TAB ================= */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Hiển thị hồ sơ</CardTitle>
                    <CardDescription>Kiểm soát ai có thể nhìn thấy thông tin của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup 
                        defaultValue={privacy.profileVisibility} 
                        onValueChange={(val) => setPrivacy({...privacy, profileVisibility: val})}
                        className="grid gap-4"
                    >
                        {[
                            { value: 'public', label: 'Công khai', desc: 'Mọi người đều có thể xem' },
                            { value: 'connections', label: 'Chỉ kết nối', desc: 'Chỉ những người trong mạng lưới' },
                            { value: 'private', label: 'Riêng tư', desc: 'Chỉ mình bạn xem được' }
                        ].map((option) => (
                            <div key={option.value} className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                                <div className="space-y-1">
                                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                        {option.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {option.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {[
                        { key: 'showEmail', label: 'Hiển thị email', desc: 'Cho phép người khác xem email' },
                        { key: 'showPhone', label: 'Hiển thị số điện thoại', desc: 'Cho phép người khác xem SĐT' },
                        { key: 'allowMessages', label: 'Cho phép nhắn tin', desc: 'Người lạ có thể gửi tin nhắn' }
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                <Label className="text-base">{item.label}</Label>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                             </div>
                             <Switch 
                                checked={privacy[item.key as keyof typeof privacy] as boolean}
                                onCheckedChange={(checked) => setPrivacy({...privacy, [item.key]: checked})}
                             />
                        </div>
                    ))}
                </CardContent>
            </Card>
          </TabsContent>

          {/* ================= PREFERENCES TAB ================= */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Giao diện & Ngôn ngữ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Chủ đề hiển thị</Label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { value: 'light', label: 'Sáng', icon: Sun },
                                { value: 'dark', label: 'Tối', icon: Moon },
                                { value: 'system', label: 'Hệ thống', icon: Monitor }
                            ].map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div 
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={`
                                            cursor-pointer flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-muted hover:text-accent-foreground
                                            ${theme === option.value ? 'border-primary bg-primary/5' : 'border-muted bg-transparent'}
                                        `}
                                    >
                                        <Icon className="mb-3 h-6 w-6" />
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Ngôn ngữ</Label>
                            <Select defaultValue="vi">
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ngôn ngữ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ja">日本語</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Múi giờ</Label>
                            <Select defaultValue="hcm">
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn múi giờ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hcm">(GMT+7) Hà Nội, Bangkok</SelectItem>
                                    <SelectItem value="tokyo">(GMT+9) Tokyo, Seoul</SelectItem>
                                    <SelectItem value="ny">(GMT-5) New York</SelectItem>
                                </SelectContent>
                            </Select>
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

export default PlatformSettings;