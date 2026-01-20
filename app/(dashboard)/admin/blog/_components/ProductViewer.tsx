"use client";

import React from "react";
import {
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  List,
  CheckSquare,
  Hash,
  Type,
  ToggleLeft,
  Palette,
  Table,
  Code,
  FileJson,
  Package,
} from "lucide-react";

interface SchemaField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  width?: string;
}

interface SchemaFrame {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: SchemaField[];
}

interface SchemaData {
  frameId: string;
  values: Record<string, any>;
}

interface ProductSchema {
  schema: SchemaFrame[];
  data: SchemaData[];
}

interface SchemaViewerProps {
  schema: ProductSchema;
}

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={14} />,
  textarea: <Type size={14} />,
  number: <Hash size={14} />,
  url: <LinkIcon size={14} />,
  image: <ImageIcon size={14} />,
  video: <Video size={14} />,
  gallery: <ImageIcon size={14} />,
  select: <List size={14} />,
  multiselect: <List size={14} />,
  toggle: <ToggleLeft size={14} />,
  checkbox: <CheckSquare size={14} />,
  color: <Palette size={14} />,
  list: <List size={14} />,
  keyvalue: <Code size={14} />,
  table: <Table size={14} />,
  json: <FileJson size={14} />,
};

const FRAME_COLORS: Record<string, string> = {
  primary: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
  accent:
    "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300",
  success:
    "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300",
  warning:
    "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300",
};

export default function SchemaViewer({ schema }: SchemaViewerProps) {
  if (!schema || !schema.schema || schema.schema.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Không có thông tin schema
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Sản phẩm này chưa có thông tin chi tiết được cấu trúc
        </p>
      </div>
    );
  }

  const renderFieldValue = (field: SchemaField, value: any) => {
    // Handle empty values
    if (value === undefined || value === null || value === "") {
      return (
        <div className="text-sm text-muted-foreground italic">
          Chưa có dữ liệu
        </div>
      );
    }

    switch (field.type) {
      case "image":
        return (
          <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
            <img
              src={value}
              alt={field.label}
              className="w-full max-w-2xl h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        );

      case "gallery":
        if (!Array.isArray(value) || value.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Không có hình ảnh
            </div>
          );
        }
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {value.map((url, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden border border-border bg-muted/30 aspect-square"
              >
                <img
                  src={url}
                  alt={`${field.label} ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "video":
        return (
          <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-4 text-primary hover:underline"
            >
              <Video size={16} />
              <span className="text-sm">Xem video</span>
            </a>
          </div>
        );

      case "url":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm flex items-center gap-2"
          >
            <LinkIcon size={14} />
            {value}
          </a>
        );

      case "toggle":
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                value ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  value ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm font-medium">{value ? "Bật" : "Tắt"}</span>
          </div>
        );

      case "color":
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-mono font-semibold">{value}</span>
          </div>
        );

      case "list":
        if (!Array.isArray(value) || value.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Danh sách trống
            </div>
          );
        }
        return (
          <ul className="space-y-2">
            {value.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );

      case "multiselect":
        if (!Array.isArray(value) || value.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Không có lựa chọn
            </div>
          );
        }
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {item}
              </span>
            ))}
          </div>
        );

      case "keyvalue":
        if (typeof value !== "object" || Object.keys(value).length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Không có dữ liệu
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {Object.entries(value).map(([key, val]) => (
              <div
                key={key}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border"
              >
                <span className="text-sm font-semibold text-primary min-w-[100px]">
                  {key}:
                </span>
                <span className="text-sm text-foreground flex-1">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        );

      case "table":
        if (!Array.isArray(value) || value.length === 0) {
          return (
            <div className="text-sm text-muted-foreground italic">
              Bảng trống
            </div>
          );
        }
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <tbody>
                {value.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border last:border-0"
                  >
                    {Array.isArray(row) &&
                      row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-4 py-2 bg-muted/30 text-foreground"
                        >
                          {cell}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "json":
        return (
          <pre className="bg-muted/50 border border-border rounded-lg p-4 text-xs font-mono overflow-x-auto">
            {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
          </pre>
        );

      case "textarea":
        return (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {value}
            </p>
          </div>
        );

      case "number":
        return (
          <span className="text-lg font-semibold text-foreground">
            {value.toLocaleString()}
          </span>
        );

      default:
        return (
          <div className="text-sm text-foreground leading-relaxed">
            {String(value)}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {schema.schema.map((frame) => {
        const dataFrame = schema.data.find((d) => d.frameId === frame.id);
        const colorClass = FRAME_COLORS[frame.color] || FRAME_COLORS.primary;

        return (
          <div
            key={frame.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Frame Header */}
            <div
              className={`px-6 py-4 border-b border-border ${colorClass} backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{frame.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{frame.name}</h3>
                  <p className="text-xs opacity-75">
                    {frame.fields.length} trường thông tin
                  </p>
                </div>
              </div>
            </div>

            {/* Frame Content */}
            <div className="p-6 space-y-6">
              {frame.fields.map((field) => {
                const value = dataFrame?.values[field.id];
                const hasValue =
                  value !== undefined && value !== null && value !== "";

                return (
                  <div key={field.id} className="space-y-3">
                    {/* Field Label */}
                    <div className="flex items-center gap-2">
                      <div className="text-primary">
                        {FIELD_TYPE_ICONS[field.type] || <Package size={14} />}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {field.type}
                      </span>
                    </div>

                    {/* Field Value */}
                    <div className={`pl-6 ${!hasValue ? "opacity-60" : ""}`}>
                      {renderFieldValue(field, value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
