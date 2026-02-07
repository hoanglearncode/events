"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Eye,
  MoreVertical,
  Send,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
} from "lucide-react";

// Mock data
const complaintStats = {
  total: 247,
  pending: 82,
  inProgress: 45,
  resolved: 98,
  rejected: 22,
  avgResponseTime: "2.4h",
  resolutionRate: 85,
};

const complaints = [
  {
    id: "CP001",
    title: "Sản phẩm giao sai màu",
    customer: "Nguyễn Văn A",
    category: "product",
    priority: "high",
    status: "pending",
    createdAt: "2024-02-07 09:30",
    description: "Đặt hàng màu nâu nhưng nhận được màu đen, yêu cầu đổi trả",
    orderCode: "ORD-2024-0245",
    unread: true,
    messages: 3,
  },
  {
    id: "CP002",
    title: "Giao hàng trễ hơn 3 ngày",
    customer: "Trần Thị B",
    category: "delivery",
    priority: "medium",
    status: "inProgress",
    createdAt: "2024-02-06 14:20",
    description: "Đơn hàng cam kết 2 ngày nhưng đã 5 ngày vẫn chưa nhận được",
    orderCode: "ORD-2024-0189",
    unread: false,
    messages: 7,
  },
  {
    id: "CP003",
    title: "Chất lượng cà phê không đúng mô tả",
    customer: "Lê Văn C",
    category: "quality",
    priority: "high",
    status: "pending",
    createdAt: "2024-02-06 11:15",
    description: "Cà phê Arabica nhưng hương vị giống Robusta, nghi ngờ hàng kém chất lượng",
    orderCode: "ORD-2024-0201",
    unread: true,
    messages: 2,
  },
  {
    id: "CP004",
    title: "Hoàn tiền chậm trễ",
    customer: "Phạm Thị D",
    category: "payment",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-02-05 16:45",
    description: "Đã hủy đơn từ 10 ngày trước nhưng chưa nhận được tiền hoàn",
    orderCode: "ORD-2024-0156",
    unread: false,
    messages: 12,
  },
  {
    id: "CP005",
    title: "Bao bì sản phẩm bị rách",
    customer: "Hoàng Văn E",
    category: "packaging",
    priority: "low",
    status: "inProgress",
    createdAt: "2024-02-05 10:30",
    description: "Bao bì bị rách, cà phê bị tràn ra ngoài",
    orderCode: "ORD-2024-0178",
    unread: false,
    messages: 5,
  },
  {
    id: "CP006",
    title: "Nhân viên hỗ trợ thái độ không tốt",
    customer: "Vũ Thị F",
    category: "service",
    priority: "medium",
    status: "pending",
    createdAt: "2024-02-04 13:20",
    description: "Nhân viên tư vấn qua chat có thái độ thiếu chuyên nghiệp",
    orderCode: "N/A",
    unread: true,
    messages: 1,
  },
  {
    id: "CP007",
    title: "Website lỗi khi thanh toán",
    customer: "Đặng Văn G",
    category: "technical",
    priority: "high",
    status: "resolved",
    createdAt: "2024-02-04 09:00",
    description: "Thanh toán bị trừ tiền nhưng đơn hàng không được tạo",
    orderCode: "N/A",
    unread: false,
    messages: 8,
  },
  {
    id: "CP008",
    title: "Sản phẩm hết hạn sử dụng",
    customer: "Bùi Thị H",
    category: "quality",
    priority: "high",
    status: "rejected",
    createdAt: "2024-02-03 15:30",
    description: "Nhận được cà phê hết hạn từ 2 tháng trước",
    orderCode: "ORD-2024-0134",
    unread: false,
    messages: 15,
  },
];

const categoryLabels = {
  product: "Sản phẩm",
  delivery: "Giao hàng",
  quality: "Chất lượng",
  payment: "Thanh toán",
  packaging: "Đóng gói",
  service: "Dịch vụ",
  technical: "Kỹ thuật",
};

