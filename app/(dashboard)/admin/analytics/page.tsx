// "use client";

// export const dynamic = "force-dynamic";

// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   BarChart3,
//   TrendingUp,
//   TrendingDown,
//   Users,
//   ShoppingCart,
//   Package,
//   DollarSign,
//   Calendar,
//   Download,
//   Filter,
//   ArrowUpRight,
//   ArrowDownRight,
//   Eye,
//   Heart,
//   Star,
//   Clock,
// } from "lucide-react";

// // Mock data for charts
// const revenueData = [
//   { month: "T1", revenue: 45000000, orders: 234, growth: 12 },
//   { month: "T2", revenue: 52000000, orders: 278, growth: 15.5 },
//   { month: "T3", revenue: 48000000, orders: 256, growth: -7.7 },
//   { month: "T4", revenue: 61000000, orders: 312, growth: 27 },
//   { month: "T5", revenue: 58000000, orders: 298, growth: -4.9 },
//   { month: "T6", revenue: 72000000, orders: 367, growth: 24 },
//   { month: "T7", revenue: 68000000, orders: 345, growth: -5.5 },
//   { month: "T8", revenue: 79000000, orders: 402, growth: 16.2 },
//   { month: "T9", revenue: 85000000, orders: 431, growth: 7.6 },
//   { month: "T10", revenue: 92000000, orders: 468, growth: 8.2 },
//   { month: "T11", revenue: 88000000, orders: 447, growth: -4.3 },
//   { month: "T12", revenue: 95000000, orders: 483, growth: 8 },
// ];

// const topProducts = [
//   { name: "Cà phê Arabica Premium", sold: 1245, revenue: 62250000, growth: 23 },
//   { name: "Cà phê Robusta Đặc Biệt", sold: 987, revenue: 49350000, growth: 15 },
//   { name: "Cà phê Hòa Tan 3in1", sold: 2341, revenue: 46820000, growth: 8 },
//   { name: "Cà phê Espresso Blend", sold: 654, revenue: 39240000, growth: -5 },
//   { name: "Cà phê Latte Mix", sold: 876, revenue: 35040000, growth: 12 },
// ];

// const categoryData = [
//   {
//     category: "Cà phê hạt",
//     percentage: 45,
//     revenue: 342000000,
//     color: "bg-brand-primary",
//   },
//   {
//     category: "Cà phê pha sẵn",
//     percentage: 28,
//     revenue: 213000000,
//     color: "bg-brand-secondary",
//   },
//   {
//     category: "Cà phê hòa tan",
//     percentage: 18,
//     revenue: 137000000,
//     color: "bg-brand-accent",
//   },
//   {
//     category: "Phụ kiện",
//     percentage: 9,
//     revenue: 68500000,
//     color: "bg-brand-warning",
//   },
// ];

// export default function AnalyticsDashboard() {
//   const [timeRange, setTimeRange] = useState("month");
//   const [activeTab, setActiveTab] = useState("overview");

//   // Calculate max revenue for chart scaling
//   const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

//   return (
//     <div className="min-h-screen bg-background">
//       <main className="container mx-auto px-4 py-8 max-w-7xl">
//         {/* HEADER */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg">
//                 <BarChart3 className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-foreground">
//                   Phân tích kinh doanh
//                 </h1>
//                 <p className="text-muted-foreground mt-1">
//                   Tổng quan hiệu suất và xu hướng phát triển
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Select value={timeRange} onValueChange={setTimeRange}>
//                 <SelectTrigger className="w-[180px] bg-card border-border">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="week">7 ngày qua</SelectItem>
//                   <SelectItem value="month">30 ngày qua</SelectItem>
//                   <SelectItem value="quarter">Quý này</SelectItem>
//                   <SelectItem value="year">Năm nay</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button
//                 variant="outline"
//                 className="gap-2 bg-card hover:bg-muted border-border"
//               >
//                 <Filter className="w-4 h-4" />
//                 Bộ lọc
//               </Button>

