"use client";

import * as React from "react";
import {
  ChevronDown,
  FormInputIcon,
  Image as ImageIcon,
  MapPin,
  Smile,
  Tag,
  Video,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { encodeId } from "@/shared/helpers/hash";


/* ───────────────── types ───────────────── */

type PageStatus = "active" | "inactive" | "pending";

interface PageItem {
  id: string;
  label: string;
  status: PageStatus;
  value?: string;
}

interface PostEditorProps {
  postContent: string;
  setPostContent: (v: string) => void;
}

/* ───────────────── mock data ───────────────── */

const PAGES: PageItem[] = [
  { id: "1", label: "Website", status: "active", value: "website" },
  { id: "2", label: "FanPage", status: "active", value: "fanpage" },
  { id: "3", label: "Website and FanPage", status: "active", value: "website-fanpage" },
];

/* ───────────────── component ───────────────── */

export default function PostEditor({
  postContent,
  setPostContent,
}: PostEditorProps) {
  const router = useRouter();

  const [selectedPage, setSelectedPage] = React.useState<PageItem>(
    PAGES[0]
  );

  const [postData, setPostData] = React.useState({
    id: "123456",
    content: "",
    images: [] as File[],
    videos: [] as File[],
  });
  return (
    <Card className="rounded-lg overflow-hidden card-elevated">
      <CardHeader className="border-b bg-card">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tạo bài viết
        </h1>
      </CardHeader>

      <CardContent className="border-b py-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">
              {selectedPage.label.charAt(0).toUpperCase()}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 font-semibold"
              >
                {selectedPage.label}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              {PAGES.map((page) => {
                const disabled = page.status !== "active";

                return (
                  <DropdownMenuItem
                    key={page.id}
                    disabled={disabled}
                    onSelect={() => {
                      if (!disabled) {
                        setSelectedPage(page);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between",
                      "focus:bg-foreground",
                      "data-[disabled]:opacity-50",
                      "data-[disabled]:cursor-not-allowed"
                    )}
                  >
                    <span>{page.label}</span>

                    {page.status !== "active" && (
                      <span className="text-xs text-muted-foreground">
                        {page.status}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardContent className="border-b py-6">
        <h3 className="text-sm font-semibold mb-1 text-foreground">
          File phương tiện
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Chia sẻ ảnh hoặc video.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <ImageIcon className="w-5 h-5" />
            Thêm ảnh
          </Button>

          <Button variant="outline" className="gap-2" onClick={() => { router.push(`/user/post/new/form?postId=${encodeURIComponent(btoa(postData.id))}`); }}>
            <FormInputIcon className="w-5 h-5" />
            Thêm form
          </Button>
        </div>
      </CardContent>

      <CardContent className="py-6">
        <label className="block text-sm font-semibold mb-1 text-foreground">
          Chi tiết bài viết
        </label>

        <div className="relative">
          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="
              min-h-[200px]
              pr-12
              bg-card
              border-border
              focus-visible:ring-ring
            "
          />
        </div>
      </CardContent>

      <CardFooter className="border-t flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="ghost">Hủy</Button>
          <Button variant="ghost">Hoàn tất sau</Button>
          <Button className="font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
            Đăng
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
