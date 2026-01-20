import { useState } from "react";
import { AlertCircle, Copy, Check } from "lucide-react";

interface RichTextDisplayProps {
  htmlContent: string;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showCopyButton?: boolean;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  htmlContent,
  className = "",
  maxWidth = "2xl",
  showCopyButton = false,
}) => {
  const [copied, setCopied] = useState(false);

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
    full: "max-w-full",
  };

  const copyContent = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Kiểm tra content có hợp lệ không
  const isValidContent = htmlContent && htmlContent.trim() !== "";

  if (!isValidContent) {
    return (
      <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
        <div className="flex items-center gap-3 p-4 bg-muted border border-border rounded-lg text-muted-foreground">
          <AlertCircle size={20} />
          <span className="text-sm">Chưa có nội dung để hiển thị</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      <div className="relative bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {showCopyButton && (
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={copyContent}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-background/80 backdrop-blur-sm hover:bg-background border border-border rounded-md transition-all shadow-sm"
              title="Copy nội dung"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[var(--brand-success)]" />
                  <span className="text-[var(--brand-success)]">Đã copy</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        <div
          className="rich-text-content p-6 md:p-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <style>{`
        /* Rich Text Content Styling */
        .rich-text-content {
          color: var(--foreground);
          line-height: 1.7;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Headers */
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          color: var(--foreground);
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }

        .rich-text-content h1:first-child,
        .rich-text-content h2:first-child,
        .rich-text-content h3:first-child,
        .rich-text-content h4:first-child,
        .rich-text-content h5:first-child,
        .rich-text-content h6:first-child {
          margin-top: 0;
        }

        .rich-text-content h1 {
          font-size: 2em;
          font-weight: 700;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rich-text-content h2 {
          font-size: 1.5em;
          font-weight: 600;
        }

        .rich-text-content h3 {
          font-size: 1.25em;
          font-weight: 600;
        }

        .rich-text-content h4 {
          font-size: 1.125em;
          font-weight: 600;
        }

        .rich-text-content h5 {
          font-size: 1em;
          font-weight: 600;
        }

        .rich-text-content h6 {
          font-size: 0.875em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Paragraphs */
        .rich-text-content p {
          margin-bottom: 1em;
          line-height: 1.7;
        }

        .rich-text-content p:last-child {
          margin-bottom: 0;
        }

        /* Links */
        .rich-text-content a {
          color: var(--brand-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: all 0.2s ease;
        }

        .rich-text-content a:hover {
          color: var(--brand-secondary);
          text-decoration-thickness: 2px;
        }

        /* Lists */
        .rich-text-content ul,
        .rich-text-content ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }

        .rich-text-content ul {
          list-style-type: disc;
        }

        .rich-text-content ol {
          list-style-type: decimal;
        }

        .rich-text-content li {
          margin-bottom: 0.5em;
          line-height: 1.7;
        }

        .rich-text-content li:last-child {
          margin-bottom: 0;
        }

        .rich-text-content ul ul,
        .rich-text-content ol ol,
        .rich-text-content ul ol,
        .rich-text-content ol ul {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .rich-text-content ul ul {
          list-style-type: circle;
        }

        .rich-text-content ul ul ul {
          list-style-type: square;
        }

        /* Blockquote */
        .rich-text-content blockquote {
          border-left: 4px solid var(--brand-primary);
          padding: 1em 1.5em;
          margin: 1.5em 0;
          background: var(--muted);
          border-radius: 0 0.5rem 0.5rem 0;
          color: var(--muted-foreground);
          font-style: italic;
        }

        .rich-text-content blockquote p {
          margin: 0;
        }

        .rich-text-content blockquote p:not(:last-child) {
          margin-bottom: 0.75em;
        }

        /* Code */
        .rich-text-content code {
          background: var(--muted);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9em;
          color: var(--foreground);
          border: 1px solid var(--border);
        }

        .rich-text-content pre {
          background: var(--muted);
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5em 0;
          border: 1px solid var(--border);
        }

        .rich-text-content pre code {
          background: none;
          padding: 0;
          border: none;
          font-size: 0.875em;
          line-height: 1.5;
        }

        /* Scrollbar cho code blocks */
        .rich-text-content pre::-webkit-scrollbar {
          height: 8px;
        }

        .rich-text-content pre::-webkit-scrollbar-track {
          background: var(--background);
          border-radius: 4px;
        }

        .rich-text-content pre::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }

        .rich-text-content pre::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }

        /* Text formatting */
        .rich-text-content strong {
          font-weight: 600;
          color: var(--foreground);
        }

        .rich-text-content em {
          font-style: italic;
        }

        .rich-text-content u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .rich-text-content s,
        .rich-text-content strike {
          text-decoration: line-through;
          opacity: 0.7;
        }

        /* Horizontal rule */
        .rich-text-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2em 0;
        }

        /* Images (nếu có) */
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5em 0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        /* Tables (nếu có) */
        .rich-text-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          overflow: hidden;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
        }

        .rich-text-content th,
        .rich-text-content td {
          padding: 0.75em 1em;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .rich-text-content th {
          background: var(--muted);
          font-weight: 600;
          color: var(--foreground);
        }

        .rich-text-content tr:last-child td {
          border-bottom: none;
        }

        .rich-text-content tbody tr:hover {
          background: var(--muted);
        }

        /* Alignment classes */
        .rich-text-content .ql-align-center {
          text-align: center;
        }

        .rich-text-content .ql-align-right {
          text-align: right;
        }

        .rich-text-content .ql-align-justify {
          text-align: justify;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .rich-text-content {
            padding: 1rem;
          }

          .rich-text-content h1 {
            font-size: 1.75em;
          }

          .rich-text-content h2 {
            font-size: 1.4em;
          }

          .rich-text-content h3 {
            font-size: 1.2em;
          }

          .rich-text-content pre {
            padding: 0.75em;
            font-size: 0.875em;
          }

          .rich-text-content blockquote {
            padding: 0.75em 1em;
          }
        }

        /* Print styles */
        @media print {
          .rich-text-content {
            color: black;
          }

          .rich-text-content a {
            color: blue;
            text-decoration: underline;
          }

          .rich-text-content pre,
          .rich-text-content blockquote {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

// Demo Component
const RichTextDisplayDemo = () => {
  // Dữ liệu giả lập từ BE
  const sampleContent1 = `
    <h1 class="text-4xl font-bold mb-4 mt-6 text-foreground">Tiêu đề chính của bài viết</h1>
    <p class="mb-4 leading-7 text-foreground">Đây là một đoạn văn bản giới thiệu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    
    <h2 class="text-3xl font-semibold mb-3 mt-5 text-foreground">Tiêu đề cấp 2</h2>
    <p class="mb-4 leading-7 text-foreground">Nội dung với <strong class="font-semibold">chữ đậm</strong>, <em class="italic">chữ nghiêng</em>, và <u>gạch chân</u>. Cũng có thể có <a class="text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] underline transition-colors" href="https://example.com">link đến trang khác</a>.</p>
    
    <h3 class="text-2xl font-semibold mb-3 mt-4 text-foreground">Danh sách</h3>
    <ul class="list-disc list-inside mb-4 space-y-2 text-foreground">
      <li class="leading-7">Mục danh sách thứ nhất</li>
      <li class="leading-7">Mục danh sách thứ hai với nội dung dài hơn để test responsive</li>
      <li class="leading-7">Mục danh sách thứ ba</li>
    </ul>
    
    <blockquote class="border-l-4 border-[var(--brand-primary)] pl-4 py-2 mb-4 text-muted-foreground italic bg-muted/30 rounded-r">
      <p class="mb-4 leading-7 text-foreground">Đây là một trích dẫn quan trọng. Nó được hiển thị với style đặc biệt để nổi bật trong nội dung.</p>
    </blockquote>
    
    <h3 class="text-2xl font-semibold mb-3 mt-4 text-foreground">Code Example</h3>
    <p class="mb-4 leading-7 text-foreground">Inline code: <code class="bg-muted px-2 py-0.5 rounded text-sm font-mono">const hello = "world";</code></p>
    
    <pre class="bg-muted p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono border border-border"><code>function example() {
  console.log("Hello World");
  return true;
}</code></pre>
    
    <ol class="list-decimal list-inside mb-4 space-y-2 text-foreground">
      <li class="leading-7">Bước đầu tiên trong quy trình</li>
      <li class="leading-7">Bước thứ hai quan trọng</li>
      <li class="leading-7">Bước cuối cùng để hoàn thành</li>
    </ol>
  `;

  const sampleContent2 = `
    <h2 class="text-3xl font-semibold mb-3 mt-5 text-foreground">Nội dung ngắn gọn</h2>
    <p class="mb-4 leading-7 text-foreground">Đây là một ví dụ với nội dung ngắn hơn. Hệ thống vẫn hiển thị đẹp và nhất quán.</p>
  `;

  const emptyContent = "";

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">
          Rich Text Display Component
        </h1>
        <p className="text-muted-foreground mb-8">
          Component để hiển thị nội dung HTML từ backend một cách an toàn và đẹp
          mắt
        </p>

        {/* Example 1: Full content with copy button */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--brand-success)]" />
            <h2 className="text-xl font-semibold">
              Example 1: Nội dung đầy đủ (có nút copy)
            </h2>
          </div>
          <RichTextDisplay
            htmlContent={sampleContent1}
            maxWidth="lg"
            showCopyButton={true}
          />
        </div>

        {/* Example 2: Short content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)]" />
            <h2 className="text-xl font-semibold">Example 2: Nội dung ngắn</h2>
          </div>
          <RichTextDisplay htmlContent={sampleContent2} maxWidth="md" />
        </div>

        {/* Example 3: Empty content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--brand-warning)]" />
            <h2 className="text-xl font-semibold">
              Example 3: Không có nội dung
            </h2>
          </div>
          <RichTextDisplay htmlContent={emptyContent} maxWidth="md" />
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Cách sử dụng</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {`import RichTextDisplay from './RichTextDisplay';

            // Lấy HTML từ API
            const content = await fetch('/api/posts/1').then(r => r.json());

            // Hiển thị
            <RichTextDisplay 
              htmlContent={content.html}
              maxWidth="lg"           // sm, md, lg, xl, 2xl, full
              showCopyButton={true}   // Hiển thị nút copy
              className="my-8"        // Custom classes
            />`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RichTextDisplayDemo;
