"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type RecentPost = {
  id: string;
  title: string;
  slug: string;
};

const RECENT_POST_KEY = "recent_posts";
const MAX_ITEMS = 5;

export function RecentPostsSidebar() {
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_POST_KEY);
    if (raw) {
      setPosts(JSON.parse(raw));
    }
  }, []);

  if (!posts.length) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Đã xem gần đây</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {posts.map((post) => (
            <SidebarMenuItem key={post.id}>
              <SidebarMenuButton asChild tooltip={post.title}>
                <Link
                  href={`/post/${post.slug}`}
                  className="flex items-center gap-3"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="truncate">{post.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
