import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Import Shadcn components (đảm bảo bạn đã cài đặt chúng)
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import {
  TablePagination,
  type PaginationMeta,
} from "@/components/TablePagination";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo } from "react";

// types/complaint.ts
export type ComplaintStatus = "pending" | "resolved" | "failed";

export interface Complaint {
  id: string;
  orderId: string;
  itemName: string;
  customerName: string;
  customerEmail: string;
  status: ComplaintStatus | string; // allow string in case API returns uppercase variants
  createdAt: string;
  reason: string;
}

export interface ComplaintsResponse {
  result: Complaint[];
  pagination: PaginationMeta;
}

export const getComplaints = async (
  page: number = 0,
  size: number = 10
): Promise<ComplaintsResponse> => {
  const token = Cookies.get(ACCESS_TOKEN);

  if (!token) {
    throw new Error("Missing access token");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/complaints?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return res.json();
};

export const updateComplaintStatus = async (
  id: string,
  status: ComplaintStatus | string
): Promise<boolean> => {
  const token = Cookies.get(ACCESS_TOKEN);

  if (!token) {
    throw new Error("Missing access token");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/complaints/${id}/status?status=${status}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update complaint status");
  }

  return true;
};

export const deleteComplaint = async (id: string): Promise<boolean> => {
  const token = Cookies.get(ACCESS_TOKEN);

  if (!token) {
    throw new Error("Missing access token");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/complaints/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete complaint");
  }

  return true;
};

/**
 * Mock / real API for sending message to user.
 * - Gói dữ liệu (payload) sẽ bao gồm:
 *   { complaintId, orderId, to, toName, from: 'seller', message, sentAt }
 * - Nếu NEXT_PUBLIC_API_URL không được cấu hình, hàm sẽ giả lập (mock) trả về success.
 * - Thay url nếu bạn có endpoint thực tế.
 */
export const sendMessageToUser = async (
  complaintId: string,
  message: string
): Promise<boolean> => {
  const token = Cookies.get(ACCESS_TOKEN);

  if (!token) {
    throw new Error("Missing access token");
  }

  // Bạn có thể đổi endpoint này thành endpoint thật của bạn
  const base = process.env.NEXT_PUBLIC_API_URL;
  const url = base
    ? `${base}/api/seller/complaint/${complaintId}/message`
    : `/api/mock/sender/complaint-message`; // mock fallback

  // Nếu không có base URL, giả lập delay và trả về true (mock)
  if (!base) {
    await new Promise((r) => setTimeout(r, 700));
    // console.log("Mock send payload:", payload);
    return true;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    throw new Error("Failed to send message to user");
  }

  return true;
};

// --- Sub-component: Status Badge ---
const StatusBadge = ({ status }: { status: ComplaintStatus | string }) => {
  switch (status) {
    case "RESOLVED":
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="bg-brand-success/15 text-brand-success border-brand-success/20 hover:bg-brand-success/25"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" /> Đã giải quyết
        </Badge>
      );
    case "REJECTED":
    case "failed":
    case "REJECT":
      return (
        <Badge
          variant="outline"
          className="bg-brand-error/15 text-brand-error border-brand-error/20 hover:bg-brand-error/25"
        >
          <XCircle className="w-3 h-3 mr-1" /> Thất bại
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-brand-warning/15 text-brand-warning border-brand-warning/20 hover:bg-brand-warning/25"
        >
          <AlertCircle className="w-3 h-3 mr-1" /> Chờ xử lý
        </Badge>
      );
  }
};

