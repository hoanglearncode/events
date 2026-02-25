"use client";

import React from "react";
import { Eye, Globe, Image as ImageEmpty } from "lucide-react";
import { PAGE_TITLE } from "../../_utils/constants";
import renderImages from "./RenderImages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostPreviewProps {
  postContent: string;
  images?: File[];
}

export default function PostPreview({ postContent, images }: PostPreviewProps) {
  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="p-6 flex items-center gap-2"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(to right, var(--muted), var(--input))",
        }}
      >
        <Eye className="w-5 h-5" style={{ color: "var(--accent)" }} />
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Xem trước bài đăng
        </h2>
      </div>

      {/* ── Preview card ── */}
      <div className="p-6">
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          {/* author row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <span
                  style={{ color: "var(--primary-foreground)" }}
                  className="font-bold text-sm"
                >
                  N
                </span>
              </div>
              <div>
                <h3
                  className="font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {PAGE_TITLE}
                </h3>
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span>Vừa xong</span>
                  <Globe className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* body or skeleton */}
          {postContent ? (
            <div className="mb-4 prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {postContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="mb-4 space-y-2">
              <div
                className="h-4 rounded w-3/4"
                style={{ backgroundColor: "var(--border)" }}
              />
              <div
                className="h-4 rounded w-1/2"
                style={{ backgroundColor: "var(--border)" }}
              />
            </div>
          )}

          {/* image placeholder */}
          <div
            className="relative rounded-xl aspect-video mb-4 overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            {images && images.length > 0 ? (
              renderImages(images)
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageEmpty
                  className="w-12 h-12"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            )}
          </div>

          {/* action bar */}
          <div
            className="flex items-center justify-around pt-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {["Thích", "Bình luận", "Chia sẻ"].map((label) => (
              <button
                key={label}
                className="px-4 py-2 rounded-lg transition-all text-sm font-medium"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--border)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