//               <Button className="gap-2 bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30">
//                 <Download className="w-4 h-4" />
//                 Xuất báo cáo
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* KEY METRICS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Revenue */}
//           <Card className="border-border shadow-md glass-dark overflow-hidden relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="p-3 bg-brand-primary/10 rounded-xl">
//                   <DollarSign className="w-6 h-6 text-brand-primary" />
//                 </div>
//                 <Badge className="bg-brand-success/10 text-brand-success border-brand-success/20">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +12.5%
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground mb-1">
//                 Tổng doanh thu
//               </p>
//               <p className="text-3xl font-bold text-foreground">₫892M</p>
//               <p className="text-xs text-muted-foreground mt-2">
//                 So với tháng trước
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Orders */}
//           <Card className="border-border shadow-md glass-dark overflow-hidden relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-secondary/10 to-transparent rounded-full -mr-16 -mt-16" />
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="p-3 bg-brand-secondary/10 rounded-xl">
//                   <ShoppingCart className="w-6 h-6 text-brand-secondary" />
//                 </div>
//                 <Badge className="bg-brand-success/10 text-brand-success border-brand-success/20">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +8.2%
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground mb-1">
//                 Tổng đơn hàng
//               </p>
//               <p className="text-3xl font-bold text-foreground">4,523</p>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Trong năm nay
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Customers */}
//           <Card className="border-border shadow-md glass-dark overflow-hidden relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full -mr-16 -mt-16" />
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="p-3 bg-brand-accent/10 rounded-xl">
//                   <Users className="w-6 h-6 text-brand-accent" />
//                 </div>
//                 <Badge className="bg-brand-success/10 text-brand-success border-brand-success/20">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +15.3%
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground mb-1">Khách hàng</p>
//               <p className="text-3xl font-bold text-foreground">2,847</p>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Khách hàng mới: 342
//               </p>
//             </CardContent>
//           </Card>

//           {/* Average Order Value */}
//           <Card className="border-border shadow-md glass-dark overflow-hidden relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-warning/10 to-transparent rounded-full -mr-16 -mt-16" />
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="p-3 bg-brand-warning/10 rounded-xl">
//                   <Package className="w-6 h-6 text-brand-warning" />
//                 </div>
//                 <Badge className="bg-brand-error/10 text-brand-error border-brand-error/20">
//                   <TrendingDown className="w-3 h-3 mr-1" />
//                   -2.1%
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground mb-1">
//                 Giá trị đơn TB
//               </p>
//               <p className="text-3xl font-bold text-foreground">₫197K</p>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Đơn hàng trung bình
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* MAIN CONTENT TABS */}
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-6"
//         >
//           <div className="border-b border-border">
//             <TabsList className="bg-transparent h-12">
//               <TabsTrigger
//                 value="overview"
//                 className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
//               >
//                 Tổng quan
//               </TabsTrigger>
//               <TabsTrigger
//                 value="products"
//                 className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
//               >
//                 Sản phẩm
//               </TabsTrigger>
//               <TabsTrigger
//                 value="customers"
//                 className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
//               >
//                 Khách hàng
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           {/* OVERVIEW TAB */}
//           <TabsContent value="overview" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Revenue Chart */}
//               <Card className="lg:col-span-2 border-border shadow-xl glass-dark">
//                 <CardHeader className="border-b border-border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-foreground">
//                         Biểu đồ doanh thu
//                       </CardTitle>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Doanh thu theo tháng trong năm
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-brand-primary"
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       Chi tiết
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   {/* Custom Bar Chart */}
//                   <div className="space-y-4">
//                     <div className="flex items-end justify-between gap-2 h-64">
//                       {revenueData.map((data, index) => (
//                         <div
//                           key={index}
//                           className="flex-1 flex flex-col items-center gap-2"
//                         >
//                           <div className="w-full flex flex-col items-center justify-end h-full">
//                             <div className="relative w-full group">
//                               {/* Tooltip */}
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                                 <div className="bg-foreground text-background text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
//                                   <p className="font-semibold">
//                                     ₫{(data.revenue / 1000000).toFixed(1)}M
//                                   </p>
//                                   <p className="text-xs opacity-80">
//                                     {data.orders} đơn
//                                   </p>
//                                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
//                                 </div>
//                               </div>