const priorityConfig = {
  high: { label: "Cao", color: "bg-brand-error/10 text-brand-error border-brand-error/20" },
  medium: { label: "Trung bình", color: "bg-brand-warning/10 text-brand-warning border-brand-warning/20" },
  low: { label: "Thấp", color: "bg-brand-accent/10 text-brand-accent border-brand-accent/20" },
};

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-brand-warning/10 text-brand-warning border-brand-warning/20", icon: Clock },
  inProgress: { label: "Đang xử lý", color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20", icon: MessageSquare },
  resolved: { label: "Đã giải quyết", color: "bg-brand-success/10 text-brand-success border-brand-success/20", icon: CheckCircle2 },
  rejected: { label: "Từ chối", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

export default function ComplaintsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.orderCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && complaint.status === "pending") ||
      (activeTab === "inProgress" && complaint.status === "inProgress") ||
      (activeTab === "resolved" && complaint.status === "resolved");

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTab;
  });

  const handleViewDetail = (complaint: any) => {
    setSelectedComplaint(complaint);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    console.log("Update status to:", newStatus);
    // API call here
  };

  const handleSendResponse = () => {
    console.log("Send response:", responseText);
    setResponseText("");
    // API call here
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-brand-error to-brand-warning rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Quản lý khiếu nại
                </h1>
                <p className="text-muted-foreground mt-1">
                  Theo dõi và xử lý khiếu nại từ khách hàng
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted border-border"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Tổng số</p>
                  <p className="text-3xl font-bold text-foreground">{complaintStats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Chờ xử lý</p>
                  <p className="text-3xl font-bold text-brand-warning">{complaintStats.pending}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Đang xử lý</p>
                  <p className="text-3xl font-bold text-brand-primary">{complaintStats.inProgress}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Đã giải quyết</p>
                  <p className="text-3xl font-bold text-brand-success">{complaintStats.resolved}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Tỷ lệ giải quyết</p>
                  <p className="text-3xl font-bold text-brand-success">{complaintStats.resolutionRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Thời gian TB</p>
                  <p className="text-3xl font-bold text-foreground">{complaintStats.avgResponseTime}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <Card className="border-border shadow-xl glass-dark mb-6">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khiếu nại, khách hàng, mã đơn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px] bg-card border-border">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="inProgress">Đang xử lý</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[160px] bg-card border-border">
                    <SelectValue placeholder="Độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[160px] bg-card border-border">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="delivery">Giao hàng</SelectItem>
                    <SelectItem value="quality">Chất lượng</SelectItem>
                    <SelectItem value="payment">Thanh toán</SelectItem>
                    <SelectItem value="packaging">Đóng gói</SelectItem>
                    <SelectItem value="service">Dịch vụ</SelectItem>
                    <SelectItem value="technical">Kỹ thuật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* TABS & LIST */}
        <Card className="border-border shadow-xl glass-dark">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border px-6 bg-muted/20">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Tất cả ({complaints.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      Chờ xử lý
                      <Badge className="bg-brand-warning hover:bg-brand-warning/90">
                        {complaints.filter((c) => c.status === "pending").length}
                      </Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="inProgress"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Đang xử lý ({complaints.filter((c) => c.status === "inProgress").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="resolved"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Đã giải quyết ({complaints.filter((c) => c.status === "resolved").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {filteredComplaints.length === 0 ? (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-foreground font-medium">Không tìm thấy khiếu nại nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm khác
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredComplaints.map((complaint) => {
                      const StatusIcon = statusConfig[complaint.status as keyof typeof statusConfig].icon;
                      
                      return (
                        <div
                          key={complaint.id}
                          className="flex items-start gap-4 p-5 hover:bg-muted/50 transition-all cursor-pointer"
                          onClick={() => handleViewDetail(complaint)}
                        >
                          {/* Status Icon */}
                          <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${statusConfig[complaint.status as keyof typeof statusConfig].color}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-foreground">
                                  {complaint.title}
                                </h3>
                                {complaint.unread && (
                                  <span className="w-2 h-2 rounded-full bg-brand-error animate-pulse" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {complaint.id}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {complaint.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant="outline" className="border-border">
                                <User className="w-3 h-3 mr-1" />
                                {complaint.customer}
                              </Badge>

                              <Badge variant="outline" className="border-border">
                                <Tag className="w-3 h-3 mr-1" />
                                {categoryLabels[complaint.category as keyof typeof categoryLabels]}
                              </Badge>

                              <Badge className={priorityConfig[complaint.priority as keyof typeof priorityConfig].color}>
                                {priorityConfig[complaint.priority as keyof typeof priorityConfig].label}
                              </Badge>

                              {complaint.orderCode !== "N/A" && (
                                <Badge variant="outline" className="border-border">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {complaint.orderCode}
                                </Badge>
                              )}

                              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                <Calendar className="w-3 h-3" />
                                {complaint.createdAt}
                              </div>

                              {complaint.messages > 0 && (
                                <div className="flex items-center gap-1 text-xs text-brand-primary">
                                  <MessageSquare className="w-3 h-3" />
                                  {complaint.messages}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(complaint);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* DETAIL DIALOG */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">
                      {selectedComplaint.title}
                    </DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-border">
                        {selectedComplaint.id}
                      </Badge>
                      <Badge className={statusConfig[selectedComplaint.status as keyof typeof statusConfig].color}>
                        {statusConfig[selectedComplaint.status as keyof typeof statusConfig].label}
                      </Badge>
                      <Badge className={priorityConfig[selectedComplaint.priority as keyof typeof priorityConfig].color}>
                        Ưu tiên: {priorityConfig[selectedComplaint.priority as keyof typeof priorityConfig].label}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Customer Info */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedComplaint.customer}</span>
                    </div>
                    {selectedComplaint.orderCode !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Mã đơn hàng: {selectedComplaint.orderCode}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Ngày tạo: {selectedComplaint.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Danh mục: {categoryLabels[selectedComplaint.category as keyof typeof categoryLabels]}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Nội dung khiếu nại
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedComplaint.description}</p>
                  </CardContent>
                </Card>

                {/* Status Update */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Cập nhật trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      defaultValue={selectedComplaint.status}
                      onValueChange={handleUpdateStatus}
                    >
                      <SelectTrigger className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="inProgress">Đang xử lý</SelectItem>
                        <SelectItem value="resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Response */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Phản hồi khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Nhập nội dung phản hồi..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="min-h-[120px] bg-card border-border"
                    />
                    <Button
                      onClick={handleSendResponse}
                      className="w-full gap-2 bg-brand-primary hover:bg-brand-primary/90"
                      disabled={!responseText.trim()}
                    >
                      <Send className="w-4 h-4" />
                      Gửi phản hồi
                    </Button>
                  </CardContent>
                </Card>

                {/* Message History */}
                {selectedComplaint.messages > 0 && (
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Lịch sử trao đổi ({selectedComplaint.messages} tin nhắn)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">
                        Hiển thị lịch sử trao đổi ở đây...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailDialogOpen(false)}
                  className="border-border"
                >
                  Đóng
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}