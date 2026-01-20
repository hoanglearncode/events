"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-3xl border-border bg-card/60 backdrop-blur",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
