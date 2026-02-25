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
import MarkdownEditor from "./MarkdownEditor";
import { useRouter } from "next/navigation";

/* ───────────────── types ───────────────── */

type PageStatus = "active" | "inactive" | "pending";

interface PageItem {
  id: string;
  label: string;
  status: PageStatus;
  value?: string;
}

interface StatusPost {
  id: string;
  label: string;
}

interface PostEditorProps {
  postContent: string;
  setPostContent: (v: string) => void;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

/* ───────────────── mock data ───────────────── */

const PAGES: PageItem[] = [
  {
    id: "3",
    label: "Website and FanPage",
    status: "inactive",
    value: "website-fanpage",
  },
  { id: "1", label: "Website", status: "active", value: "website" },
  { id: "2", label: "FanPage", status: "inactive", value: "fanpage" },
];

const Status: StatusPost[] = [
  { id: "hiring", label: "Đang tuyển" },
  { id: "enough", label: "Đã đủ" },
  { id: "stop", label: "Dừng tuyển" },
];

/* ───────────────── component ───────────────── */

export default function PostEditor({
  postContent,
  images,
  setPostContent,
  setImages,
}: PostEditorProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedPage, setSelectedPage] = React.useState<PageItem>(PAGES[1]);
  const [status, setStatus] = React.useState<StatusPost>(Status[0]);
  const [postData, setPostData] = React.useState({
    id: "123456",
    content: "",
    images: [] as File[],
    videos: [] as File[],
  });

  const handleSelectImages = (files: FileList | null) => {
    if (!files) return;

    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setImages((prev) => [...prev, ...validImages]);
  };
  return (
    <Card className="rounded-lg overflow-hidden card-elevated">
      <CardHeader className="border-b bg-card">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tạo bài viết
        </h1>
      </CardHeader>

      <CardContent className="border-b py-3 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">
              {selectedPage.label.charAt(0).toUpperCase()}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 font-semibold">
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
        <div className="flex items-start gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 font-semibold">
                {status.label}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              {Status.map((status) => {
                return (
                  <DropdownMenuItem
                    key={status.id}
                    onSelect={() => {
                      setStatus(status);
                    }}
                    className={cn(
                      "flex items-center justify-between",
                      "focus:bg-foreground",
                      "data-[disabled]:opacity-50",
                      "data-[disabled]:cursor-not-allowed"
                    )}
                  >
                    <span>{status.label}</span>
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
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5" />
            Thêm ảnh
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              router.push(
                `/user/post/new/form?postId=${encodeURIComponent(
                  btoa(postData.id)
                )}`
              )
            }
          >
            <FormInputIcon className="w-5 h-5" />
            Thêm form
          </Button>
        </div>

        {/* input hidden – KHÔNG ảnh hưởng UI */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleSelectImages(e.target.files)}
        />
      </CardContent>

      <CardContent className="py-6">
        <label className="block text-sm font-semibold mb-1 text-foreground">
          Chi tiết bài viết
        </label>

        <div className="relative">
          <MarkdownEditor value={postContent} onChange={setPostContent} />
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