//                               {/* Bar */}
//                               <div
//                                 className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-lg transition-all hover:from-brand-primary/80 hover:to-brand-secondary/80 cursor-pointer"
//                                 style={{
//                                   height: `${(data.revenue / maxRevenue) * 100}%`,
//                                   minHeight: "8px",
//                                 }}
//                               />
//                             </div>
//                           </div>
//                           <span className="text-xs text-muted-foreground font-medium">
//                             {data.month}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Legend */}
//                     <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary" />
//                         <span className="text-sm text-muted-foreground">
//                           Doanh thu
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-brand-success" />
//                         <span className="text-sm text-muted-foreground">
//                           Tăng trưởng dương
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Category Distribution */}
//               <Card className="border-border shadow-xl glass-dark">
//                 <CardHeader className="border-b border-border">
//                   <CardTitle className="text-foreground">
//                     Phân bổ danh mục
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Theo doanh thu
//                   </p>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     {categoryData.map((category, index) => (
//                       <div key={index} className="space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="font-medium text-foreground">
//                             {category.category}
//                           </span>
//                           <span className="text-muted-foreground">
//                             {category.percentage}%
//                           </span>
//                         </div>
//                         <div className="relative h-3 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className={`absolute inset-y-0 left-0 ${category.color} rounded-full transition-all`}
//                             style={{ width: `${category.percentage}%` }}
//                           />
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           ₫{(category.revenue / 1000000).toFixed(1)}M
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Total */}
//                   <div className="mt-6 pt-6 border-t border-border">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-foreground">
//                         Tổng doanh thu
//                       </span>
//                       <span className="text-lg font-bold text-brand-primary">
//                         ₫
//                         {(
//                           categoryData.reduce(
//                             (sum, cat) => sum + cat.revenue,
//                             0
//                           ) / 1000000
//                         ).toFixed(1)}
//                         M
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Growth Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <Card className="border-border shadow-md glass-dark">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-brand-success/10 rounded-xl">
//                       <TrendingUp className="w-6 h-6 text-brand-success" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm text-muted-foreground">
//                         Tăng trưởng doanh thu
//                       </p>
//                       <p className="text-2xl font-bold text-brand-success">
//                         +24.5%
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         So với cùng kỳ
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-border shadow-md glass-dark">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-brand-accent/10 rounded-xl">
//                       <Star className="w-6 h-6 text-brand-accent" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm text-muted-foreground">
//                         Tỷ lệ hoàn thành
//                       </p>
//                       <p className="text-2xl font-bold text-foreground">
//                         94.2%
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Đơn hàng thành công
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-border shadow-md glass-dark">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-brand-warning/10 rounded-xl">
//                       <Clock className="w-6 h-6 text-brand-warning" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm text-muted-foreground">
//                         Thời gian xử lý TB
//                       </p>
//                       <p className="text-2xl font-bold text-foreground">2.3h</p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Từ đặt đến giao
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* PRODUCTS TAB */}
//           <TabsContent value="products" className="space-y-6">
//             <Card className="border-border shadow-xl glass-dark">
//               <CardHeader className="border-b border-border">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle className="text-foreground">
//                       Sản phẩm bán chạy
//                     </CardTitle>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Top 5 sản phẩm có doanh thu cao nhất
//                     </p>
//                   </div>
//                   <Button variant="outline" size="sm" className="border-border">
//                     Xem tất cả
//                     <ArrowUpRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="divide-y divide-border">
//                   {topProducts.map((product, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-4 p-6 hover:bg-muted/50 transition-colors"
//                     >
//                       {/* Rank */}
//                       <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-bold">
//                         {index + 1}
//                       </div>

