"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  User,
  Tag,
  Upload,
  Image as ImageIcon,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Share2,
  ExternalLink,
  Edit
} from "lucide-react";

// Mock initial data (would come from API based on [id])
const initialPostData = {
  id: "POST001",
  title: "10 Cách pha cà phê ngon tại nhà cho người mới bắt đầu",
  slug: "10-cach-pha-ca-phe-ngon-tai-nha",
  type: "article",
  category: "guide",
  status: "published",
  author: {
    id: "USER001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/avatars/user1.jpg",
  },
  content: `<h2>Giới thiệu</h2>
<p>Pha chế cà phê tại nhà không còn quá khó khăn nếu bạn nắm vững các phương pháp cơ bản. Trong bài viết này, chúng tôi sẽ chia sẻ 10 cách pha cà phê đơn giản nhất dành cho người mới bắt đầu.</p>

<h2>1. Cà phê phin truyền thống</h2>
<p>Đây là phương pháp truyền thống và phổ biến nhất tại Việt Nam. Bạn chỉ cần phin nhôm hoặc inox, cà phê bột và nước nóng...</p>

<h2>2. Cà phê French Press</h2>
<p>French Press là công cụ đơn giản nhưng cho ra ly cà phê đậm đà, giữ nguyên hương vị tự nhiên của hạt cà phê...</p>`,
  excerpt: "Hướng dẫn chi tiết các phương pháp pha cà phê đơn giản, dễ thực hiện với dụng cụ có sẵn tại nhà...",
  thumbnail: "/images/coffee-guide.jpg",
  thumbnailAlt: "Hướng dẫn pha cà phê",
  featured: true,
  tags: ["pha chế", "người mới", "hướng dẫn", "cà phê tại nhà"],
  metaTitle: "10 Cách pha cà phê ngon cho người mới bắt đầu | Coffee Blog",
  metaDescription: "Khám phá 10 phương pháp pha cà phê tại nhà đơn giản, dễ thực hiện. Hướng dẫn chi tiết từng bước cho người mới bắt đầu.",
  metaKeywords: "pha cà phê, cách pha cà phê, cà phê tại nhà, hướng dẫn pha chế",
  publishedAt: "2024-02-05 10:30:00",
  createdAt: "2024-02-04 15:20:00",
  updatedAt: "2024-02-06 09:15:00",
  scheduledAt: null,
  stats: {
    views: 2847,
    likes: 234,
    comments: 45,
    shares: 67,
    avgTimeOnPage: "4m 32s",
  },
  seo: {
    score: 85,
    readability: "Good",
    keywordDensity: 2.3,
  },
};

const typeOptions = [
  { value: "article", label: "Bài viết", icon: FileText },
  { value: "video", label: "Video", icon: FileText },
  { value: "news", label: "Tin tức", icon: FileText },
  { value: "review", label: "Review", icon: FileText },
  { value: "blog", label: "Blog", icon: FileText },
  { value: "infographic", label: "Infographic", icon: FileText },
];

const categoryOptions = [
  { value: "guide", label: "Cẩm nang pha chế" },
  { value: "knowledge", label: "Kiến thức cà phê" },
  { value: "tutorial", label: "Hướng dẫn" },
  { value: "event", label: "Sự kiện" },
  { value: "product", label: "Sản phẩm" },
  { value: "story", label: "Câu chuyện" },
];

