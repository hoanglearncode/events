"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie";
import { complaintSchema, ComplaintFormValues } from "./validate";
import { ACCESS_TOKEN } from "@/shared/const/cookie";

interface ComplaintDialogProps {
  orderId: number | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDialog({
  orderId,
  open,
  onOpenChange,
}: ComplaintDialogProps) {
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: ComplaintFormValues) => {
    const payload = {
      orderId,
      status: "Pending",
      reason: values.reason,
    };

    try {
      const token = Cookies.get(ACCESS_TOKEN);
      !!token &&
        (await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/complaint`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              report: values.reason,
            }),
          }
        ));

      form.reset();
      onOpenChange(false); // ✅ đóng dialog sau khi submit thành công
    } catch (error) {
      console.error("Gửi khiếu nại thất bại", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Khiếu nại đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do khiếu nại</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do khiếu nại..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Gửi khiếu nại</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
