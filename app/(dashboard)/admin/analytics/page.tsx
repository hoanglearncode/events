"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarCheck,
  Newspaper,
  ClipboardList,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  BookOpen,
  UserCheck,
  XCircle,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "T1",  registrations: 120, events: 5  },
  { month: "T2",  registrations: 145, events: 7  },
  { month: "T3",  registrations: 98,  events: 4  },
  { month: "T4",  registrations: 210, events: 9  },
  { month: "T5",  registrations: 187, events: 8  },
  { month: "T6",  registrations: 263, events: 12 },
  { month: "T7",  registrations: 234, events: 10 },
  { month: "T8",  registrations: 312, events: 14 },
  { month: "T9",  registrations: 289, events: 13 },
  { month: "T10", registrations: 341, events: 15 },
  { month: "T11", registrations: 298, events: 11 },
  { month: "T12", registrations: 376, events: 17 },
];

const topEvents = [
  { name: "Chiến dịch Mùa Hè Xanh 2024",   registrations: 312, province: "TP.HCM",  growth: 28 },
  { name: "Hiến máu nhân đạo tháng 6",       registrations: 256, province: "Hà Nội",  growth: 15 },
  { name: "Dạy học vùng cao – Lào Cai",       registrations: 198, province: "Lào Cai", growth: 9  },
  { name: "Bảo vệ môi trường biển Đà Nẵng",  registrations: 174, province: "Đà Nẵng", growth: -4 },
  { name: "Hỗ trợ trẻ em khuyết tật",        registrations: 143, province: "Cần Thơ", growth: 21 },
];

const categoryData = [
  { category: "Cộng đồng & xã hội", percentage: 38, count: 52, color: "bg-brand-primary"   },
  { category: "Môi trường",          percentage: 24, count: 33, color: "bg-brand-secondary" },
  { category: "Giáo dục",            percentage: 20, count: 27, color: "bg-brand-accent"    },
  { category: "Y tế & sức khỏe",     percentage: 18, count: 25, color: "bg-brand-warning"   },
];

