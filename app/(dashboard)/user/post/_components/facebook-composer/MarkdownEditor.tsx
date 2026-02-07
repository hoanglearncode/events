"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  className,
}: MarkdownEditorProps) {
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`# Tiêu đề\n\n**In đậm**, *in nghiêng*, danh sách:\n- Item 1\n- Item 2`}
          className="min-h-[220px] border-0 rounded-none focus-visible:ring-0"
        />
    </div>
  );
}
