"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Video,
  Newspaper,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  Upload,
  Star,
  MessageSquare,
  Share2,
  BarChart3,
} from "lucide-react";

// Mock data
const contentStats = {
  totalPosts: 156,
  published: 98,
  draft: 42,
  archived: 16,
  totalViews: 45678,
  avgEngagement: 4.2,
  topCategory: "Cẩm nang pha chế",
};

const contents = [
  {
    id: "POST001",
    title: "10 Cách pha cà phê ngon tại nhà cho người mới bắt đầu",
    type: "article",
    category: "guide",
    status: "published",
    author: "Nguyễn Văn A",
    publishedDate: "2024-02-05 10:30",
    views: 2847,
    likes: 234,
    comments: 45,
    thumbnail: "/images/coffee-guide.jpg",
    featured: true,
    tags: ["pha chế", "người mới", "hướng dẫn"],
    excerpt: "Hướng dẫn chi tiết các phương pháp pha cà phê đơn giản, dễ thực hiện với dụng cụ có sẵn tại nhà...",
  },
  {
    id: "POST002",
    title: "Phân biệt Arabica và Robusta - Bí quyết chọn cà phê phù hợp",
    type: "article",
    category: "knowledge",
    status: "published",
    author: "Trần Thị B",
    publishedDate: "2024-02-04 14:20",
    views: 1923,
    likes: 187,
    comments: 32,
    thumbnail: "/images/arabica-robusta.jpg",
    featured: false,
    tags: ["kiến thức", "arabica", "robusta"],
    excerpt: "Tìm hiểu sự khác biệt giữa hai loại cà phê phổ biến nhất và cách lựa chọn phù hợp với khẩu vị...",
  },
  {
    id: "POST003",
    title: "Video: Nghệ thuật Latte Art cơ bản trong 5 phút",
    type: "video",
    category: "tutorial",
    status: "published",
    author: "Lê Văn C",
    publishedDate: "2024-02-03 09:15",
    views: 5432,
    likes: 456,
    comments: 78,
    thumbnail: "/images/latte-art.jpg",
    featured: true,
    tags: ["latte art", "video", "tutorial"],
    excerpt: "Học cách tạo những họa tiết cơ bản trên bề mặt cappuccino và latte một cách dễ dàng...",
  },
  {
    id: "POST004",
    title: "Tin tức: Triển lãm cà phê Việt Nam 2024",
    type: "news",
    category: "event",
    status: "published",
    author: "Phạm Thị D",
    publishedDate: "2024-02-02 16:45",
    views: 1234,
    likes: 98,
    comments: 15,
    thumbnail: "/images/exhibition.jpg",
    featured: false,
    tags: ["sự kiện", "triển lãm", "2024"],
    excerpt: "Sự kiện lớn nhất năm tại Hà Nội với hơn 200 gian hàng từ các nhà rang xay hàng đầu...",
  },
  {
    id: "POST005",
    title: "Bảo quản cà phê đúng cách để giữ nguyên hương vị",
    type: "article",
    category: "guide",
    status: "draft",
    author: "Hoàng Văn E",
    publishedDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "/images/storage.jpg",
    featured: false,
    tags: ["bảo quản", "hướng dẫn"],
    excerpt: "Những lưu ý quan trọng khi bảo quản cà phê hạt và cà phê bột để duy trì chất lượng tối ưu...",
  },
  {
    id: "POST006",
    title: "Review: Top 5 máy pha cà phê gia đình đáng mua nhất 2024",
    type: "review",
    category: "product",
    status: "published",
    author: "Vũ Thị F",
    publishedDate: "2024-02-01 11:30",
    views: 3876,
    likes: 312,
    comments: 67,
    thumbnail: "/images/coffee-machine.jpg",
    featured: true,
    tags: ["review", "máy pha", "2024"],
    excerpt: "Đánh giá chi tiết 5 dòng máy pha cà phê được ưa chuộng nhất với đầy đủ ưu nhược điểm...",
  },
  {
    id: "POST007",
    title: "Câu chuyện về nguồn gốc cà phê Ethiopia",
    type: "blog",
    category: "story",
    status: "draft",
    author: "Đặng Văn G",
    publishedDate: null,
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "/images/ethiopia.jpg",
    featured: false,
    tags: ["câu chuyện", "ethiopia", "nguồn gốc"],
    excerpt: "Hành trình khám phá vùng đất được coi là cái nôi của cà phê trên thế giới...",
  },
  {
    id: "POST008",
    title: "Infographic: Các loại cà phê phổ biến tại Việt Nam",
    type: "infographic",
    category: "knowledge",
    status: "published",
    author: "Bùi Thị H",
    publishedDate: "2024-01-30 15:00",
    views: 2156,
    likes: 198,
    comments: 23,
    thumbnail: "/images/infographic.jpg",
    featured: false,
    tags: ["infographic", "việt nam", "kiến thức"],
    excerpt: "Hình ảnh minh họa trực quan về các loại cà phê được yêu thích nhất tại Việt Nam...",
  },
  {
    id: "POST009",
    title: "Cold Brew vs Iced Coffee: Đâu là sự khác biệt?",
    type: "article",
    category: "knowledge",
    status: "archived",
    author: "Nguyễn Văn A",
    publishedDate: "2024-01-15 10:00",
    views: 4521,
    likes: 367,
    comments: 89,
    thumbnail: "/images/cold-brew.jpg",
    featured: false,
    tags: ["cold brew", "iced coffee", "kiến thức"],
    excerpt: "Phân tích chi tiết sự khác biệt giữa hai phương pháp pha cà phê lạnh phổ biến...",
  },
];