const topNews = [
  { title: "Hành trình 100 ngày tình nguyện tại vùng lũ",    views: 12450, category: "Câu chuyện TV", growth: 34 },
  { title: "Cách đăng ký tham gia sự kiện tình nguyện 2024", views: 9870,  category: "Hướng dẫn",    growth: 22 },
  { title: "Top 10 tổ chức tình nguyện uy tín tại Việt Nam", views: 8340,  category: "Danh sách",     growth: 18 },
  { title: "Mùa Hè Xanh 2024: Những điều cần chuẩn bị",     views: 7210,  category: "Sự kiện",       growth: 11 },
  { title: "Phỏng vấn: Vì sao bạn chọn làm tình nguyện?",   views: 6890,  category: "Câu chuyện TV", growth: -3 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 4, color: "hsl(var(--foreground))" }}>{label}</p>
      <p style={{ color: "hsl(var(--muted-foreground))" }}>
        Đăng ký: <strong style={{ color: "hsl(var(--foreground))" }}>{payload[0].value} đơn</strong>
      </p>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Tổng quan hoạt động</h1>
                <p className="text-muted-foreground mt-1">Sự kiện tình nguyện · Đăng ký · Tin tức</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-card hover:bg-muted border-border">
                <Filter className="w-4 h-4" /> Bộ lọc
              </Button>
              <Button className="gap-2 bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30">
                <Download className="w-4 h-4" /> Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <CalendarCheck className="w-6 h-6 text-brand-primary" />,
              iconBg: "bg-brand-primary/10", glow: "from-brand-primary/10",
              badgeCls: "bg-brand-success/10 text-brand-success border-brand-success/20",
              up: true, badgeVal: "+18.4%",
              label: "Tổng sự kiện", value: "137", sub: "Đang diễn ra: 12 sự kiện",
            },
            {
              icon: <ClipboardList className="w-6 h-6 text-brand-secondary" />,
              iconBg: "bg-brand-secondary/10", glow: "from-brand-secondary/10",
              badgeCls: "bg-brand-success/10 text-brand-success border-brand-success/20",
              up: true, badgeVal: "+24.1%",
              label: "Lượt đăng ký", value: "2,873", sub: "Chờ duyệt: 143 đơn",
            },
            {
              icon: <Users className="w-6 h-6 text-brand-accent" />,
              iconBg: "bg-brand-accent/10", glow: "from-brand-accent/10",
              badgeCls: "bg-brand-success/10 text-brand-success border-brand-success/20",
              up: true, badgeVal: "+11.7%",
              label: "Tình nguyện viên", value: "4,512", sub: "Thành viên mới: 428",
            },
            {
              icon: <Newspaper className="w-6 h-6 text-brand-warning" />,
              iconBg: "bg-brand-warning/10", glow: "from-brand-warning/10",
              badgeCls: "bg-brand-error/10 text-brand-error border-brand-error/20",
              up: false, badgeVal: "-3.2%",
              label: "Lượt đọc tin tức", value: "87.6K", sub: "Bài viết mới: 34 bài",
            },
          ].map((card, i) => (
            <Card key={i} className="border-border shadow-md glass-dark overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.glow} to-transparent rounded-full -mr-16 -mt-16`} />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${card.iconBg} rounded-xl`}>{card.icon}</div>
                  <Badge className={card.badgeCls}>
                    {card.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {card.badgeVal}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-border">
            <TabsList className="bg-transparent h-12">
              {[
                { val: "overview",   label: "Tổng quan"          },
                { val: "events",     label: "Sự kiện"             },
                { val: "volunteers", label: "Tình nguyện viên"    },
                { val: "news",       label: "Tin tức"             },
              ].map((t) => (
                <TabsTrigger
                  key={t.val} value={t.val}
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ── OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ✅ Recharts Bar Chart – defs bên trong BarChart */}
              <Card className="lg:col-span-2 border-border shadow-xl glass-dark">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">Lượt đăng ký theo tháng</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tổng số đơn đăng ký tình nguyện trong năm
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-brand-primary">
                      <Eye className="w-4 h-4 mr-2" /> Chi tiết
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pb-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                      barCategoryGap="35%"
                    >
                      {/*
                       * ✅ <defs> phải nằm TRỰC TIẾP trong <BarChart>
                       *    (Recharts render nó vào trong <svg>)
                       */}
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#818cf8" stopOpacity={1}   />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                      <Bar
                        dataKey="registrations"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-border mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary" />
                      <span className="text-sm text-muted-foreground">Lượt đăng ký</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-brand-success" />
                      <span className="text-sm text-muted-foreground">Tăng trưởng</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="border-border shadow-xl glass-dark">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-foreground">Phân loại sự kiện</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Theo lĩnh vực hoạt động</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{cat.category}</span>
                          <span className="text-muted-foreground">{cat.percentage}%</span>
                        </div>
                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 ${cat.color} rounded-full transition-all`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{cat.count} sự kiện</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Tổng sự kiện</span>
                    <span className="text-lg font-bold text-brand-primary">
                      {categoryData.reduce((s, c) => s + c.count, 0)} sự kiện
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { bg: "bg-brand-success/10", icon: <CheckCircle className="w-6 h-6 text-brand-success" />, label: "Tỷ lệ duyệt đơn",    value: "87.3%", vCls: "text-brand-success", sub: "Trong 30 ngày qua"         },
                { bg: "bg-brand-accent/10",  icon: <Star className="w-6 h-6 text-brand-accent" />,          label: "Đánh giá sự kiện",   value: "4.7 / 5", vCls: "text-foreground",   sub: "Trung bình toàn nền tảng"  },
                { bg: "bg-brand-warning/10", icon: <Clock className="w-6 h-6 text-brand-warning" />,        label: "Thời gian duyệt TB", value: "4.2h",  vCls: "text-foreground",   sub: "Từ nộp đơn đến phê duyệt"  },
              ].map((s, i) => (
                <Card key={i} className="border-border shadow-md glass-dark">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${s.bg} rounded-xl`}>{s.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.vCls}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── EVENTS TAB ── */}
          <TabsContent value="events" className="space-y-6">
            <Card className="border-border shadow-xl glass-dark">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Sự kiện nổi bật</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Top 5 sự kiện có lượt đăng ký cao nhất</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    Xem tất cả <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {topEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1 truncate">{event.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {event.province}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-foreground">{event.registrations} đăng ký</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {event.growth > 0 ? (
                            <><ArrowUpRight className="w-3 h-3 text-brand-success" /><span className="text-xs text-brand-success font-medium">+{event.growth}%</span></>
                          ) : (
                            <><ArrowDownRight className="w-3 h-3 text-brand-error" /><span className="text-xs text-brand-error font-medium">{event.growth}%</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── VOLUNTEERS TAB ── */}
          <TabsContent value="volunteers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border shadow-xl glass-dark">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-foreground">Phân khúc tình nguyện viên</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Theo số sự kiện đã tham gia</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: "Nòng cốt (>15 sự kiện)",    count: 218,  pct: 5,  color: "bg-brand-primary"    },
                      { label: "Tích cực (8–15 sự kiện)",    count: 634,  pct: 14, color: "bg-brand-secondary"  },
                      { label: "Thường xuyên (3–7 sự kiện)", count: 1358, pct: 30, color: "bg-brand-accent"     },
                      { label: "Mới tham gia (<3 sự kiện)",  count: 2302, pct: 51, color: "bg-muted-foreground" },
                    ].map((seg, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{seg.label}</span>
                          <span className="text-sm text-muted-foreground">{seg.count} TV</span>
                        </div>
                        <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 ${seg.color} rounded-full`} style={{ width: `${seg.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xl glass-dark">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-foreground">Trạng thái đơn đăng ký</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Tổng hợp trong 30 ngày qua</p>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {[
                    { label: "Đã duyệt",     count: 1876, pct: 65, icon: <CheckCircle className="w-5 h-5 text-brand-success" />, bar: "bg-brand-success" },
                    { label: "Chờ duyệt",    count: 398,  pct: 14, icon: <Clock className="w-5 h-5 text-brand-warning" />,        bar: "bg-brand-warning" },
                    { label: "Đang xem xét", count: 312,  pct: 11, icon: <Eye className="w-5 h-5 text-brand-accent" />,            bar: "bg-brand-accent"  },
                    { label: "Từ chối",      count: 287,  pct: 10, icon: <XCircle className="w-5 h-5 text-brand-error" />,         bar: "bg-brand-error"   },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">{item.label}</span>
                          <span className="text-muted-foreground">{item.count} đơn</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.bar} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Tổng đơn</span>
                    <span className="text-lg font-bold text-brand-primary">2,873 đơn</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── NEWS TAB ── */}
          <TabsContent value="news" className="space-y-6">
            <Card className="border-border shadow-xl glass-dark">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Bài viết nổi bật</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Top 5 bài viết có lượt đọc cao nhất</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    Xem tất cả <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {topNews.map((article, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{article.title}</h4>
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          {article.category}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-bold text-foreground text-sm">{article.views.toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {article.growth > 0 ? (
                            <><ArrowUpRight className="w-3 h-3 text-brand-success" /><span className="text-xs text-brand-success font-medium">+{article.growth}%</span></>
                          ) : (
                            <><ArrowDownRight className="w-3 h-3 text-brand-error" /><span className="text-xs text-brand-error font-medium">{article.growth}%</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { bg: "bg-brand-primary/10",   icon: <BookOpen className="w-6 h-6 text-brand-primary" />,      label: "Tổng bài viết",        value: "248",    vCls: "text-foreground",   sub: "Đã xuất bản trong năm"     },
                { bg: "bg-brand-secondary/10", icon: <TrendingUp className="w-6 h-6 text-brand-secondary" />, label: "Tăng trưởng lượt đọc", value: "+31.4%", vCls: "text-brand-success", sub: "So với cùng kỳ"             },
                { bg: "bg-brand-accent/10",    icon: <UserCheck className="w-6 h-6 text-brand-accent" />,      label: "Tỷ lệ chuyển đổi",     value: "12.8%",  vCls: "text-foreground",   sub: "Đọc tin → đăng ký sự kiện" },
              ].map((s, i) => (
                <Card key={i} className="border-border shadow-md glass-dark">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${s.bg} rounded-xl`}>{s.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.vCls}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}