"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function PostsTab() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [searchTerm, page, size]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
    } catch (e: any) {
      console.error("Error fetching posts:", e);
      setError(e?.message || "Lỗi tải bài viết");
      toast.error("Không thể tải bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
    } catch (e: any) {
      console.error("Error deleting post:", e);
      toast.error(e?.message || "Không thể xóa bài viết");
    }
  };

  const handleViewPost = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handleEditPost = (slug: string) => {
    router.push(`/post/edit/${slug}`);
  };

  const handleCreatePost = () => {
    router.push("/post/new");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(totalPosts / size);

  return (
    <div className="space-y-6">
      {/* Search and Create */}
      <Card className="bg-card border-border">
        <CardContent className="">
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button
              onClick={handleCreatePost}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tạo bài viết mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <BookOpen className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải bài viết...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchPosts}>Thử lại</Button>
        </div>
      ) : posts.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground text-lg mb-2">
              {searchTerm ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              {searchTerm
                ? "Thử tìm kiếm với từ khóa khác"
                : "Bắt đầu tạo bài viết đầu tiên của bạn"}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreatePost} className="gap-2">
                <Plus className="w-4 h-4" />
                Tạo bài viết mới
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-card border border-border shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group"
            >
              {/* Thumbnail */}
              {post.thumbnailUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        post.postStatus === "PUBLISHED"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }
                    >
                      {post.postStatus === "PUBLISHED"
                        ? "Đã xuất bản"
                        : "Chờ duyệt"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        post.postStatus === "PUBLISHED"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }
                    >
                      {post.postStatus === "PUBLISHED"
                        ? "Đã xuất bản"
                        : "Bản nháp"}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Content */}
              <CardContent className="flex-1 flex flex-col p-5">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    {post.authorName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.authorName}</span>
                      </div>
                    )}
                    {post.view !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{post.view} lượt xem</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPost(post.slug)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPost(post.slug)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Sửa
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Xác nhận xóa bài viết?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa bài viết "{post.title}"?
                          Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {posts.length > 0 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Trước
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Trang {page + 1} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1 || posts.length < size}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
