import { AlignLeft, Calendar, Circle, Clock, ClipboardList, ChevronDown, FileText, LayoutDashboard, List, Square } from "lucide-react";

// ─── Tab ─────────────────────────────────────────────────────────────────────

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export type TabId = "facebook" | "formbuilder";

// ─── Form Builder ────────────────────────────────────────────────────────────

export type QuestionType =
  | "short"
  | "paragraph"
  | "multiple"
  | "checkbox"
  | "dropdown"
  | "date"
  | "time";

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  required: boolean;
  options: string[];
}

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  icon: React.ReactNode;
}



// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const TABS: Tab[] = [
  {
    id: "facebook",
    label: "Nội dung",
    icon: <LayoutDashboard className="w-4 h-4" />,
    description: "Tạo & quản lý bài viết",
  },
  {
    id: "formbuilder",
    label: "Tạo Form",
    icon: <ClipboardList className="w-4 h-4" />,
    description: "Thiết kế form tùy chỉnh",
  },
];

// ─── Question Types ───────────────────────────────────────────────────────────

export const QUESTION_TYPES: QuestionTypeOption[] = [
  { value: "short", label: "Câu trả lời ngắn", icon: <AlignLeft className="w-4 h-4" /> },
  { value: "paragraph", label: "Đoạn văn", icon: <FileText className="w-4 h-4" /> },
  { value: "multiple", label: "Trắc nghiệm", icon: <Circle className="w-4 h-4" /> },
  { value: "checkbox", label: "Hộp kiểm", icon: <Square className="w-4 h-4" /> },
  { value: "dropdown", label: "Danh sách thả xuống", icon: <List className="w-4 h-4" /> },
  { value: "date", label: "Ngày", icon: <Calendar className="w-4 h-4" /> },
  { value: "time", label: "Thời gian", icon: <Clock className="w-4 h-4" /> },
];

// ─── Misc ─────────────────────────────────────────────────────────────────────

/** Question types that render an editable option list */
export const OPTION_TYPES = ["multiple", "checkbox", "dropdown"] as const;

export const PAGE_TITLE = "Hóa Chất Nhật Minh";