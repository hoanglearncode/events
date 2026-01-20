import {
  Type,
  AlignLeft,
  FileText,
  Code,
  Image,
  Upload,
  Youtube,
  Link2,
  Hash,
  Calendar,
  Palette,
  Split,
  List,
  Check,
  ToggleLeft,
  Table,
  ListTree,
  Layers,
  ChevronDown,
  Map,
  BarChart3,
  Sparkles,
} from "lucide-react";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "gallery"
  | "file"
  | "url"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "toggle"
  | "slider"
  | "color"
  | "list"
  | "keyvalue"
  | "json"
  | "code"
  | "table"
  | "repeater"
  | "group"
  | "tabs"
  | "accordion"
  | "video"
  | "map"
  | "chart"
  | "wysiwyg";

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  width?: "full" | "half" | "third" | "quarter";
}

export interface Frame {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: FieldConfig[];
  data: Record<string, any>; // Dữ liệu value thực tế
}

export interface FrameTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  fields: Partial<FieldConfig>[];
  isCustom?: boolean;
}

// Giữ nguyên cấu hình Field Types khổng lồ của bạn
export const FIELD_TYPES: Record<
  FieldType,
  { label: string; icon: any; category: string }
> = {
  text: { label: "Text ngắn", icon: Type, category: "text" },
  textarea: { label: "Text dài", icon: AlignLeft, category: "text" },
  richtext: { label: "Rich Text", icon: FileText, category: "text" },
  wysiwyg: { label: "WYSIWYG", icon: FileText, category: "text" },
  code: { label: "Code", icon: Code, category: "text" },
  image: { label: "Hình ảnh", icon: Image, category: "media" },
  gallery: { label: "Gallery", icon: Image, category: "media" },
  file: { label: "File", icon: Upload, category: "media" },
  video: { label: "Video", icon: Youtube, category: "media" },
  url: { label: "URL", icon: Link2, category: "input" },
  number: { label: "Số", icon: Hash, category: "input" },
  date: { label: "Ngày", icon: Calendar, category: "input" },
  datetime: { label: "Ngày & Giờ", icon: Calendar, category: "input" },
  time: { label: "Giờ", icon: Calendar, category: "input" },
  color: { label: "Màu sắc", icon: Palette, category: "input" },
  slider: { label: "Slider", icon: Split, category: "input" },
  select: { label: "Dropdown", icon: List, category: "choice" },
  multiselect: { label: "Multi-select", icon: List, category: "choice" },
  checkbox: { label: "Checkbox", icon: Check, category: "choice" },
  radio: { label: "Radio", icon: ToggleLeft, category: "choice" },
  toggle: { label: "Toggle", icon: ToggleLeft, category: "choice" },
  list: { label: "List", icon: List, category: "structure" },
  keyvalue: { label: "Key-Value", icon: List, category: "structure" },
  table: { label: "Table", icon: Table, category: "structure" },
  json: { label: "JSON", icon: Code, category: "structure" },
  repeater: { label: "Repeater", icon: ListTree, category: "structure" },
  group: { label: "Group", icon: Layers, category: "structure" },
  tabs: { label: "Tabs", icon: Layers, category: "layout" },
  accordion: { label: "Accordion", icon: ChevronDown, category: "layout" },
  map: { label: "Map", icon: Map, category: "advanced" },
  chart: { label: "Chart", icon: BarChart3, category: "advanced" },
};

export const FIELD_CATEGORIES = {
  text: { label: "Văn bản", icon: Type },
  media: { label: "Media", icon: Image },
  input: { label: "Input", icon: Hash },
  choice: { label: "Lựa chọn", icon: Check },
  structure: { label: "Cấu trúc", icon: Layers },
  layout: { label: "Layout", icon: Split },
  advanced: { label: "Nâng cao", icon: Sparkles },
};
