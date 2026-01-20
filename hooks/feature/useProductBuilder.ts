"use client";

import { useCallback, useState } from "react";
import {
  Frame,
  FrameTemplate,
  FieldConfig,
  FieldType,
  FIELD_TYPES,
} from "@/types/frame";

export function useProductBuilder() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [openFieldPickerFor, setOpenFieldPickerFor] = useState<string | null>(
    null
  );

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
            type: f.type as FieldType,
            label: f.label,
            width: "full",
            required: !!f.required,
            ...f,
          }) as FieldConfig
      ),
      data: {},
    };

    setFrames((prev) => [...prev, newFrame]);
  }, []);

  const createCustomFrame = useCallback((name: string, icon: string) => {
    if (!name.trim()) return;

    const ts = Date.now();
    setFrames((prev) => [
      ...prev,
      {
        id: `custom-${ts}`,
        name: name.trim(),
        icon,
        color: "primary",
        fields: [],
        data: {},
      },
    ]);
  }, []);

  const deleteFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const addField = useCallback((frameId: string, fieldType: FieldType) => {
    const typeConfig = FIELD_TYPES[fieldType];

    const newField: FieldConfig = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: typeConfig?.label || fieldType,
      width: "full",
      required: false,
    };

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
          ? { ...f, fields: f.fields.filter((x) => x.id !== fieldId) }
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

  const updateFieldValue = (frameId: string, fieldId: string, value: any) => {
    setFrames((prev) =>
      prev.map((f) =>
        f.id === frameId ? { ...f, data: { ...f.data, [fieldId]: value } } : f
      )
    );
  };

  /** 👇 Schema xuất ra để lưu DB */
  const exportSchema = useCallback(() => {
    return frames.map(({ data, ...rest }) => rest);
  }, [frames]);

  return {
    frames,
    setFrames,

    openFieldPickerFor,
    setOpenFieldPickerFor,

    addFrameFromTemplate,
    createCustomFrame,
    deleteFrame,

    addField,
    removeField,
    updateFieldConfig,
    updateFieldValue,

    exportSchema,
  };
}