//                       {/* Product Info */}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-semibold text-foreground mb-1">
//                           {product.name}
//                         </h4>
//                         <p className="text-sm text-muted-foreground">
//                           Đã bán: {product.sold} sản phẩm
//                         </p>
//                       </div>

//                       {/* Revenue */}
//                       <div className="text-right">
//                         <p className="font-bold text-foreground">
//                           ₫{(product.revenue / 1000000).toFixed(1)}M
//                         </p>
//                         <div className="flex items-center justify-end gap-1 mt-1">
//                           {product.growth > 0 ? (
//                             <>
//                               <ArrowUpRight className="w-3 h-3 text-brand-success" />
//                               <span className="text-xs text-brand-success font-medium">
//                                 +{product.growth}%
//                               </span>
//                             </>
//                           ) : (
//                             <>
//                               <ArrowDownRight className="w-3 h-3 text-brand-error" />
//                               <span className="text-xs text-brand-error font-medium">
//                                 {product.growth}%
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* CUSTOMERS TAB */}
//           <TabsContent value="customers" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="border-border shadow-xl glass-dark">
//                 <CardHeader className="border-b border-border">
//                   <CardTitle className="text-foreground">
//                     Phân khúc khách hàng
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Theo tần suất mua hàng
//                   </p>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <div className="space-y-4">
//                     {[
//                       {
//                         label: "VIP (>20 đơn)",
//                         count: 142,
//                         percentage: 5,
//                         color: "bg-brand-primary",
//                       },
//                       {
//                         label: "Thân thiết (10-20 đơn)",
//                         count: 387,
//                         percentage: 14,
//                         color: "bg-brand-secondary",
//                       },
//                       {
//                         label: "Trung thành (5-9 đơn)",
//                         count: 856,
//                         percentage: 30,
//                         color: "bg-brand-accent",
//                       },
//                       {
//                         label: "Thông thường (<5 đơn)",
//                         count: 1462,
//                         percentage: 51,
//                         color: "bg-muted-foreground",
//                       },
//                     ].map((segment, index) => (
//                       <div key={index} className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-foreground">
//                             {segment.label}
//                           </span>
//                           <span className="text-sm text-muted-foreground">
//                             {segment.count} khách
//                           </span>
//                         </div>
//                         <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className={`absolute inset-y-0 left-0 ${segment.color} rounded-full`}
//                             style={{ width: `${segment.percentage}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-border shadow-xl glass-dark">
//                 <CardHeader className="border-b border-border">
//                   <CardTitle className="text-foreground">
//                     Độ hài lòng khách hàng
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Đánh giá trung bình
//                   </p>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <div className="text-center mb-6">
//                     <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 mb-4">
//                       <div className="text-center">
//                         <p className="text-4xl font-bold text-brand-primary">
//                           4.8
//                         </p>
//                         <div className="flex items-center justify-center gap-1 mt-2">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               className="w-4 h-4 fill-brand-warning text-brand-warning"
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       Dựa trên 2,847 đánh giá
//                     </p>
//                   </div>

//                   <div className="space-y-3">
//                     {[
//                       { stars: 5, count: 1876, percentage: 66 },
//                       { stars: 4, count: 683, percentage: 24 },
//                       { stars: 3, count: 199, percentage: 7 },
//                       { stars: 2, count: 57, percentage: 2 },
//                       { stars: 1, count: 32, percentage: 1 },
//                     ].map((rating) => (
//                       <div
//                         key={rating.stars}
//                         className="flex items-center gap-3"
//                       >
//                         <span className="text-xs text-muted-foreground w-8">
//                           {rating.stars} ⭐
//                         </span>
//                         <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-brand-warning rounded-full"
//                             style={{ width: `${rating.percentage}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-muted-foreground w-12 text-right">
//                           {rating.count}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }

'use client';

export const dynamic = 'force-dynamic';

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-foreground">
          Phân tích kinh doanh
        </h1>
        <p className="text-muted-foreground mt-1">
          Tổng quan hiệu suất và xu hướng phát triển
        </p>
      </main>
    </div>
  );
}