import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Eye, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

type AdminBlogPostResponse = {
  id: number;
  title: string;
  thumbnailUrl: string;
  authorName: string;
  authorAvatar: string;
  postStatus: string;
  view: number;
  readingTime: string;
  createdAt: string;
};

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; variant: any }> = {
    PUBLISHED: { label: "Đã đăng", variant: "default" },
    DRAFT: { label: "Nháp", variant: "outline" },
    REJECTED: { label: "Từ chối", variant: "destructive" },
    PENDING: { label: "Chờ duyệt", variant: "secondary" },
    FEATURED: { label: "Nổi bật", variant: "default" },
    UNKNOWN: { label: "Không rõ", variant: "secondary" },
  };
  const s = map[status || "UNKNOWN"] || map.UNKNOWN;
  return (
    <Badge variant={s.variant} className="uppercase text-xs font-bold">
      {s.label}
    </Badge>
  );
}

export type AdminBlogTableProps = {
  posts: AdminBlogPostResponse[];
  onViewDetail?: (post: AdminBlogPostResponse) => void;
  onDelete?: (post: AdminBlogPostResponse) => void;
  onApprove?: (post: AdminBlogPostResponse) => void;
  onFeature?: (post: AdminBlogPostResponse) => void;
  tab: "pending" | "all";
};

export default function AdminBlogTable({
  posts,
  tab,
  onViewDetail,
  onDelete,
  onApprove,
  onFeature,
}: AdminBlogTableProps) {
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;

    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
    );
  }, [posts, search]);

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề bài viết..."
            className="pl-9"
          />
        </div>

        <span className="text-sm text-muted-foreground">
          {filteredPosts.length}/{posts.length} bài viết
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-12" />
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-24 text-center text-muted-foreground"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell />
                {/* Title & Thumbnail */}
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-10 w-10">
                      {post.thumbnailUrl && (
                        <AvatarImage src={post.thumbnailUrl} alt={post.title} />
                      )}
                      <AvatarFallback>
                        {post.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{post.title}</span>
                      <span className="text-xs text-muted-foreground">
                        #{post.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {/* Author */}
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-7 w-7">
                      {post.authorAvatar && (
                        <AvatarImage
                          src={post.authorAvatar}
                          alt={post.authorName}
                        />
                      )}
                      <AvatarFallback>
                        {post.authorName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.authorName}</span>
                  </div>
                </TableCell>
                {/* Status */}
                <TableCell>
                  <StatusBadge status={post.postStatus} />
                </TableCell>
                {/* View */}
                <TableCell>{post.view}</TableCell>
                {/* Date */}
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(post.createdAt) || "—"}
                </TableCell>
                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail?.(post)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>

                    {tab === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove?.(post)}
                        className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Duyệt
                      </Button>
                    )}

                    {tab === "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeature?.(post)}
                        className="h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Nổi bật
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(post)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