const typeConfig = {
  article: { label: "Bài viết", icon: FileText, color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
  video: { label: "Video", icon: Video, color: "bg-brand-error/10 text-brand-error border-brand-error/20" },
  news: { label: "Tin tức", icon: Newspaper, color: "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20" },
  review: { label: "Review", icon: Star, color: "bg-brand-warning/10 text-brand-warning border-brand-warning/20" },
  blog: { label: "Blog", icon: BookOpen, color: "bg-brand-accent/10 text-brand-accent border-brand-accent/20" },
  infographic: { label: "Infographic", icon: ImageIcon, color: "bg-brand-success/10 text-brand-success border-brand-success/20" },
};

const categoryLabels = {
  guide: "Cẩm nang pha chế",
  knowledge: "Kiến thức cà phê",
  tutorial: "Hướng dẫn",
  event: "Sự kiện",
  product: "Sản phẩm",
  story: "Câu chuyện",
};

const statusConfig = {
  published: { label: "Đã xuất bản", color: "bg-brand-success/10 text-brand-success border-brand-success/20", icon: CheckCircle2 },
  draft: { label: "Bản nháp", color: "bg-brand-warning/10 text-brand-warning border-brand-warning/20", icon: Edit },
  archived: { label: "Lưu trữ", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter contents
  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || content.type === filterType;
    const matchesCategory = filterCategory === "all" || content.category === filterCategory;
    const matchesStatus = filterStatus === "all" || content.status === filterStatus;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && content.status === "published") ||
      (activeTab === "draft" && content.status === "draft") ||
      (activeTab === "featured" && content.featured);

    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesTab;
  });

  const handleEdit = (content: any) => {
    console.log("Edit content:", content.id);
    // Navigate to edit page
  };

  const handleDelete = (content: any) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete content:", selectedContent?.id);
    setDeleteDialogOpen(false);
    // API call here
  };

  const handleViewDetail = (content: any) => {
    setSelectedContent(content);
    setDetailDialogOpen(true);
  };

  const handleDuplicate = (content: any) => {
    console.log("Duplicate content:", content.id);
    // API call here
  };

  const handleToggleStatus = (content: any) => {
    console.log("Toggle status:", content.id);
    // API call here
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Quản lý nội dung
                </h1>
                <p className="text-muted-foreground mt-1">
                  Tạo, chỉnh sửa và quản lý nội dung website
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted border-border"
              >
                <Download className="w-4 h-4" />
                Xuất dữ liệu
              </Button>

              <Button
                variant="outline"
                className="gap-2 bg-card hover:bg-muted border-border"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>

              <Button className="gap-2 bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30">
                <Plus className="w-4 h-4" />
                Tạo nội dung mới
              </Button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <p className="text-sm text-muted-foreground">Tổng số</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{contentStats.totalPosts}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                    <p className="text-sm text-muted-foreground">Đã xuất bản</p>
                  </div>
                  <p className="text-3xl font-bold text-brand-success">{contentStats.published}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Edit className="w-4 h-4 text-brand-warning" />
                    <p className="text-sm text-muted-foreground">Bản nháp</p>
                  </div>
                  <p className="text-3xl font-bold text-brand-warning">{contentStats.draft}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-brand-accent" />
                    <p className="text-sm text-muted-foreground">Lượt xem</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {(contentStats.totalViews / 1000).toFixed(1)}K
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-brand-warning" />
                    <p className="text-sm text-muted-foreground">Tương tác TB</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{contentStats.avgEngagement}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md glass-dark">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-brand-success" />
                    <p className="text-sm text-muted-foreground">Top danh mục</p>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight mt-2">
                    {contentStats.topCategory}
                  </p>
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
                  placeholder="Tìm kiếm theo tiêu đề, tác giả, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px] bg-card border-border">
                    <SelectValue placeholder="Loại nội dung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="article">Bài viết</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="news">Tin tức</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="infographic">Infographic</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="guide">Cẩm nang pha chế</SelectItem>
                    <SelectItem value="knowledge">Kiến thức cà phê</SelectItem>
                    <SelectItem value="tutorial">Hướng dẫn</SelectItem>
                    <SelectItem value="event">Sự kiện</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="story">Câu chuyện</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] bg-card border-border">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* TABS & CONTENT */}
        <Card className="border-border shadow-xl glass-dark">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border px-6 bg-muted/20">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Tất cả ({contents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Đã xuất bản ({contents.filter(c => c.status === "published").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="draft"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      Bản nháp
                      <Badge className="bg-brand-warning hover:bg-brand-warning/90">
                        {contents.filter(c => c.status === "draft").length}
                      </Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Nổi bật ({contents.filter(c => c.featured).length})
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {filteredContents.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-foreground font-medium">Không tìm thấy nội dung nào</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm khác
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredContents.map((content) => {
                      const TypeIcon = typeConfig[content.type as keyof typeof typeConfig].icon;
                      const StatusIcon = statusConfig[content.status as keyof typeof statusConfig].icon;

                      return (
                        <Card
                          key={content.id}
                          className="border-border shadow-md hover:shadow-xl transition-all group overflow-hidden"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent z-10" />
                            
                            {/* Featured Star */}
                            {content.featured && (
                              <div className="absolute top-3 left-3 z-20">
                                <Badge className="bg-brand-warning hover:bg-brand-warning/90 gap-1">
                                  <Star className="w-3 h-3" />
                                  Nổi bật
                                </Badge>
                              </div>
                            )}

                            {/* Type Badge */}
                            <div className="absolute top-3 right-3 z-20">
                              <Badge className={typeConfig[content.type as keyof typeof typeConfig].color}>
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {typeConfig[content.type as keyof typeof typeConfig].label}
                              </Badge>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute bottom-3 left-3 z-20">
                              <Badge className={statusConfig[content.status as keyof typeof statusConfig].color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[content.status as keyof typeof statusConfig].label}
                              </Badge>
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute bottom-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewDetail(content)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEdit(content)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Placeholder Image */}
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                              <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                            </div>
                          </div>

                          <CardContent className="p-4">
                            {/* Title */}
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[3rem]">
                              {content.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {content.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <User className="w-3 h-3" />
                                <span>{content.author}</span>
                              </div>

                              {content.publishedDate && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>{content.publishedDate}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Tag className="w-3 h-3" />
                                <span>{categoryLabels[content.category as keyof typeof categoryLabels]}</span>
                              </div>
                            </div>

                            {/* Stats */}
                            {content.status === "published" && (
                              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{content.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  <span>{content.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{content.comments}</span>
                                </div>
                              </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {content.tags.slice(0, 3).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-border"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-border"
                                onClick={() => handleEdit(content)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border"
                                onClick={() => handleDuplicate(content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-brand-error hover:text-brand-error"
                                onClick={() => handleDelete(content)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
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
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">
                      {selectedContent.title}
                    </DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-border">
                        {selectedContent.id}
                      </Badge>
                      <Badge className={typeConfig[selectedContent.type as keyof typeof typeConfig].color}>
                        {typeConfig[selectedContent.type as keyof typeof typeConfig].label}
                      </Badge>
                      <Badge className={statusConfig[selectedContent.status as keyof typeof statusConfig].color}>
                        {statusConfig[selectedContent.status as keyof typeof statusConfig].label}
                      </Badge>
                      {selectedContent.featured && (
                        <Badge className="bg-brand-warning hover:bg-brand-warning/90">
                          <Star className="w-3 h-3 mr-1" />
                          Nổi bật
                        </Badge>
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Thumbnail */}
                <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                    <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <User className="w-4 h-4" />
                        Tác giả
                      </div>
                      <p className="font-medium">{selectedContent.author}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Tag className="w-4 h-4" />
                        Danh mục
                      </div>
                      <p className="font-medium">
                        {categoryLabels[selectedContent.category as keyof typeof categoryLabels]}
                      </p>
                    </CardContent>
                  </Card>

                  {selectedContent.publishedDate && (
                    <Card className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          Ngày xuất bản
                        </div>
                        <p className="font-medium">{selectedContent.publishedDate}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedContent.status === "published" && (
                    <Card className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <BarChart3 className="w-4 h-4" />
                          Thống kê
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span>{selectedContent.views} views</span>
                          <span>•</span>
                          <span>{selectedContent.likes} likes</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Excerpt */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Mô tả ngắn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedContent.excerpt}</p>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-border"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailDialogOpen(false)}
                  className="border-border"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => handleEdit(selectedContent)}
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nội dung</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa "{selectedContent?.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-border"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-brand-error hover:bg-brand-error/90"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}