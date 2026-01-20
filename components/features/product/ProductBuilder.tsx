"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, X, Wand2 } from "lucide-react";

// Field types - ĐÃ XÓA richtext, wysiwyg
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "select"
  | "multiselect"
  | "toggle"
  | "checkbox"
  | "slider"
  | "color"
  | "image"
  | "gallery"
  | "video"
  | "keyvalue"
  | "list"
  | "table"
  | "repeater"
  | "group"
  | "json";

interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  width?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

interface Frame {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: FieldConfig[];
  data: Record<string, any>;
}

interface FrameTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  fields: Partial<FieldConfig>[];
}

// ĐÃ XÓA richtext, wysiwyg
const FIELD_TYPES: Record<FieldType, { label: string; category: string }> = {
  text: { label: "Text", category: "basic" },
  textarea: { label: "Textarea", category: "basic" },
  number: { label: "Number", category: "basic" },
  url: { label: "URL", category: "basic" },
  select: { label: "Select", category: "basic" },
  multiselect: { label: "Multi Select", category: "basic" },
  toggle: { label: "Toggle", category: "basic" },
  checkbox: { label: "Checkbox", category: "basic" },
  slider: { label: "Slider", category: "basic" },
  color: { label: "Color", category: "basic" },
  image: { label: "Image URL", category: "media" },
  gallery: { label: "Gallery URLs", category: "media" },
  video: { label: "Video URL", category: "media" },
  keyvalue: { label: "Key-Value", category: "advanced" },
  list: { label: "List", category: "advanced" },
  table: { label: "Table", category: "advanced" },
  repeater: { label: "Repeater", category: "advanced" },
  group: { label: "Group", category: "advanced" },
  json: { label: "JSON", category: "advanced" },
};

const FIELD_CATEGORIES = {
  basic: { label: "Cơ bản" },
  media: { label: "Media (Link Only)" },
  advanced: { label: "Nâng cao" },
};

