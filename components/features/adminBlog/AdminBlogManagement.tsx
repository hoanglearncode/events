"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminBlogTable from "@/components/features/adminBlog/AdminBlogTable";

import { TablePagination } from "@/components/features/product/paga";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ActionType = "delete" | "approve" | "feature" | null;

export default function AdminBlogManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "pending">("pending");

  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [selectedPost, setSelectedPost] =
    useState<any | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

 

  useEffect(() => {
    // fetchPosts(); 
  }, [page, perPage, search, tab]);

  const handleOpenDialog = (post: any, type: ActionType) => {
    setSelectedPost(post);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setActionType(null);
    setApprovalStatus(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
  };

  const handleFeature = async () => {
    if (!selectedPost) return;

  };

  const handleApprove = async () => {
    if (!selectedPost) return;
  };

  const handleSubmit = () => {
    if (actionType === "delete") handleDelete();
    else if (actionType === "approve") handleApprove();
    else if (actionType === "feature") handleFeature();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý bài viết</h2>

        <div className="flex items-center bg-muted rounded-md p-1 gap-1">
          <Button
            variant="ghost"
            onClick={() => setTab("all")}
            className={`
              rounded-md px-4 h-9 text-sm font-medium transition-all
              ${
                tab === "all"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/60"
              }
            `}
          >
            Tất cả
          </Button>

          <Button
            variant="ghost"
            onClick={() => setTab("pending")}
            className={`
              rounded-md px-4 h-9 text-sm font-medium transition-all
              ${
                tab === "pending"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted/60"
              }
            `}
          >
            Chờ duyệt
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : (
        <AdminBlogTable
          posts={posts}
          onViewDetail={(post) => window.open(`/blog/`, "_blank")}
          onDelete={(post) => handleOpenDialog(post, "delete")}
          onApprove={(post) => handleOpenDialog(post, "approve")}
          onFeature={(post) => handleOpenDialog(post, "feature")}
          tab={tab}
        />
      )}

      <TablePagination
        pagination={{ current_page: page, per_page: perPage, total }}
        onPageChange={(p) => {
          const next = typeof p === "number" ? p : Number(p);
          if (Number.isFinite(next) && next > 0) setPage(next);
        }}
        onPerPageChange={(n) => {
          if (Number.isFinite(n) && n > 0) setPerPage(n);
        }}
      />

      {/* Action Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete" && "Xóa bài viết"}
              {actionType === "approve" && "Duyệt bài viết"}
              {actionType === "feature" && "Đánh dấu nổi bật"}
            </DialogTitle>

            <DialogDescription>
              {actionType === "delete" && (
                <>
                  Bạn có chắc chắn muốn xóa bài viết{" "}
                  <strong>"{selectedPost?.title}"</strong>?
                </>
              )}
              {actionType === "feature" && (
                <>
                  Bạn có chắc chắn muốn đánh dấu bài viết{" "}
                  <strong>"{selectedPost?.title}"</strong> là <b>nổi bật</b>?
                </>
              )}
              {actionType === "approve" && (
                <>
                  Chọn trạng thái duyệt cho bài viết{" "}
                  <strong>"{selectedPost?.title}"</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {actionType === "approve" && (
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                Trạng thái duyệt
              </label>
              <Select
                value={approvalStatus ? "approved" : "rejected"}
                onValueChange={(value) =>
                  setApprovalStatus(value === "approved")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Duyệt (Approved)</SelectItem>
                  <SelectItem value="rejected">Từ chối (Rejected)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant={actionType === "delete" ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : actionType === "delete"
                  ? "Xóa"
                  : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