const statusOptions = [
  { value: "draft", label: "Bản nháp", color: "bg-brand-warning/10 text-brand-warning border-brand-warning/20" },
  { value: "published", label: "Đã xuất bản", color: "bg-brand-success/10 text-brand-success border-brand-success/20" },
  { value: "scheduled", label: "Đã lên lịch", color: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
  { value: "archived", label: "Lưu trữ", color: "bg-muted text-muted-foreground border-border" },
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState(initialPostData);
  const [tagInput, setTagInput] = useState("");

  // Simulate loading data
  useEffect(() => {
    // In real app, fetch data based on params.id
    console.log("Loading post:", params.id);
  }, [params.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
      setHasChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
    setHasChanges(true);
  };

  const handleSave = async (saveType: 'draft' | 'publish' | 'schedule') => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Saving post:", saveType, formData);
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    console.log("Deleting post:", formData.id);
    setDeleteDialogOpen(false);
    // Navigate back after delete
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${formData.slug}`;
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  const getSEOScore = () => {
    const score = formData.seo.score;
    if (score >= 80) return { color: "text-brand-success", label: "Tốt" };
    if (score >= 60) return { color: "text-brand-warning", label: "Trung bình" };
    return { color: "text-brand-error", label: "Cần cải thiện" };
  };

  const seoScore = getSEOScore();

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-md">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>

              <div className="h-6 w-px bg-border" />

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-foreground">
                    {formData.title || "Bài viết mới"}
                  </h1>
                  {hasChanges && (
                    <Badge variant="outline" className="border-brand-warning text-brand-warning">
                      Chưa lưu
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  ID: {formData.id} • Tác giả: {formData.author.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="gap-2 border-border"
              >
                {previewMode ? (
                  <>
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Xem trước
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 border-border"
              >
                <Copy className="w-4 h-4" />
                Copy link
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={isSaving || !hasChanges}
                className="gap-2 border-border"
              >
                <Save className="w-4 h-4" />
                Lưu nháp
              </Button>

              <Button
                size="sm"
                onClick={() => handleSave('publish')}
                disabled={isSaving}
                className="gap-2 bg-brand-primary hover:bg-brand-primary/90"
              >
                {isSaving ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Xuất bản
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {previewMode ? (
              /* PREVIEW MODE */
              <Card className="border-border shadow-xl glass-dark">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusOptions.find(s => s.value === formData.status)?.color}>
                      {statusOptions.find(s => s.value === formData.status)?.label}
                    </Badge>
                    {formData.featured && (
                      <Badge className="bg-brand-warning hover:bg-brand-warning/90">
                        <Star className="w-3 h-3 mr-1" />
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl">{formData.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {formData.author.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formData.publishedAt || "Chưa xuất bản"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {categoryOptions.find(c => c.value === formData.category)?.label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {formData.thumbnail && (
                    <div className="relative h-96 bg-muted rounded-lg overflow-hidden mb-6">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                        <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-border">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* EDIT MODE */
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <Card className="border-border shadow-xl glass-dark">
                  <CardHeader className="border-b border-border bg-muted/30">
                    <TabsList className="bg-transparent h-12 w-full justify-start">
                      <TabsTrigger
                        value="content"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Nội dung
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </TabsTrigger>
                      <TabsTrigger
                        value="seo"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        SEO
                      </TabsTrigger>
                      <TabsTrigger
                        value="analytics"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Thống kê
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* CONTENT TAB */}
                    <TabsContent value="content" className="space-y-6 mt-0">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-semibold">
                          Tiêu đề bài viết *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Nhập tiêu đề bài viết..."
                          className="text-lg bg-card border-border"
                        />
                      </div>

                      {/* Slug */}
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-base font-semibold">
                          Đường dẫn (Slug)
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">/posts/</span>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            placeholder="duong-dan-bai-viet"
                            className="bg-card border-border"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-base font-semibold">
                          Mô tả ngắn
                        </Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          placeholder="Nhập mô tả ngắn cho bài viết..."
                          className="min-h-[80px] bg-card border-border"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.excerpt.length}/160 ký tự
                        </p>
                      </div>

                      {/* Content Editor */}
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-base font-semibold">
                          Nội dung bài viết *
                        </Label>
                        <div className="border border-border rounded-lg bg-card">
                          <div className="border-b border-border p-2 flex items-center gap-2 bg-muted/30">
                            <Button variant="ghost" size="sm" className="h-8">
                              <strong>B</strong>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <em>I</em>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <u>U</u>
                            </Button>
                            <div className="h-6 w-px bg-border" />
                            <Button variant="ghost" size="sm" className="h-8">
                              H1
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              H2
                            </Button>
                            <div className="h-6 w-px bg-border" />
                            <Button variant="ghost" size="sm" className="h-8">
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="Nhập nội dung bài viết..."
                            className="min-h-[400px] border-0 focus-visible:ring-0 bg-card"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Gợi ý: Sử dụng rich text editor như CKEditor hoặc TinyMCE để có trải nghiệm tốt hơn
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <Label htmlFor="tags" className="text-base font-semibold">
                          Tags
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Nhập tag và nhấn Enter..."
                            className="bg-card border-border"
                          />
                          <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="outline"
                            className="border-border"
                          >
                            Thêm
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-border gap-2 cursor-pointer hover:bg-muted"
                            >
                              #{tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* SETTINGS TAB */}
                    <TabsContent value="settings" className="space-y-6 mt-0">
                      {/* Type & Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-base font-semibold">
                            Loại nội dung *
                          </Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => handleInputChange('type', value)}
                          >
                            <SelectTrigger className="bg-card border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {typeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-base font-semibold">
                            Danh mục *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange('category', value)}
                          >
                            <SelectTrigger className="bg-card border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-base font-semibold">
                          Trạng thái
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Featured Toggle */}
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                        <div className="space-y-0.5">
                          <Label htmlFor="featured" className="text-base font-semibold cursor-pointer">
                            Bài viết nổi bật
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị bài viết này ở vị trí nổi bật
                          </p>
                        </div>
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => handleInputChange('featured', checked)}
                        />
                      </div>

                      {/* Thumbnail */}
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">
                          Ảnh đại diện
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-card">
                          {formData.thumbnail ? (
                            <div className="space-y-4">
                              <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="sm" className="border-border">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Thay đổi
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleInputChange('thumbnail', '')}
                                  className="border-border text-brand-error hover:text-brand-error"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                  Tải ảnh lên hoặc kéo thả vào đây
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, GIF tới 10MB
                                </p>
                              </div>
                              <Button variant="outline" className="border-border">
                                Chọn ảnh
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Thumbnail Alt */}
                      {formData.thumbnail && (
                        <div className="space-y-2">
                          <Label htmlFor="thumbnailAlt" className="text-base font-semibold">
                            Mô tả ảnh (Alt text)
                          </Label>
                          <Input
                            id="thumbnailAlt"
                            value={formData.thumbnailAlt}
                            onChange={(e) => handleInputChange('thumbnailAlt', e.target.value)}
                            placeholder="Mô tả ảnh cho SEO và accessibility..."
                            className="bg-card border-border"
                          />
                        </div>
                      )}

                      {/* Scheduled Date */}
                      {formData.status === 'scheduled' && (
                        <div className="space-y-2">
                          <Label htmlFor="scheduledAt" className="text-base font-semibold">
                            Lên lịch xuất bản
                          </Label>
                          <Input
                            id="scheduledAt"
                            type="datetime-local"
                            value={formData.scheduledAt || ''}
                            onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                            className="bg-card border-border"
                          />
                        </div>
                      )}
                    </TabsContent>

                    {/* SEO TAB */}
                    <TabsContent value="seo" className="space-y-6 mt-0">
                      {/* SEO Score */}
                      <Card className="border-border bg-muted/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">Điểm SEO</h3>
                              <p className="text-sm text-muted-foreground">
                                Đánh giá tổng quan về SEO của bài viết
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-4xl font-bold ${seoScore.color}`}>
                                {formData.seo.score}
                              </div>
                              <p className={`text-sm ${seoScore.color}`}>{seoScore.label}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Độ dễ đọc</span>
                              <span className="font-medium">{formData.seo.readability}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Mật độ từ khóa</span>
                              <span className="font-medium">{formData.seo.keywordDensity}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Meta Title */}
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle" className="text-base font-semibold">
                          Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          value={formData.metaTitle}
                          onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                          placeholder="Tiêu đề hiển thị trên Google..."
                          className="bg-card border-border"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.metaTitle.length}/60 ký tự (tối ưu: 50-60)
                        </p>
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-2">
                        <Label htmlFor="metaDescription" className="text-base font-semibold">
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          value={formData.metaDescription}
                          onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                          placeholder="Mô tả hiển thị trên Google..."
                          className="min-h-[100px] bg-card border-border"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.metaDescription.length}/160 ký tự (tối ưu: 150-160)
                        </p>
                      </div>

                      {/* Meta Keywords */}
                      <div className="space-y-2">
                        <Label htmlFor="metaKeywords" className="text-base font-semibold">
                          Meta Keywords
                        </Label>
                        <Input
                          id="metaKeywords"
                          value={formData.metaKeywords}
                          onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                          placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                          className="bg-card border-border"
                        />
                      </div>

                      {/* Preview */}
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">
                          Preview trên Google
                        </Label>
                        <Card className="border-border bg-card">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <ExternalLink className="w-3 h-3" />
                              <span>https://yourdomain.com/posts/{formData.slug}</span>
                            </div>
                            <h3 className="text-brand-primary text-lg font-medium hover:underline cursor-pointer">
                              {formData.metaTitle || formData.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formData.metaDescription || formData.excerpt}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* ANALYTICS TAB */}
                    <TabsContent value="analytics" className="space-y-6 mt-0">
                      {formData.status === 'published' ? (
                        <>
                          {/* Stats Overview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="border-border bg-muted/30">
                              <CardContent className="p-4 text-center">
                                <Eye className="w-6 h-6 text-brand-primary mx-auto mb-2" />
                                <p className="text-2xl font-bold text-foreground">
                                  {formData.stats.views.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">Lượt xem</p>
                              </CardContent>
                            </Card>

                            <Card className="border-border bg-muted/30">
                              <CardContent className="p-4 text-center">
                                <Star className="w-6 h-6 text-brand-warning mx-auto mb-2" />
                                <p className="text-2xl font-bold text-foreground">
                                  {formData.stats.likes}
                                </p>
                                <p className="text-xs text-muted-foreground">Lượt thích</p>
                              </CardContent>
                            </Card>

                            <Card className="border-border bg-muted/30">
                              <CardContent className="p-4 text-center">
                                <MessageSquare className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                                <p className="text-2xl font-bold text-foreground">
                                  {formData.stats.comments}
                                </p>
                                <p className="text-xs text-muted-foreground">Bình luận</p>
                              </CardContent>
                            </Card>

                            <Card className="border-border bg-muted/30">
                              <CardContent className="p-4 text-center">
                                <Share2 className="w-6 h-6 text-brand-success mx-auto mb-2" />
                                <p className="text-2xl font-bold text-foreground">
                                  {formData.stats.shares}
                                </p>
                                <p className="text-xs text-muted-foreground">Chia sẻ</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Engagement */}
                          <Card className="border-border bg-muted/30">
                            <CardHeader>
                              <CardTitle className="text-base">Tương tác</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Thời gian đọc trung bình
                                </span>
                                <span className="font-semibold text-foreground">
                                  {formData.stats.avgTimeOnPage}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Tỷ lệ tương tác
                                </span>
                                <span className="font-semibold text-brand-success">
                                  {((formData.stats.likes + formData.stats.comments + formData.stats.shares) / formData.stats.views * 100).toFixed(1)}%
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Placeholder for charts */}
                          <Card className="border-border bg-muted/30">
                            <CardHeader>
                              <CardTitle className="text-base">Lượt xem theo thời gian</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64 flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">Biểu đồ lượt xem sẽ hiển thị ở đây</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card className="border-border bg-muted/30">
                          <CardContent className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-foreground font-medium mb-2">
                              Chưa có dữ liệu thống kê
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Xuất bản bài viết để xem thống kê chi tiết
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            )}
          </div>

          {/* SIDEBAR - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <Card className="border-border shadow-md glass-dark">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Thông tin tác giả</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-semibold">
                    {formData.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{formData.author.name}</p>
                    <p className="text-xs text-muted-foreground">{formData.author.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngày tạo</span>
                    <span className="text-foreground">{formData.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cập nhật</span>
                    <span className="text-foreground">{formData.updatedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border shadow-md glass-dark">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-border"
                  onClick={() => window.open(`/posts/${formData.slug}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Xem bài viết
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-border"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                  Copy link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-border"
                >
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </Button>
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-border text-brand-error hover:text-brand-error hover:bg-brand-error/10"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa bài viết
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="border-border shadow-md glass-dark">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Tùy chọn xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Trạng thái hiện tại</Label>
                  <Badge className={statusOptions.find(s => s.value === formData.status)?.color}>
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </Badge>
                </div>

                {formData.publishedAt && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Ngày xuất bản</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formData.publishedAt}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {formData.status === 'draft' && (
                    <Button
                      className="w-full gap-2 bg-brand-primary hover:bg-brand-primary/90"
                      onClick={() => handleSave('publish')}
                      disabled={isSaving}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Xuất bản ngay
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-border"
                    onClick={() => {
                      handleInputChange('status', 'scheduled');
                      setActiveTab('settings');
                    }}
                  >
                    <Clock className="w-4 h-4" />
                    Lên lịch xuất bản
                  </Button>

                  {formData.status === 'published' && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-border"
                      onClick={() => handleInputChange('status', 'draft')}
                    >
                      <EyeOff className="w-4 h-4" />
                      Chuyển về nháp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="border-border shadow-md glass-dark">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Danh sách kiểm tra</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Tiêu đề</p>
                    <p className="text-xs text-muted-foreground">Đã có tiêu đề hấp dẫn</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Nội dung</p>
                    <p className="text-xs text-muted-foreground">Đã có nội dung đầy đủ</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Ảnh đại diện</p>
                    <p className="text-xs text-muted-foreground">Đã có ảnh thumbnail</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {formData.seo.score >= 80 ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-brand-warning mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">SEO</p>
                    <p className="text-xs text-muted-foreground">
                      Điểm SEO: {formData.seo.score}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Tags</p>
                    <p className="text-xs text-muted-foreground">
                      Đã có {formData.tags.length} tags
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết "{formData.title}"? Hành động này không thể hoàn tác.
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
              onClick={handleDelete}
              className="bg-brand-error hover:bg-brand-error/90"
            >
              Xóa bài viết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}