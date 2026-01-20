import React from "react";
import { Edit, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileTabProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
  userRole: string;
  isSeller: boolean;
  provider: string;
  isUpdating: boolean;
  fileInputRef: any;
  onUserDataChange: (data: any) => void;
  onSaveProfile: () => void;
  onChooseAvatar: () => void;
  onAvatarSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export default function ProfileTab({
  userData,
  userRole,
  isSeller,
  provider,
  isUpdating,
  fileInputRef,
  onUserDataChange,
  onSaveProfile,
  onChooseAvatar,
  onAvatarSelected,
  onCancel,
}: ProfileTabProps) {
  return (
    <Card className="animate-in fade-in duration-300">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-1 ring-gray-50 shadow-lg">
              {userData.avatar ? (
                <AvatarImage src={userData.avatar} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                name="avatar"
                onChange={onAvatarSelected}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={onChooseAvatar}
                className="text-xs"
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">
                {userData.name || "Chưa cập nhật"}
              </h2>
              <Badge variant="outline" className="capitalize">
                {userRole}
              </Badge>
              {isSeller && (
                <Badge className="bg-brand-success">
                  <Crown className="w-3 h-3 mr-1" />
                  Seller
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{userData.email}</p>
            {provider !== "LOCAL" && (
              <Badge variant="secondary" className="mt-2">
                Đăng nhập qua {provider}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) =>
                onUserDataChange({ ...userData, name: e.target.value })
              }
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) =>
                onUserDataChange({ ...userData, email: e.target.value })
              }
              placeholder="email@example.com"
              disabled={provider !== "LOCAL"}
            />
            {provider !== "LOCAL" && (
              <p className="text-xs text-muted-foreground">
                Email không thể thay đổi với tài khoản {provider}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={(e) =>
                onUserDataChange({ ...userData, phone: e.target.value })
              }
              placeholder="0123456789"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              className="bg-brand-primary hover:bg-brand-primary/90"
              onClick={onSaveProfile}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