// ĐÃ CẬP NHẬT templates - xóa richtext/wysiwyg
const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "overview",
    name: "Tổng quan",
    icon: "📝",
    color: "primary",
    category: "basic",
    fields: [
      { type: "text", label: "Tiêu đề", required: true },
      { type: "textarea", label: "Mô tả chi tiết" },
      { type: "image", label: "Ảnh đại diện" },
    ],
  },
  {
    id: "features",
    name: "Tính năng",
    icon: "⭐",
    color: "accent",
    category: "basic",
    fields: [
      { type: "text", label: "Tên tính năng", required: true },
      { type: "textarea", label: "Mô tả" },
      { type: "list", label: "Lợi ích" },
    ],
  },
  {
    id: "pricing",
    name: "Bảng giá",
    icon: "💰",
    color: "success",
    category: "basic",
    fields: [
      { type: "text", label: "Tên gói", required: true },
      { type: "number", label: "Giá", required: true },
      { type: "select", label: "Đơn vị", options: ["VND", "USD", "EUR"] },
      { type: "toggle", label: "Phổ biến" },
    ],
  },
  {
    id: "faq",
    name: "FAQ",
    icon: "❓",
    color: "warning",
    category: "basic",
    fields: [
      { type: "text", label: "Câu hỏi", required: true },
      { type: "textarea", label: "Câu trả lời", required: true },
    ],
  },
  {
    id: "media",
    name: "Media",
    icon: "🎬",
    color: "accent",
    category: "media",
    fields: [
      { type: "image", label: "Hình ảnh" },
      { type: "gallery", label: "Thư viện ảnh" },
      { type: "video", label: "Video" },
    ],
  },
];
export default function ProductBuilder({
  onExport,
  onChange,
  onSave,
  initialData,
}: {
  onExport?: (data: any) => void;
  onChange?: (schema: any) => void;
  onSave?: () => void;
  initialData: string;
}) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [showFrameCreator, setShowFrameCreator] = useState(false);
  const [newFrameName, setNewFrameName] = useState("");
  const [newFrameIcon, setNewFrameIcon] = useState("📦");
  const [openFieldPickerFor, setOpenFieldPickerFor] = useState<string | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo dữ liệu từ initialData (nếu có)
  useEffect(() => {
    if (isInitialized || !initialData) return;

    try {
      const parsed = JSON.parse(initialData);
      if (parsed.schema && parsed.data) {
        // Reconstruct frames từ schema và data
        const reconstructedFrames: Frame[] = parsed.schema.map(
          (frameSchema: any) => {
            const frameData = parsed.data.find(
              (d: any) => d.frameId === frameSchema.id
            );
            return {
              id: frameSchema.id,
              name: frameSchema.name,
              icon: frameSchema.icon,
              color: frameSchema.color,
              fields: frameSchema.fields,
              data: frameData?.values || {},
            };
          }
        );
        setFrames(reconstructedFrames);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to parse initialData:", error);
      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  // Chỉ gọi onChange khi frames thay đổi (không phải khi modal mở/đóng)
  useEffect(() => {
    if (!onChange || !isInitialized) return;

    const schema = {
      schema: frames.map((frame) => ({
        id: frame.id,
        name: frame.name,
        icon: frame.icon,
        color: frame.color,
        fields: frame.fields,
      })),
      data: frames.map((frame) => ({
        frameId: frame.id,
        values: frame.data,
      })),
    };

    onChange(schema);
  }, [frames]); // Bỏ onChange khỏi dependency để tránh loop
  const addFrameFromTemplate = useCallback((template: FrameTemplate) => {
    const ts = Date.now();
    const newFrame: Frame = {
      id: `${template.id}-${ts}`,
      name: template.name,
      icon: template.icon,
      color: template.color,
      fields: template.fields.map(
        (f, idx) =>
          ({
            id: `f-${ts}-${idx}`,
            type: (f.type || "text") as FieldType,
            label: f.label || "New Field",
            width: "full",
            required: !!f.required,
            ...f,
          }) as FieldConfig
      ),
      data: {},
    };
    setFrames((prev) => [...prev, newFrame]);
  }, []);

  const createCustomFrame = useCallback(() => {
    if (!newFrameName.trim()) return;
    const ts = Date.now();
    const newFrame: Frame = {
      id: `custom-${ts}`,
      name: newFrameName.trim(),
      icon: newFrameIcon,
      color: "primary",
      fields: [],
      data: {},
    };
    setFrames((prev) => [...prev, newFrame]);
    setShowFrameCreator(false);
    setNewFrameName("");
    setNewFrameIcon("📦");
  }, [newFrameName, newFrameIcon]);

  const deleteFrame = (id: string) =>
    setFrames((prev) => prev.filter((f) => f.id !== id));

  const addField = useCallback((frameId: string, fieldType: FieldType) => {
    const typeConfig = FIELD_TYPES[fieldType];
    const newField: FieldConfig = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: typeConfig?.label || fieldType,
      width: "full",
      required: false,
    };

    // Set default values based on type
    if (fieldType === "list" || fieldType === "gallery") {
      newField.defaultValue = [];
    } else if (fieldType === "keyvalue") {
      newField.defaultValue = {};
    } else if (fieldType === "multiselect") {
      newField.defaultValue = [];
    } else if (fieldType === "toggle" || fieldType === "checkbox") {
      newField.defaultValue = false;
    }

    setFrames((prev) =>
      prev.map((f) =>
        f.id === frameId ? { ...f, fields: [...f.fields, newField] } : f
      )
    );
    setOpenFieldPickerFor(null);
  }, []);

  const removeField = (frameId: string, fieldId: string) => {
    setFrames((prev) =>
      prev.map((f) =>
        f.id === frameId
          ? { ...f, fields: f.fields.filter((field) => field.id !== fieldId) }
          : f
      )
    );
  };

  const updateFieldConfig = (
    frameId: string,
    fieldId: string,
    updates: Partial<FieldConfig>
  ) => {
    setFrames((prev) =>
      prev.map((f) =>
        f.id === frameId
          ? {
              ...f,
              fields: f.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : f
      )
    );
  };

  const updateFieldData = (frameId: string, fieldId: string, value: any) => {
    setFrames((prev) =>
      prev.map((f) =>
        f.id === frameId ? { ...f, data: { ...f.data, [fieldId]: value } } : f
      )
    );
  };

  const handleExport = () => {
    const exportData = {
      schema: frames.map((frame) => ({
        id: frame.id,
        name: frame.name,
        icon: frame.icon,
        color: frame.color,
        fields: frame.fields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required,
          width: field.width,
          ...(field.options && { options: field.options }),
          ...(field.min !== undefined && { min: field.min }),
          ...(field.max !== undefined && { max: field.max }),
          ...(field.step !== undefined && { step: field.step }),
          ...(field.placeholder && { placeholder: field.placeholder }),
        })),
      })),
      data: frames.map((frame) => ({
        frameId: frame.id,
        frameName: frame.name,
        values: frame.data,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        totalFrames: frames.length,
        totalFields: frames.reduce((sum, f) => sum + f.fields.length, 0),
      },
    };

    if (onExport) {
      onExport(exportData);
      return;
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-schema-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ĐÃ ĐƠN GIẢN HÓA - Xóa richtext/wysiwyg, media chỉ nhập URL
  const renderFieldPreview = (frame: Frame, field: FieldConfig) => {
    const val = frame.data?.[field.id] ?? field.defaultValue ?? "";
    const setVal = (v: any) => updateFieldData(frame.id, field.id, v);

    switch (field.type) {
      case "text":
      case "url":
        return (
          <input
            type={field.type}
            value={String(val)}
            onChange={(e) => setVal(e.target.value)}
            placeholder={field.placeholder || ""}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={Number(val) || ""}
            onChange={(e) => setVal(Number(e.target.value))}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder || ""}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        );

      case "textarea":
        return (
          <textarea
            value={String(val)}
            onChange={(e) => setVal(e.target.value)}
            rows={4}
            placeholder={field.placeholder || ""}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        );

      case "select":
        return (
          <select
            value={String(val)}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">-- Chọn --</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiselect": {
        const selectedValues = Array.isArray(val) ? val : [];
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVal([...selectedValues, opt]);
                    } else {
                      setVal(selectedValues.filter((v) => v !== opt));
                    }
                  }}
                  className="w-4 h-4 rounded border-border"
                />
                {opt}
              </label>
            ))}
          </div>
        );
      }

      case "toggle":
      case "checkbox":
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={!!val}
                onChange={(e) => setVal(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm">{val ? "Bật" : "Tắt"}</span>
          </label>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={Number(val) || 0}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-center text-muted-foreground">
              Giá trị: {Number(val) || 0}
            </div>
          </div>
        );

      case "color":
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={String(val || "#000000")}
              onChange={(e) => setVal(e.target.value)}
              className="h-10 w-20 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={String(val || "#000000")}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm font-mono"
            />
          </div>
        );

      // ĐÃ ĐƠN GIẢN HÓA - CHỈ NHẬP URL
      case "image":
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={String(val)}
              onChange={(e) => setVal(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
            />
            <p className="text-xs text-muted-foreground">
              📎 Chỉ nhập URL hình ảnh
            </p>
          </div>
        );

      case "video":
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={String(val)}
              onChange={(e) => setVal(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
            />
            <p className="text-xs text-muted-foreground">
              📎 Nhập URL video (YouTube, Vimeo, v.v.)
            </p>
          </div>
        );

      // GALLERY - DANH SÁCH URLs
      case "gallery": {
        const items = Array.isArray(val) ? val : [];
        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              📎 Danh sách URL hình ảnh
            </p>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  value={String(item)}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = e.target.value;
                    setVal(newItems);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <button
                  onClick={() => setVal(items.filter((_, i) => i !== idx))}
                  className="px-3 py-2 border border-border rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setVal([...items, ""])}
              className="w-full px-3 py-2 border border-dashed border-border rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              + Thêm URL
            </button>
          </div>
        );
      }

      case "list": {
        const items = Array.isArray(val) ? val : [];
        return (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={String(item)}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = e.target.value;
                    setVal(newItems);
                  }}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <button
                  onClick={() => setVal(items.filter((_, i) => i !== idx))}
                  className="px-3 py-2 border border-border rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setVal([...items, ""])}
              className="w-full px-3 py-2 border border-dashed border-border rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              + Thêm mục
            </button>
          </div>
        );
      }

      case "keyvalue": {
        const obj = typeof val === "object" && val !== null ? val : {};
        const entries = Object.entries(obj);
        return (
          <div className="space-y-2">
            {entries.map(([key, value], idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={key}
                  onChange={(e) => {
                    const newObj = { ...obj };
                    delete newObj[key];
                    newObj[e.target.value] = value;
                    setVal(newObj);
                  }}
                  placeholder="Key"
                  className="w-1/3 px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <input
                  value={String(value)}
                  onChange={(e) => {
                    setVal({ ...obj, [key]: e.target.value });
                  }}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <button
                  onClick={() => {
                    const newObj = { ...obj };
                    delete newObj[key];
                    setVal(newObj);
                  }}
                  className="px-3 py-2 border border-border rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setVal({ ...obj, [`key${entries.length + 1}`]: "" })
              }
              className="w-full px-3 py-2 border border-dashed border-border rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              + Thêm cặp
            </button>
          </div>
        );
      }

      case "json":
        return (
          <textarea
            value={typeof val === "string" ? val : JSON.stringify(val, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setVal(parsed);
              } catch {
                setVal(e.target.value);
              }
            }}
            rows={6}
            placeholder='{"key": "value"}'
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        );

      default:
        return (
          <div className="text-xs text-muted-foreground italic">
            [{field.type} - Chưa hỗ trợ preview]
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFrameCreator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Tạo Frame
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Templates</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {FRAME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => addFrameFromTemplate(t)}
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-2xl">{t.icon}</div>
              <div className="text-xs font-medium text-center">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Frames */}
      <div className="space-y-4">
        {frames.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Chưa có frame nào. Chọn template hoặc tạo mới.
            </p>
          </div>
        )}

        {frames.map((frame, idx) => (
          <div
            key={frame.id}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Frame Header */}
            <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-3">
                <GripVertical
                  size={20}
                  className="text-muted-foreground cursor-move"
                />
                <div className="text-2xl">{frame.icon}</div>
                <div>
                  <h3 className="font-semibold">{frame.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    #{idx + 1} • {frame.fields.length} fields
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenFieldPickerFor(frame.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Plus size={14} />
                  Thêm Field
                </button>
                <button
                  onClick={() => deleteFrame(frame.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="p-4 space-y-3">
              {frame.fields.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground italic">
                  Chưa có field nào
                </div>
              )}

              {frame.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex gap-3 p-4 bg-background border border-border rounded-lg"
                >
                  <GripVertical
                    size={16}
                    className="text-muted-foreground mt-1 cursor-move"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={field.label}
                        onChange={(e) =>
                          updateFieldConfig(frame.id, field.id, {
                            label: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-background font-medium"
                      />
                      <span className="px-2 py-1 bg-muted text-xs rounded-md">
                        {FIELD_TYPES[field.type]?.label || field.type}
                      </span>
                    </div>

                    {renderFieldPreview(frame, field)}

                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!field.required}
                          onChange={(e) =>
                            updateFieldConfig(frame.id, field.id, {
                              required: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => removeField(frame.id, field.id)}
                    className="p-2 h-fit text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Field Picker Modal */}
      {openFieldPickerFor && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setOpenFieldPickerFor(null)
          }
        >
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chọn loại Field</h3>
              <button
                onClick={() => setOpenFieldPickerFor(null)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(FIELD_CATEGORIES).map(([catKey, cat]) => {
                const fields = Object.entries(FIELD_TYPES).filter(
                  ([_, field]) => field.category === catKey
                );
                if (!fields.length) return null;

                return (
                  <div key={catKey}>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fields.map(([type, field]) => (
                        <button
                          key={type}
                          onClick={() =>
                            addField(openFieldPickerFor, type as FieldType)
                          }
                          className="px-4 py-2 text-sm border border-border rounded-full hover:bg-muted transition-colors"
                        >
                          {field.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Frame Creator Modal */}
      {showFrameCreator && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowFrameCreator(false)
          }
        >
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Tạo Frame tùy chỉnh</h3>
            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <input
                  value={newFrameIcon}
                  onChange={(e) => setNewFrameIcon(e.target.value)}
                  className="w-16 text-center text-2xl border border-border rounded-md"
                  maxLength={2}
                />
                <input
                  value={newFrameName}
                  onChange={(e) => setNewFrameName(e.target.value)}
                  placeholder="Tên Frame..."
                  className="flex-1 px-3 py-2 border border-border rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowFrameCreator(false)}
                className="px-4 py-2 text-sm bg-muted rounded-md hover:bg-muted/80"
              >
                Hủy
              </button>
              <button
                onClick={createCustomFrame}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                <Wand2 size={14} />
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input:focus, textarea:focus, select:focus {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
