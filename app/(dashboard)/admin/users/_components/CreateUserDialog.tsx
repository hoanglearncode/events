"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser } from "@/hooks/queries/useUserMutations";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, Copy, Mail, Key, Plus, X } from "lucide-react";

const createUserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  password: z.string().min(8, "Tối thiểu 8 ký tự"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "USER", "SELLER"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: { email: string; fullName: string; role: string }) => void;
}

export function CreateUserDialog({
  open,
  onClose,
  onSuccess,
}: CreateUserDialogProps) {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      phone: "",
      role: "USER",
    },
  });

  const [createdUser, setCreatedUser] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { mutate: createUser, isPending } = useCreateUser({
    onSuccess: (res) => {
      toast.success("Tạo tài khoản thành công");

      setCreatedUser({
        email: res.email,
        password: res.password,
      });

      onSuccess({
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });

      form.reset();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Tạo tài khoản thất bại");
    },
  });

  const handleSubmit = (data: CreateUserFormData) => {
    createUser(data);
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Đã copy");
  };

  const resetAndCreateNew = () => {
    setCreatedUser(null);
    form.reset();
  };

  const handleClose = () => {
    resetAndCreateNew();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {!createdUser ? (
          <>
            <DialogHeader>
              <DialogTitle>Tạo tài khoản mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản cho người dùng
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu *</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Không bắt buộc
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">Người dùng</SelectItem>
                          <SelectItem value="SELLER">Seller</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Đang tạo..." : "Tạo tài khoản"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            {/* SUCCESS UI */}
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-lg font-semibold">
                Tạo tài khoản thành công
              </h2>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{createdUser.email}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy(createdUser.email)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{createdUser.password}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy(createdUser.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex w-full gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetAndCreateNew}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo tiếp
                </Button>
                <Button className="w-full" onClick={handleClose}>
                  <X className="mr-2 h-4 w-4" />
                  Đóng
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
