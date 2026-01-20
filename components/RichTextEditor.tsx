"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, FileCode, Copy, Check, X, Trash2 } from "lucide-react";

// Declare Quill on Window
declare global {
  interface Window {
    Quill: any;
  }
}

interface RichTextEditorProps {
  value?: string; // ✅ controlled value
  onChange?: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Bắt đầu viết nội dung của bạn...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [savedSelection, setSavedSelection] = useState<any>(null);

  useEffect(() => {
    // Load Quill CSS
    const cssId = "quill-cdn-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
      document.head.appendChild(link);
    }

    // Load Quill JS
    const scriptId = "quill-cdn-js";
    const initQuill = () => {
      if (window.Quill && editorRef.current && !quillRef.current) {
        const toolbarOptions = [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link"],
          [{ align: [] }],
          ["clean"],
        ];

        const q = new window.Quill(editorRef.current, {
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                link: function (value: boolean) {
                  if (value) {
                    const selection = q.getSelection();
                    if (selection) {
                      const text = q.getText(selection.index, selection.length);
                      setSavedSelection(selection);
                      setLinkText(text);
                      setLinkUrl("");
                      setShowLinkModal(true);
                    }
                  } else {
                    q.format("link", false);
                  }
                },
              },
            },
          },
          theme: "snow",
          placeholder: placeholder,
        });

        quillRef.current = q;

        if (value && q.root.innerHTML !== value) {
          q.root.innerHTML = value;
        }

        let typingTimer: NodeJS.Timeout | null = null;
        q.on("text-change", () => {
          if (typingTimer) clearTimeout(typingTimer);
          typingTimer = setTimeout(() => {
            updateContent();
          }, 400);
        });