export default function ComplaintManagementPage() {
  const [data, setData] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // State cho Modal xem chi tiết
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State cho Modal gửi tin nhắn
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageTarget, setMessageTarget] = useState<Complaint | null>(null);
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return [...data];

    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
    );
  }, [data, search]);
  // Load Data
  useEffect(() => {
    fetchData();
  }, [page, size]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await getComplaints(page, size);
      setData(result.result);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    // Optimistic UI Update: Cập nhật giao diện trước khi gọi API để cảm giác nhanh hơn
    const originalData = [...data];
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await updateComplaintStatus(id, newStatus);
      // Có thể thêm Toast notification thành công ở đây
    } catch (error) {
      // Revert nếu lỗi
      setData(originalData);
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khiếu nại này không?")) return;

    // Optimistic UI
    const originalData = [...data];
    setData((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteComplaint(id);
    } catch (error) {
      setData(originalData);
    }
  };

  const openDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const openMessageDialog = (complaint: Complaint) => {
    setMessageTarget(complaint);
    setMessageText(""); // reset
    setIsMessageOpen(true);
  };

  const handlePageChange = (p: number | string) => {
    const newPage = typeof p === "string" ? parseInt(p, 10) - 1 : p - 1;
    setPage(newPage);
  };

  const handlePerPageChange = (perPage: number) => {
    setSize(perPage);
    setPage(0);
  };

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (!messageTarget) return;
    if (!messageText.trim()) {
      toast.warning("Vui lòng nhập nội dung tin nhắn.");
      return;
    }

    const payload = {
      complaintId: messageTarget.id,
      orderId: messageTarget.orderId,
      to: messageTarget.customerEmail,
      toName: messageTarget.customerName,
      from: "seller", // bạn có thể đổi nếu cần
      message: messageText.trim(),
      sentAt: new Date().toISOString(),
    };

    setSendingMessage(true);

    try {
      await sendMessageToUser(messageTarget.id, messageText.trim());
      // nếu cần: cập nhật local state, thêm toast...
      // ví dụ: console.log("Sent payload:", payload);
      setIsMessageOpen(false);
      setMessageTarget(null);
      setMessageText("");
      // reload data nếu muốn cập nhật thời gian thao tác
      // await fetchData();
      toast.success("Gửi tin nhắn thành công.");

      setTimeout(() => {
        setIsMessageOpen(false);
        setMessageTarget(null);
        setMessageText("");
      }, 2000);
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8">
      {/* Main Table Card */}
      <Card className="card-elevated border-none">
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
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[100px]">Mã đơn</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="w-[150px]">Trạng thái</TableHead>
                  {/* <TableHead className="w-[200px]">Lý do</TableHead> */}
                  <TableHead className="text-right">Ngày gửi</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Đang tải dữ
                        liệu...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không có dữ liệu khiếu nại nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-brand-primary">
                        {item.id}
                      </TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.customerEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="truncate max-w-[200px] text-muted-foreground"
                            title={item.reason}
                          >
                            {item.reason}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-brand-secondary hover:text-brand-secondary/80 hover:bg-brand-secondary/10"
                            onClick={() => openDetail(item)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell> */}
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {format(new Date(item.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                        <br />
                        <span className="text-xs">
                          {format(new Date(item.createdAt), "HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[220px]"
                          >
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetail(item)}>
                              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>

                            {/* Gửi tin nhắn */}
                            <DropdownMenuItem
                              onClick={() => openMessageDialog(item)}
                              className="text-brand-secondary focus:text-brand-secondary focus:bg-brand-secondary/10"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              Gửi tin nhắn
                            </DropdownMenuItem>

                            {/* <DropdownMenuSeparator /> */}

                            {/* <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(item.id, "RESOLVED")
                              }
                              className="text-brand-success focus:text-brand-success focus:bg-brand-success/10"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Đã giải
                              quyết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(item.id, "REJECTED")
                              }
                              className="text-brand-warning focus:text-brand-warning focus:bg-brand-warning/10"
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Thất bại
                            </DropdownMenuItem> */}
                            {/* {/* <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-brand-error focus:text-brand-error focus:bg-brand-error/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa đơn
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <TablePagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog (Modal) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-primary">
              Chi tiết khiếu nại #{selectedComplaint?.id}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu từ khách hàng.
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Mã đơn hàng
                  </h4>
                  <p className="text-sm font-semibold">
                    {selectedComplaint.orderId}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Trạng thái hiện tại
                  </h4>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground text-right">
                    Khách hàng:
                  </span>
                  <span className="text-sm">
                    {selectedComplaint.customerName}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground text-right">
                    Email:
                  </span>
                  <span className="text-sm">
                    {selectedComplaint.customerEmail}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground text-right">
                    Sản phẩm:
                  </span>
                  <span className="text-sm font-semibold text-brand-secondary">
                    {selectedComplaint.itemName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Nội dung khiếu nại:</h4>
                <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]">
                  {selectedComplaint.reason}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
            {selectedComplaint?.status === "pending" && (
              <Button
                className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                onClick={() => {
                  if (selectedComplaint)
                    handleStatusChange(selectedComplaint.id, "resolved");
                  setIsDetailOpen(false);
                }}
              >
                Xử lý ngay
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-primary">
              Gửi tin nhắn tới khách hàng
            </DialogTitle>
            <DialogDescription>
              Soạn tin gửi tới {messageTarget?.customerName || "khách hàng"}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Đến</h4>
              <p className="text-sm font-semibold">
                {messageTarget?.customerName} —{" "}
                <span className="text-xs text-muted-foreground">
                  {messageTarget?.customerEmail}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Mã khiếu nại / ĐH
              </h4>
              <p className="text-sm">
                #{messageTarget?.id} / {messageTarget?.orderId}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Nội dung tin nhắn
              </h4>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Nhập nội dung tin nhắn..."
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tin nhắn sẽ được đóng gói gồm: complaintId, orderId, to,
                toName, from, message, sentAt.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
              onClick={handleSendMessage}
              disabled={sendingMessage || messageText.trim().length === 0}
            >
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi
                </>
              ) : (
                "Gửi tin nhắn"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
