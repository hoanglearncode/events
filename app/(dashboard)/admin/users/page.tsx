"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserX,
  TrendingUp,
  Mail,
  Lock,
  Activity,
  Smartphone,
  MapPin,
  Edit,
  RotateCcw,
} from "lucide-react";

import { TablePagination } from "@/components/TablePagination";



type UserRole = "Admin" | "Moderator" | "User" | "Enterprise";
type UserStatus = "Active" | "Suspended" | "Banned" | "Pending Verification";

interface LoginHistory {
  date: string;
  ip: string;
  device: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  loginHistory: LoginHistory[];
}

interface UserStats {
  total: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  emailVerifiedRate: string;
  suspendedBanned: number;
  roleCount: Record<UserRole, number>;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    role: "Admin",
    status: "Active",
    emailVerified: true,
    createdAt: "2026-01-15",
    lastLogin: "2026-02-03 09:30",
    loginHistory: [
      {
        date: "2026-02-03 09:30",
        ip: "192.168.1.100",
        device: "Chrome/Windows 10",
      },
      {
        date: "2026-02-02 14:20",
        ip: "192.168.1.100",
        device: "Chrome/Windows 10",
      },
      { date: "2026-02-01 08:15", ip: "10.0.0.50", device: "Safari/iPhone 14" },
    ],
  },
  {
    id: "USR002",
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    phone: "0912345678",
    role: "Moderator",
    status: "Active",
    emailVerified: true,
    createdAt: "2026-01-20",
    lastLogin: "2026-02-02 16:45",
    loginHistory: [
      { date: "2026-02-02 16:45", ip: "172.16.0.25", device: "Firefox/macOS" },
      { date: "2026-02-01 10:30", ip: "172.16.0.25", device: "Firefox/macOS" },
    ],
  },
  {
    id: "USR003",
    name: "Lê Hoàng Cường",
    email: "cuong.le@example.com",
    phone: "0923456789",
    role: "Enterprise",
    status: "Active",
    emailVerified: true,
    createdAt: "2025-12-10",
    lastLogin: "2026-02-03 11:00",
    loginHistory: [
      {
        date: "2026-02-03 11:00",
        ip: "203.162.4.190",
        device: "Edge/Windows 11",
      },
      {
        date: "2026-02-02 09:00",
        ip: "203.162.4.190",
        device: "Edge/Windows 11",
      },
    ],
  },
  {
    id: "USR004",
    name: "Phạm Minh Đức",
    email: "duc.pham@example.com",
    phone: "0934567890",
    role: "User",
    status: "Suspended",
    emailVerified: true,
    createdAt: "2026-01-28",
    lastLogin: "2026-01-30 22:15",
    loginHistory: [
      {
        date: "2026-01-30 22:15",
        ip: "115.73.220.10",
        device: "Chrome/Android",
      },
    ],
  },
  {
    id: "USR005",
    name: "Võ Thị Em",
    email: "em.vo@example.com",
    phone: "0945678901",
    role: "User",
    status: "Pending Verification",
    emailVerified: false,
    createdAt: "2026-02-02",
    lastLogin: "2026-02-02 18:30",
    loginHistory: [
      {
        date: "2026-02-02 18:30",
        ip: "14.231.15.88",
        device: "Chrome/Windows 10",
      },
    ],
  },
  {
    id: "USR006",
    name: "Hoàng Văn Phúc",
    email: "phuc.hoang@example.com",
    phone: "0956789012",
    role: "User",
    status: "Banned",
    emailVerified: true,
    createdAt: "2026-01-05",
    lastLogin: "2026-01-25 14:20",
    loginHistory: [
      { date: "2026-01-25 14:20", ip: "123.25.67.89", device: "Chrome/macOS" },
    ],
  },
  {
    id: "USR007",
    name: "Đặng Thị Giang",
    email: "giang.dang@example.com",
    phone: "0967890123",
    role: "Moderator",
    status: "Active",
    emailVerified: true,
    createdAt: "2026-01-18",
    lastLogin: "2026-02-03 08:45",
    loginHistory: [
      {
        date: "2026-02-03 08:45",
        ip: "192.168.10.50",
        device: "Safari/iPad Pro",
      },
      {
        date: "2026-02-02 12:00",
        ip: "192.168.10.50",
        device: "Safari/iPad Pro",
      },
    ],
  },
  {
    id: "USR008",
    name: "Bùi Quốc Hùng",
    email: "hung.bui@example.com",
    phone: "0978901234",
    role: "User",
    status: "Active",
    emailVerified: true,
    createdAt: "2026-01-25",
    lastLogin: "2026-02-03 10:15",
    loginHistory: [
      {
        date: "2026-02-03 10:15",
        ip: "171.244.50.12",
        device: "Chrome/Android",
      },
    ],
  },
];

const calculateStats = (users: User[]): UserStats => {
  const now = new Date("2026-02-03");
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const newUsersLast7Days = users.filter(
    (u) => new Date(u.createdAt) >= sevenDaysAgo
  ).length;
  const newUsersLast30Days = users.filter(
    (u) => new Date(u.createdAt) >= thirtyDaysAgo
  ).length;
  const emailVerifiedRate = (
    (users.filter((u) => u.emailVerified).length / users.length) *
    100
  ).toFixed(1);
  const suspendedBanned = users.filter(
    (u) => u.status === "Suspended" || u.status === "Banned"
  ).length;

  const roleCount = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<UserRole, number>
  );

  return {
    total: users.length,
    newUsersLast7Days,
    newUsersLast30Days,
    emailVerifiedRate,
    suspendedBanned,
    roleCount,
  };
};

