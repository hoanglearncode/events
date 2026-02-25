"use client";

import React, {
  useState,
  useRef,
  useCallback,
  type FC,
  use,
  useEffect,
} from "react";
import {
  Type,
  List,
  CheckSquare,
  Star,
  Upload,
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Redo,
  Undo,
  Eye,
  EyeOff,
  Send,
  FileText,
  X,
  Check,
  Image,
  Link,
  Palette,
  AlignJustify,
  ListOrdered,
  ListIcon,
  Copy,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════
type QuestionType =
  | "text"
  | "textarea"
  | "richtext"
  | "radio"
  | "checkbox"
  | "select"
  | "rating"
  | "scale"
  | "date"
  | "file"
  | "image"
  | "link";

interface OptionItem {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options: OptionItem[];
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

type AnswerValue = string | number | string[] | UploadedFile[] | undefined;

interface FormAnswers {
  [qId: string]: AnswerValue;
}

interface FormErrors {
  [qId: string]: boolean;
}

const QUESTION_TYPE_META: Record<
  QuestionType,
  {
    label: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
  }
> = {
  text: { label: "Câu trả lời ngắn", Icon: Type },
  textarea: { label: "Câu trả lời dài", Icon: FileText },
  richtext: { label: "Rich Text Editor", Icon: FileText },
  radio: { label: "Chọn một đáp án", Icon: CheckSquare },
  checkbox: { label: "Chọn nhiều đáp án", Icon: List },
  select: { label: "Dropdown chọn một", Icon: ChevronDown },
  rating: { label: "Đánh giá (Rating)", Icon: Star },
  scale: { label: "Thang điểm 1–10", Icon: Star },
  date: { label: "Chọn ngày", Icon: Type },
  file: { label: "Upload tệp", Icon: Upload },
  image: { label: "Upload hình ảnh", Icon: Image },
  link: { label: "Nhập URL", Icon: Link },
};

const OPTION_TYPES: QuestionType[] = ["radio", "checkbox", "select"];

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ════════════════════════════════════════════
// RICH TEXT EDITOR
// ════════════════════════════════════════════
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: FC<RichTextEditorProps> = ({ onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [colorOpen, setColorOpen] = useState(false);

  const execCmd = useCallback(
    (cmd: string, val: string | undefined = undefined) => {
      document.execCommand(cmd, false, val);
      editorRef.current?.focus();
      onChange(editorRef.current?.innerHTML || "");
    },
    [onChange]
  );

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        execCmd("bold");
      }
      if (e.key === "i") {
        e.preventDefault();
        execCmd("italic");
      }
      if (e.key === "u") {
        e.preventDefault();
        execCmd("underline");
      }
    }
  };

  const toggleSource = () => {
    if (!showSource) {
      setSourceText(editorRef.current?.innerHTML || "");
      setShowSource(true);
    } else {
      if (editorRef.current) editorRef.current.innerHTML = sourceText;
      onChange(sourceText);
      setShowSource(false);
    }
  };

  const COLORS = [
    "#624a2b",
    "#9c620f",
    "#ab936c",
    "#211d11",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
  ];

  const ToolBtn: FC<{
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );

  const Divider: FC = () => <div className="w-px h-4.5 bg-border mx-1" />;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted border-b border-border flex-wrap">
        <ToolBtn onClick={() => execCmd("bold")} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("italic")} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => execCmd("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn onClick={() => execCmd("justifyLeft")} title="Align Left">
          <AlignLeft size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyCenter")} title="Align Center">
          <AlignCenter size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyRight")} title="Align Right">
          <AlignRight size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("justifyFull")} title="Justify">
          <AlignJustify size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={() => execCmd("insertUnorderedList")}
          title="Bullet List"
        >
          <ListIcon size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => execCmd("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </ToolBtn>
        <Divider />
        <div className="relative">
          <button
            type="button"
            onClick={() => setColorOpen(!colorOpen)}
            className="flex items-center gap-1 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Palette size={14} />
            <ChevronDown
              size={10}
              className={`transition-transform ${colorOpen ? "rotate-180" : ""}`}
            />
          </button>
          {colorOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg p-2 shadow-lg grid grid-cols-4 gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    execCmd("foreColor", c);
                    setColorOpen(false);
                  }}
                  className="w-5 h-5 rounded border-2 border-border hover:border-primary transition-colors"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        <Divider />
        <ToolBtn onClick={() => execCmd("undo")} title="Undo">
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => execCmd("redo")} title="Redo">
          <Redo size={14} />
        </ToolBtn>

        <div className="ml-auto">
          <button
            type="button"
            onClick={toggleSource}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {showSource ? (
              <>
                <EyeOff size={12} /> Editor
              </>
            ) : (
              <>
                <Eye size={12} /> HTML
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {showSource ? (
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="w-full min-h-[120px] bg-input text-accent p-3 text-xs font-mono resize-y outline-none"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder || "Nhập nội dung..."}
          className="min-h-[100px] p-3 text-sm text-foreground leading-relaxed outline-none"
          style={{ fontFamily: "inherit" }}
        />
      )}

      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:var(--color-muted-foreground);pointer-events:none}`}</style>
    </div>
  );
};

// ════════════════════════════════════════════
// FILE PREVIEW CHIP
// ════════════════════════════════════════════
interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

const FilePreview: FC<FilePreviewProps> = ({ file, onRemove }) => (
  <div className="flex items-center gap-3 bg-muted border border-border rounded-lg px-3 py-2">
    {file.preview ? (
      <img
        src={file.preview}
        alt=""
        className="w-9 h-9 rounded-md object-cover"
      />
    ) : (
      <div className="w-9 h-9 rounded-md bg-input flex items-center justify-center">
        <FileText size={18} className="text-primary" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">
        {file.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {(file.size / 1024).toFixed(1)} KB
      </p>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
    >
      <X size={15} />
    </button>
  </div>
);

// ════════════════════════════════════════════
// QUESTION EDITOR (Builder)
// ════════════════════════════════════════════
interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const QuestionEditor: FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onRemove,
  onDuplicate,
}) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const meta = QUESTION_TYPE_META[question.type];
  const hasOptions = OPTION_TYPES.includes(question.type);

  const addOption = () =>
    onUpdate({
      ...question,
      options: [...question.options, { id: uid(), text: "" }],
    });

  const updateOption = (id: string, text: string) =>
    onUpdate({
      ...question,
      options: question.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });

  const removeOption = (id: string) =>
    onUpdate({
      ...question,
      options: question.options.filter((o) => o.id !== id),
    });

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3.5">
        <GripVertical size={16} className="text-border cursor-grab" />
        <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {index + 1}
        </span>
        <span className="text-xs text-muted-foreground flex-1">
          Câu hỏi {index + 1}
        </span>
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
          title="Nhân đôi"
        >
          <Copy size={15} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
          title="Xóa"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Question text */}
      <input
        type="text"
        placeholder="Nhập nội dung câu hỏi..."
        value={question.text}
        onChange={(e) => onUpdate({ ...question, text: e.target.value })}
        className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground font-medium placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />

      {/* Type selector dropdown */}
      <div className="relative mt-2.5">
        <button
          type="button"
          onClick={() => setTypeOpen(!typeOpen)}
          className="flex items-center gap-2 w-full bg-input border border-border rounded-lg px-3.5 py-2 text-sm text-muted-foreground hover:border-primary transition-colors"
        >
          <meta.Icon size={15} color="var(--color-accent)" />
          <span>{meta.label}</span>
          <ChevronDown
            size={13}
            className={`ml-auto transition-transform ${typeOpen ? "rotate-180" : ""}`}
          />
        </button>

        {typeOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto">
            {(
              Object.entries(QUESTION_TYPE_META) as [
                QuestionType,
                (typeof QUESTION_TYPE_META)[QuestionType],
              ][]
            ).map(([type, m]) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const needsOpts = OPTION_TYPES.includes(type);
                  onUpdate({
                    ...question,
                    type,
                    options: needsOpts
                      ? question.options.length
                        ? question.options
                        : [
                            { id: uid(), text: "Tùy chọn 1" },
                            { id: uid(), text: "Tùy chọn 2" },
                          ]
                      : [],
                  });
                  setTypeOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors
                  ${question.type === type ? "bg-muted text-accent font-medium" : "text-foreground hover:bg-muted"}`}
              >
                <m.Icon
                  size={14}
                  color={
                    question.type === type
                      ? "var(--color-accent)"
                      : "var(--color-muted-foreground)"
                  }
                />
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Options editor */}
      {hasOptions && (
        <div className="mt-3 space-y-1.5">
          {question.options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <div
                className={`w-4.5 h-4.5 flex-shrink-0 border-2 border-primary ${question.type === "checkbox" ? "rounded" : "rounded-full"}`}
              />
              <input
                type="text"
                value={opt.text}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                placeholder={`Tùy chọn ${i + 1}`}
                className="flex-1 bg-input border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent border border-dashed border-border hover:border-accent rounded-md px-2.5 py-1.5 transition-colors mt-1"
          >
            <Plus size={11} /> Thêm tùy chọn
          </button>
        </div>
      )}

      {/* Required toggle */}
      <div className="flex items-center gap-2.5 mt-4">
        <button
          type="button"
          onClick={() =>
            onUpdate({ ...question, required: !question.required })
          }
          className={`relative w-9 h-5 rounded-full transition-colors ${question.required ? "bg-primary" : "bg-border"}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${question.required ? "left-4.5" : "left-0.5"}`}
          />
        </button>
        <span className="text-xs text-muted-foreground">Bắt buộc</span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════
// FORM PREVIEW (Respondent View)
// ════════════════════════════════════════════
interface FormPreviewProps {
  questions: Question[];
  formTitle: string;
  formDesc: string;
}

const FormPreview: FC<FormPreviewProps> = ({
  questions,
  formTitle,
  formDesc,
}) => {
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const setAns = (qId: string, val: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [qId]: val }));

  const toggleCheckbox = (qId: string, optId: string) => {
    const cur = (answers[qId] as string[]) || [];
    setAns(
      qId,
      cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId]
    );
  };

  const handleFileUpload = (
    qId: string,
    files: FileList,
    imageOnly: boolean
  ) => {
    const arr: UploadedFile[] = Array.from(files)
      .filter((f) => !imageOnly || f.type.startsWith("image/"))
      .map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      }));
    setAns(qId, [...((answers[qId] as UploadedFile[]) || []), ...arr]);
  };

  const removeFile = (qId: string, idx: number) => {
    const cur = [...((answers[qId] as UploadedFile[]) || [])];
    cur.splice(idx, 1);
    setAns(qId, cur);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    questions.forEach((q) => {
      if (!q.required) return;
      const a = answers[q.id];
      if (a === undefined || a === "" || (Array.isArray(a) && a.length === 0)) {
        errs[q.id] = true;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  // ── Submitted screen ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-4">
        <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center shadow-lg mb-6">
          <Check
            size={36}
            className="text-primary-foreground"
            strokeWidth={3}
          />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Đã gửi thành công!
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Phản hồi của bạn đã được ghi nhận. Cảm ơn bạn!
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
            setErrors({});
          }}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Gửi lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-3.5">
      {/* Form header card */}
      <div className="bg-card border-t-4 border-primary border border-border rounded-xl px-6 py-7 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground mb-1.5">
          {formTitle || "Tiêu đề form"}
        </h1>
        {formDesc && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {formDesc}
          </p>
        )}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Chưa có câu hỏi nào.
        </div>
      )}

      {/* Question cards */}
      {questions.map((q, idx) => {
        const { Icon } = QUESTION_TYPE_META[q.type];
        return (
          <div
            key={q.id}
            className={`bg-card border border-border rounded-xl px-5 py-4.5 shadow-sm transition-colors ${errors[q.id] ? "border-destructive" : ""}`}
          >
            {/* Label */}
            <div className="flex items-start gap-2.5 mb-3">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon size={15} color="var(--color-accent)" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {q.text || `Câu hỏi ${idx + 1}`}
                </span>
                {q.required && <span className="text-destructive ml-1">*</span>}
              </div>
            </div>

            {/* ── Short text ── */}
            {q.type === "text" && (
              <input
                type="text"
                placeholder="Nhập câu trả lời..."
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAns(q.id, e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            )}

            {/* ── Long text ── */}
            {q.type === "textarea" && (
              <textarea
                rows={4}
                placeholder="Nhập câu trả lời dài..."
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAns(q.id, e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y transition-all"
                style={{ fontFamily: "inherit" }}
              />
            )}

            {/* ── Rich text ── */}
            {q.type === "richtext" && (
              <RichTextEditor
                value={(answers[q.id] as string) || ""}
                onChange={(v) => setAns(q.id, v)}
                placeholder="Nhập nội dung..."
              />
            )}

            {/* ── Radio ── */}
            {q.type === "radio" && (
              <div className="space-y-1">
                {q.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                      ${(answers[q.id] as string) === opt.id ? "bg-muted" : "hover:bg-muted/60"}`}
                  >
                    <input
                      type="radio"
                      checked={(answers[q.id] as string) === opt.id}
                      onChange={() => setAns(q.id, opt.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${(answers[q.id] as string) === opt.id ? "border-primary" : "border-border"}`}
                    >
                      {(answers[q.id] as string) === opt.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ── Checkbox ── */}
            {q.type === "checkbox" && (
              <div className="space-y-1">
                {q.options.map((opt) => {
                  const checked = ((answers[q.id] as string[]) || []).includes(
                    opt.id
                  );
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                        ${checked ? "bg-muted" : "hover:bg-muted/60"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheckbox(q.id, opt.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                        ${checked ? "border-primary bg-primary" : "border-border"}`}
                      >
                        {checked && (
                          <Check
                            size={13}
                            className="text-primary-foreground"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span className="text-sm text-foreground">
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* ── Select ── */}
            {q.type === "select" && (
              <select
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAns(q.id, e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="" disabled>
                  Chọn một tùy chọn...
                </option>
                {q.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.text}
                  </option>
                ))}
              </select>
            )}

            {/* ── Rating ── */}
            {q.type === "rating" && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAns(q.id, n)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      fill={
                        (answers[q.id] as number) >= n
                          ? "var(--color-accent)"
                          : "none"
                      }
                      color={
                        (answers[q.id] as number) >= n
                          ? "var(--color-accent)"
                          : "var(--color-border)"
                      }
                    />
                  </button>
                ))}
                {answers[q.id] && (
                  <span className="text-xs text-muted-foreground ml-2">
                   
                  </span>
                )}
              </div>
            )}

            {/* ── Scale 1–10 ── */}
            {q.type === "scale" && (
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAns(q.id, n)}
                    className={`w-9 h-9 rounded-lg border text-xs font-semibold transition-all
                      ${
                        (answers[q.id] as number) === n
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-input border-border text-muted-foreground hover:border-primary"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {/* ── Date ── */}
            {q.type === "date" && (
              <input
                type="date"
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAns(q.id, e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            )}

            {/* ── File / Image Upload ── */}
            {(q.type === "file" || q.type === "image") && (
              <div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg px-4 py-6 cursor-pointer hover:border-primary hover:bg-muted/40 transition-colors">
                  <Upload size={22} className="text-accent mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {q.type === "image"
                      ? "Drag & drop hình ảnh hoặc click để chọn"
                      : "Drag & drop tệp hoặc click để chọn"}
                  </span>
                  <span className="text-xs text-muted-foreground/60 mt-1">
                    {q.type === "image"
                      ? "PNG, JPG, GIF"
                      : "Tất cả các loại tệp"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={q.type === "image" ? "image/*" : undefined}
                    onChange={(e) =>
                      handleFileUpload(
                        q.id,
                        e.target.files!,
                        q.type === "image"
                      )
                    }
                    className="sr-only"
                  />
                </label>
                {((answers[q.id] as UploadedFile[]) || []).length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {((answers[q.id] as UploadedFile[]) || []).map((f, i) => (
                      <FilePreview
                        key={i}
                        file={f}
                        onRemove={() => removeFile(q.id, i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── URL ── */}
            {q.type === "link" && (
              <input
                type="url"
                placeholder="https://example.com"
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAns(q.id, e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            )}

            {/* Error */}
            {errors[q.id] && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                ⚠ Trường này bắt buộc
              </p>
            )}
          </div>
        );
      })}

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[.98] transition-all shadow-sm"
      >
        <Send size={16} /> Gửi Form
      </button>
    </div>
  );
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "text",
    text: "Tên đầy đủ của bạn?",
    required: true,
    options: [],
  },
  {
    id: "q2",
    type: "radio",
    text: "Bạn sử dụng nền tảng này như thế nào?",
    required: true,
    options: [
      { id: "o1", text: "Công việc" },
      { id: "o2", text: "Học thuật" },
      { id: "o3", text: "Giải trí" },
      { id: "o4", text: "Khác" },
    ],
  },
  {
    id: "q3",
    type: "checkbox",
    text: "Chọn các tính năng bạn thích nhất:",
    required: false,
    options: [
      { id: "c1", text: "Giao diện đẹp" },
      { id: "c2", text: "Tốc độ nhanh" },
      { id: "c3", text: "Nhiều tính năng" },
      { id: "c4", text: "Dễ sử dụng" },
    ],
  },
  {
    id: "q4",
    type: "rating",
    text: "Đánh giá trải nghiệm tổng cộng của bạn:",
    required: false,
    options: [],
  },
  {
    id: "q5",
    type: "richtext",
    text: "Chia sẻ phản hồi chi tiết của bạn:",
    required: false,
    options: [],
  },
  {
    id: "q6",
    type: "file",
    text: "Upload tài liệu đính kèm (nếu có):",
    required: false,
    options: [],
  },
];

const GoogleFormClone: FC = () => {
  const id = useSearchParams().get("postId");

  const [mode, setMode] = useState<"builder" | "preview">("builder");
  const [formTitle, setFormTitle] = useState("Mẫu không có tiêu đề");
  const [formDesc, setFormDesc] = useState("");
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);

  useEffect(() => {
    console.log("Object questions:", {
      title: formTitle,
      description: formDesc,
      questions,
    });
  }, [questions, formTitle, formDesc]);
  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { id: uid(), type: "text", text: "", required: false, options: [] },
    ]);

  const updateQuestion = (id: string, data: Partial<Question>) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    );

  const removeQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const duplicateQuestion = (id: string) => {
    const q = questions.find((x) => x.id === id);
    if (q)
      setQuestions((prev) => [
        ...prev,
        {
          ...q,
          id: uid(),
          options: q.options.map((o) => ({ ...o, id: uid() })),
        },
      ]);
  };

  return (
    <div className="min-h-screen bg-background mt-15">
      <header className="bg-card border-b border-border px-5 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText size={22} className="text-primary" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                FormBuilder
              </span>
              <span className="text-xs text-muted-foreground">
                {questions.length} câu hỏi
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-0.5 ml-8 bg-muted rounded-lg p-0.5">
          {(["builder", "preview"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all
                ${mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m === "builder" ? "Thiết kế" : "Xem trước"}
            </button>
          ))}
        </div>
      </header>

      <main className={`max-w-5xl mx-auto px-4 py-7`}>
        {mode === "builder" ? (
          <>
            <div className="bg-card border-t-4 border-primary border border-border rounded-xl px-6 py-6 mb-5 shadow-sm">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Tiêu đề form..."
                className="w-full bg-transparent border-none border-b-2 border-border text-xl font-semibold text-foreground py-2 outline-none focus:border-primary transition-colors placeholder-muted-foreground"
              />
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Thêm mô tả biểu mẫu"
                rows={2}
                className="w-full bg-transparent border-none border-b border-border text-sm text-muted-foreground mt-3 py-2 outline-none focus:border-primary resize-none transition-colors placeholder-muted-foreground/60"
                style={{ fontFamily: "inherit" }}
              />
            </div>

            <div className="space-y-3">
              {questions.map((q, i) => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  index={i}
                  onUpdate={(data) => updateQuestion(q.id, data)}
                  onRemove={() => removeQuestion(q.id)}
                  onDuplicate={() => duplicateQuestion(q.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full mt-3.5 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-muted/40 transition-all"
            >
              <Plus size={17} /> Thêm câu hỏi mới
            </button>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">
                Thêm nhanh theo loại:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  Object.entries(QUESTION_TYPE_META) as [
                    QuestionType,
                    (typeof QUESTION_TYPE_META)[QuestionType],
                  ][]
                ).map(([type, m]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const needsOpts = OPTION_TYPES.includes(type);
                      setQuestions((prev) => [
                        ...prev,
                        {
                          id: uid(),
                          type,
                          text: "",
                          required: false,
                          options: needsOpts
                            ? [
                                { id: uid(), text: "Tùy chọn 1" },
                                { id: uid(), text: "Tùy chọn 2" },
                              ]
                            : [],
                        },
                      ]);
                    }}
                    className="flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <m.Icon size={11} /> {m.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <FormPreview
            questions={questions}
            formTitle={formTitle}
            formDesc={formDesc}
          />
        )}
      </main>
    </div>
  );
};

export default GoogleFormClone;