        updateContent();
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.quilljs.com/1.3.6/quill.js";
      script.onload = initQuill;
      document.body.appendChild(script);
    } else {
      initQuill();
    }
  }, [value, placeholder]);

  // Handle Escape key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLinkModal) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLinkModal]);

  const updateContent = () => {
    const q = quillRef.current;
    if (!q) return;

    let html = enhanceHTML(q.root.innerHTML);

    onChange?.(html); // 🔥 RHF nhận dữ liệu
  };

  const enhanceHTML = (html: string): string => {
    // Thêm classes Tailwind/custom cho các elements
    let enhanced = html;

    // Headers
    enhanced = enhanced.replace(
      /<h1>/g,
      '<h1 class="text-4xl font-bold mb-4 mt-6 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<h2>/g,
      '<h2 class="text-3xl font-semibold mb-3 mt-5 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<h3>/g,
      '<h3 class="text-2xl font-semibold mb-3 mt-4 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<h4>/g,
      '<h4 class="text-xl font-medium mb-2 mt-3 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<h5>/g,
      '<h5 class="text-lg font-medium mb-2 mt-3 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<h6>/g,
      '<h6 class="text-base font-medium mb-2 mt-2 text-foreground">'
    );

    // Paragraphs
    enhanced = enhanced.replace(
      /<p>/g,
      '<p class="mb-4 leading-7 text-foreground">'
    );

    // Links
    enhanced = enhanced.replace(
      /<a /g,
      '<a class="text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] underline transition-colors" '
    );

    // Lists
    enhanced = enhanced.replace(
      /<ul>/g,
      '<ul class="list-disc list-inside mb-4 space-y-2 text-foreground">'
    );
    enhanced = enhanced.replace(
      /<ol>/g,
      '<ol class="list-decimal list-inside mb-4 space-y-2 text-foreground">'
    );
    enhanced = enhanced.replace(/<li>/g, '<li class="leading-7">');

    // Blockquote
    enhanced = enhanced.replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-[var(--brand-primary)] pl-4 py-2 mb-4 text-muted-foreground italic bg-muted/30 rounded-r">'
    );

    // Code blocks
    enhanced = enhanced.replace(
      /<pre class="ql-syntax">/g,
      '<pre class="bg-muted p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono border border-border">'
    );

    // Inline code
    enhanced = enhanced.replace(
      /<code>/g,
      '<code class="bg-muted px-2 py-0.5 rounded text-sm font-mono">'
    );

    // Strong/Bold
    enhanced = enhanced.replace(/<strong>/g, '<strong class="font-semibold">');

    // Em/Italic
    enhanced = enhanced.replace(/<em>/g, '<em class="italic">');

    return enhanced;
  };

  const insertLink = () => {
    const q = quillRef.current;
    if (!q || !linkUrl || !savedSelection) return;

    // Restore selection
    q.setSelection(savedSelection.index, savedSelection.length);

    if (linkText && linkText.trim()) {
      // Nếu có text mới, xóa text cũ và insert text mới với link
      q.deleteText(savedSelection.index, savedSelection.length);
      q.insertText(savedSelection.index, linkText, { link: linkUrl });
      q.setSelection(savedSelection.index + linkText.length, 0);
    } else {
      // Nếu không có text mới, chỉ format text đã chọn thành link
      q.formatText(
        savedSelection.index,
        savedSelection.length,
        "link",
        linkUrl
      );
    }

    // Force update content
    setTimeout(() => {
      updateContent();
    }, 100);

    // Reset states
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    setSavedSelection(null);
  };

  const closeModal = () => {
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    setSavedSelection(null);
  };

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Editor */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
        <div
          ref={editorRef}
          className="min-h-[100px]"
          style={{
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thêm Link</h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Text hiển thị
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Nhập text (để trống để giữ text đã chọn)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && linkUrl) {
                      insertLink();
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1.5">
                  URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && linkUrl) {
                      insertLink();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Chèn Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .ql-container {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
        }

        .ql-editor {
          min-height: 400px;
          color: var(--foreground);
          background: var(--card);
          padding: 1.5rem;
        }

        .ql-editor.ql-blank::before {
          color: var(--muted-foreground);
          font-style: normal;
        }

        .ql-toolbar {
          background: var(--muted);
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          padding: 12px;
        }

        .ql-stroke {
          stroke: var(--foreground);
        }

        .ql-fill {
          fill: var(--foreground);
        }

        .ql-picker-label {
          color: var(--foreground);
        }

        .ql-toolbar button:hover,
        .ql-toolbar button.ql-active {
          background: var(--background);
        }

        .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--brand-primary);
        }

        .ql-toolbar button.ql-active .ql-fill {
          fill: var(--brand-primary);
        }

        .ql-editor a {
          color: var(--brand-primary);
          text-decoration: underline;
        }

        .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }

        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .ql-editor blockquote {
          border-left: 4px solid var(--brand-primary);
          padding-left: 16px;
          margin: 16px 0;
          color: var(--muted-foreground);
        }

        .ql-editor code {
          background: var(--muted);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9em;
        }

        .ql-editor pre {
          background: var(--muted);
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.9em;
        }

        /* Prose styling for preview */
        .prose {
          max-width: 100%;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: var(--foreground);
        }

        .prose a {
          color: var(--brand-primary);
        }

        .prose code {
          color: var(--foreground);
          background: var(--muted);
        }

        .prose pre {
          background: var(--muted);
          color: var(--foreground);
        }

        .prose blockquote {
          border-left-color: var(--brand-primary);
          color: var(--muted-foreground);
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-from-top-4 {
          from { transform: translateY(-1rem); }
          to { transform: translateY(0); }
        }

        @keyframes zoom-in-95 {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }

        .animate-in {
          animation: fade-in 0.3s ease-out;
        }

        .fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .slide-in-from-top-4 {
          animation: slide-in-from-top-4 0.3s ease-out;
        }

        .zoom-in-95 {
          animation: zoom-in-95 0.2s ease-out;
        }

        .duration-300 {
          animation-duration: 0.3s;
        }

        .duration-200 {
          animation-duration: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