// Component
const UserManagement: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [pagination, setPagination] = useState({
    total: users.length,
    per_page: 10,
    current_page: 1,
    last_page: Math.ceil(users.length / 10),
  });

  const stats = useMemo(() => calculateStats(users), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<
      UserStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        className: string;
      }
    > = {
      Active: {
        variant: "default",
        className: "bg-brand-success text-white hover:bg-brand-success/90",
      },
      Suspended: {
        variant: "secondary",
        className: "bg-brand-warning text-white hover:bg-brand-warning/90",
      },
      Banned: {
        variant: "destructive",
        className: "bg-brand-error text-white hover:bg-brand-error/90",
      },
      "Pending Verification": {
        variant: "outline",
        className: "border-brand-secondary text-brand-secondary",
      },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      Admin: "bg-brand-primary text-white hover:bg-brand-primary/90",
      Moderator: "bg-brand-secondary text-white hover:bg-brand-secondary/90",
      Enterprise: "bg-brand-accent text-foreground hover:bg-brand-accent/90",
      User: "bg-muted text-muted-foreground hover:bg-muted/90",
    };
    return <Badge className={colors[role]}>{role}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý người dùng
            </h1>
            <p className="text-muted-foreground mt-1">
              Tổng quan và quản lý tài khoản người dùng
            </p>
          </div>
          <Button className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-brand-primary card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng số người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(stats.roleCount).map(([role, count]) => (
                      <p key={role} className="text-xs text-muted-foreground">
                        {role}: {count}
                      </p>
                    ))}
                  </div>
                </div>
                <Users className="w-12 h-12 text-brand-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-success card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Người dùng mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.newUsersLast7Days}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trong 7 ngày
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.newUsersLast30Days} trong 30 ngày
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-brand-success opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-secondary card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tỷ lệ xác thực email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.emailVerifiedRate}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {users.filter((u) => u.emailVerified).length}/{stats.total}{" "}
                    đã xác thực
                  </p>
                </div>
                <ShieldCheck className="w-12 h-12 text-brand-secondary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-error card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tài khoản bị khóa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.suspendedBanned}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {users.filter((u) => u.status === "Suspended").length} tạm
                    khóa, {users.filter((u) => u.status === "Banned").length}{" "}
                    cấm
                  </p>
                </div>
                <UserX className="w-12 h-12 text-brand-error opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-foreground">
              Danh sách người dùng
            </CardTitle>
            <CardDescription>
              Quản lý và theo dõi thông tin chi tiết người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-input"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                  <SelectItem value="Pending Verification">
                    Pending Verification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Tên</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">
                      Số điện thoại
                    </TableHead>
                    <TableHead className="font-semibold">Vai trò</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Ngày tạo</TableHead>
                    <TableHead className="text-right font-semibold">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {user.id}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge
                            variant="outline"
                            className="bg-brand-success/10 text-brand-success border-brand-success/30"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Đã xác thực
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-brand-warning/10 text-brand-warning border-brand-warning/30"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Chưa xác thực
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="hover:bg-brand-primary/10 hover:text-brand-primary"
                            >
                              Chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">
                                Chi tiết người dùng
                              </DialogTitle>
                              <DialogDescription>
                                Thông tin chi tiết và lịch sử hoạt động
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      ID
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Tên
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Email
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.email}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Số điện thoại
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Vai trò
                                    </p>
                                    <div className="mt-1">
                                      {getRoleBadge(selectedUser.role)}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Trạng thái
                                    </p>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedUser.status)}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Ngày tạo
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.createdAt}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Đăng nhập cuối
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      {selectedUser.lastLogin}
                                    </p>
                                  </div>
                                </div>

                                {/* Login History */}
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-brand-primary" />
                                    Lịch sử đăng nhập
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedUser.loginHistory.map(
                                      (login, idx) => (
                                        <div
                                          key={idx}
                                          className="bg-muted p-3 rounded-lg border border-border"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                              <p className="text-sm font-medium text-foreground">
                                                {login.date}
                                              </p>
                                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center">
                                                  <MapPin className="w-3 h-3 mr-1" />
                                                  {login.ip}
                                                </span>
                                                <span className="flex items-center">
                                                  <Smartphone className="w-3 h-3 mr-1" />
                                                  {login.device}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-border">
                                  <Button
                                    variant="outline"
                                    className="flex-1 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary"
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Đặt lại mật khẩu
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 hover:bg-brand-secondary/10 hover:text-brand-secondary hover:border-brand-secondary"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                  </Button>
                                  {selectedUser.status === "Active" ? (
                                    <Button
                                      variant="outline"
                                      className="flex-1 hover:bg-brand-error/10 hover:text-brand-error hover:border-brand-error"
                                    >
                                      <Lock className="w-4 h-4 mr-2" />
                                      Tạm khóa
                                    </Button>
                                  ) : (
                                    <Button className="flex-1 bg-brand-success hover:bg-brand-success/90 text-white">
                                      <ShieldCheck className="w-4 h-4 mr-2" />
                                      Kích hoạt
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              pagination={pagination}
              onPageChange={(page) => {
                if (!page) return;
                setPagination((prev) => ({
                  ...prev,
                  current_page: Number(page),
                }));
              }}
              onPerPageChange={(perPage) => {
                setPagination((prev) => ({
                  ...prev,
                  per_page: perPage,
                  current_page: 1,
                  last_page: Math.ceil(prev.total / perPage),
                }));
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
