"use client";

import { useEffect, useRef, useState, useCallback, useMemo, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Search, X, Users, ChevronDown, Check, Bell, AlertCircle, Info, CheckCircle2, AlertTriangle } from "lucide-react";

import type { NotificationFormData, NotificationType, PriorityLevel } from "../_types/notification";

import type { SortAccount as Account } from "../../users/_types/user";

interface NotificationDialogProps {
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  onSave:        (data: NotificationFormData) => void;
  notification?: Partial<NotificationFormData> | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_ACCOUNTS: Account[] = [
  { id: "1",  name: "Nguyễn Văn An",   email: "an.nguyen@company.vn",  role: "Admin",  avatar: "NA" },
  { id: "2",  name: "Trần Thị Bích",   email: "bich.tran@company.vn",  role: "Editor", avatar: "TB" },
  { id: "3",  name: "Lê Hoàng Cường",  email: "cuong.le@company.vn",   role: "Viewer", avatar: "LC" },
  { id: "4",  name: "Phạm Minh Đức",   email: "duc.pham@company.vn",   role: "Editor", avatar: "PD" },
  { id: "5",  name: "Hoàng Thị Lan",   email: "lan.hoang@company.vn",  role: "Viewer", avatar: "HL" },
  { id: "6",  name: "Vũ Quốc Tuấn",    email: "tuan.vu@company.vn",    role: "Admin",  avatar: "VT" },
  { id: "7",  name: "Đặng Thu Hương",  email: "huong.dang@company.vn", role: "Editor", avatar: "DH" },
  { id: "8",  name: "Bùi Thanh Hải",   email: "hai.bui@company.vn",    role: "Viewer", avatar: "BH" },
  { id: "9",  name: "Ngô Khánh Linh",  email: "linh.ngo@company.vn",   role: "Editor", avatar: "NL" },
  { id: "10", name: "Đinh Văn Mạnh",   email: "manh.dinh@company.vn",  role: "Viewer", avatar: "DM" },
];

export const NOTIFICATION_TYPES: {
  value: NotificationType;
  label: string;
  icon:  string;
  active: string;
}[] = [
  { value: "info",    label: "Thông tin",  icon: "i",   active: "border-blue-500   bg-blue-50   text-blue-700   ring-blue-200   dark:bg-blue-950/50  dark:text-blue-300"    },
  { value: "success", label: "Thành công", icon: "ok",  active: "border-emerald-500 bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { value: "warning", label: "Cảnh báo",  icon: "!",   active: "border-amber-500  bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-950/50  dark:text-amber-300"   },
  { value: "error",   label: "Khẩn cấp",  icon: "x",   active: "border-red-500    bg-red-50    text-red-700    ring-red-200    dark:bg-red-950/50    dark:text-red-300"      },
];

export const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  info:    <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error:   <AlertCircle className="h-4 w-4" />,
};

export const PRIORITIES: {
  value:       PriorityLevel;
  label:       string;
  dotClass:    string;
  activeClass: string;
}[] = [
  { value: "low",    label: "Thấp",       dotClass: "bg-slate-400", activeClass: "border-slate-400 bg-slate-50  text-slate-600 dark:bg-slate-900   dark:text-slate-300"  },
  { value: "medium", label: "Trung bình", dotClass: "bg-amber-400", activeClass: "border-amber-500 bg-amber-50  text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"  },
  { value: "high",   label: "Cao",        dotClass: "bg-red-500",   activeClass: "border-red-500   bg-red-50    text-red-700   dark:bg-red-950/50   dark:text-red-300"    },
];

const AVATAR_COLORS = [
  "bg-violet-500", "bg-sky-500",    "bg-emerald-500", "bg-amber-500",
  "bg-rose-500",   "bg-indigo-500", "bg-teal-500",    "bg-orange-500",
  "bg-cyan-500",   "bg-fuchsia-500",
] as const;

export const ROLE_BADGE: Record<Account["role"], string> = {
  Admin:  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Editor: "bg-sky-100    text-sky-700    dark:bg-sky-900/30    dark:text-sky-400",
  Viewer: "bg-slate-100  text-slate-600  dark:bg-slate-800     dark:text-slate-400",
};

const MAX_CONTENT = 500;
const MAX_CHIPS   = 3;

const DEFAULT_FORM: NotificationFormData = {
  title:      "",
  content:    "",
  type:       "info",
  priority:   "medium",
  startDate:  "",
  endDate:    "",
  isActive:   true,
  recipients: [],
};

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label:      string;
  htmlFor?:   string;
  required?:  boolean;
  hint?:      string;
  error?:     boolean;
  children:   React.ReactNode;
  className?: string;
}

function FieldWrapper({ label, htmlFor, required, hint, error, children, className }: FieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        {hint && (
          <span className="text-xs text-muted-foreground font-normal">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive animate-in slide-in-from-top-1 duration-150">
          <AlertCircle className="w-3 h-3 shrink-0" />
          Trường này không được để trống
        </p>
      )}
    </div>
  );
}

// ─── RecipientSelector ────────────────────────────────────────────────────────

interface RecipientSelectorProps {
  value:    string[];
  onChange: (ids: string[]) => void;
  hasError?: boolean;
}

function RecipientSelector({ value, onChange, hasError }: RecipientSelectorProps) {
  const [open, setOpen]   = useState(false);
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [query, setQuery] = useState("");
  const wrapRef           = useRef<HTMLDivElement>(null);
  const searchRef         = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulating fetching account list data
    setAccountList(MOCK_ACCOUNTS);
  }, []);

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q
      ? accountList.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.role.toLowerCase().includes(q),
        )
      : accountList;
  }, [query]);

  const selectedAccounts = useMemo(
    () => accountList.filter((a) => value.includes(a.id)),
    [value, accountList],
  );

  const toggle = useCallback(
    (id: string) =>
      onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]),
    [value, onChange],
  );

  const removeChip = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== id));
    },
    [value, onChange],
  );

  const openDropdown = () => {
    setOpen(true);
    setTimeout(() => searchRef.current?.focus(), 60);
  };

  const visible  = selectedAccounts.slice(0, MAX_CHIPS);
  const overflow = selectedAccounts.length - MAX_CHIPS;

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={(e) => e.key === "Enter" && (open ? setOpen(false) : openDropdown())}
        className={cn(
          "relative min-h-[40px] w-full cursor-pointer select-none",
          "rounded-md border bg-background px-3 py-2 pr-9 text-sm",
          "flex flex-wrap items-center gap-1.5 transition-all duration-150",
          "focus:outline-none",
          open
            ? "border-primary ring-2 ring-primary/20"
            : hasError
            ? "border-destructive hover:border-destructive"
            : "border-input hover:border-primary/50",
        )}
      >
        {selectedAccounts.length === 0 ? (
          <span className="text-muted-foreground">
            Chọn người nhận hoặc để trống (gửi tất cả)…
          </span>
        ) : (
          <>
            {visible.map((acc) => (
              <span
                key={acc.id}
                className="inline-flex max-w-[140px] items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white",
                    AVATAR_COLORS[Number(acc.id) - 1],
                  )}
                >
                  {acc.avatar}
                </span>
                <span className="truncate">{acc.name.split(" ")[acc.name.split(" ").length - 1]}</span>
                <button
                  type="button"
                  onMouseDown={(e) => removeChip(acc.id, e)}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-primary/20 hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {overflow > 0 && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                +{overflow} khác
              </span>
            )}
          </>
        )}
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search row */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Tìm theo tên, email, vai trò…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Bulk bar */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-medium text-foreground">{value.length}</span>
              /{accountList.length} đã chọn
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onChange(filtered.map((a) => a.id))}
                className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Chọn tất cả
              </button>
              {value.length > 0 && (
                <>
                  <span className="h-3 w-px bg-border" />
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="text-xs font-semibold text-destructive transition-colors hover:text-destructive/80"
                  >
                    Bỏ chọn
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Account list */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Không tìm thấy tài khoản
              </p>
            ) : (
              filtered.map((acc) => {
                const isSel = value.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => toggle(acc.id)}
                    className={cn(
                      "flex cursor-pointer select-none items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/30",
                      isSel && "bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                        AVATAR_COLORS[Number(acc.id) - 1],
                      )}
                    >
                      {acc.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{acc.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{acc.email}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        ROLE_BADGE[acc.role],
                      )}
                    >
                      {acc.role}
                    </span>
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-2 transition-all duration-150",
                        isSel ? "border-primary bg-primary" : "border-input",
                      )}
                    >
                      {isSel && (
                        <Check className="h-2.5 w-2.5 stroke-[3] text-primary-foreground" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NotificationDialog ───────────────────────────────────────────────────────

export function NotificationDialog({
  open,
  onOpenChange,
  onSave,
  notification,
}: NotificationDialogProps) {
  const [form, setForm]         = useState<NotificationFormData>({ ...DEFAULT_FORM });
  const [errors, setErrors]     = useState<Partial<Record<keyof NotificationFormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(notification ? { ...DEFAULT_FORM, ...notification } : { ...DEFAULT_FORM });
      setErrors({});
      setSubmitted(false);
    }
  }, [open, notification]);

  const set = useCallback(
    <K extends keyof NotificationFormData>(key: K, val: NotificationFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: val }));
      if (submitted) setErrors((prev) => ({ ...prev, [key]: false }));
    },
    [submitted],
  );

  const validate = (): Partial<Record<keyof NotificationFormData, boolean>> => {
    const e: Partial<Record<keyof NotificationFormData, boolean>> = {};
    if (!form.title.trim())   e.title     = true;
    if (!form.content.trim()) e.content   = true;
    if (!form.startDate)      e.startDate = true;
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setSubmitted(true);
      return;
    }
    onSave(form);
  };

  const contentLen   = form.content.length;
  const isEdit       = !!notification;
  const showFooterErr = submitted && Object.values(errors).some(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        Override DialogContent to be a flex column so header/footer are sticky
        and only the body scrolls. gap-0 + p-0 remove default paddings.
      */}
      <DialogContent className="flex max-h-[92vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">

        {/* ── Sticky Header ── */}
        <DialogHeader className="flex shrink-0 flex-row items-start gap-3 border-b px-6 pb-5 pt-6 space-y-0">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <DialogTitle className="text-base leading-snug">
              {isEdit ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs">
              {isEdit
                ? "Cập nhật nội dung và cấu hình thông báo"
                : "Soạn và lên lịch gửi thông báo đến người dùng"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

          {/* Title */}
          <FieldWrapper
            label="Tiêu đề"
            htmlFor="nd-title"
            required
            error={submitted && !!errors.title}
          >
            <Input
              id="nd-title"
              placeholder="Nhập tiêu đề thông báo"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={cn(
                submitted && errors.title && "border-destructive focus-visible:ring-destructive/20",
              )}
            />
          </FieldWrapper>

          {/* Content */}
          <FieldWrapper
            label="Nội dung"
            htmlFor="nd-content"
            required
            error={submitted && !!errors.content}
          >
            <Textarea
              id="nd-content"
              placeholder="Nhập nội dung thông báo…"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={3}
              className={cn(
                "resize-none",
                submitted && errors.content && "border-destructive focus-visible:ring-destructive/20",
              )}
            />
            <p
              className={cn(
                "text-right text-[11px] tabular-nums transition-colors",
                contentLen > MAX_CONTENT
                  ? "text-destructive"
                  : contentLen > MAX_CONTENT * 0.8
                  ? "text-amber-500"
                  : "text-muted-foreground",
              )}
            >
              {contentLen}&thinsp;/&thinsp;{MAX_CONTENT}
            </p>
          </FieldWrapper>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Loai thong bao<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {NOTIFICATION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("type", t.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center",
                    "transition-all duration-150",
                    form.type === t.value
                      ? cn(t.active, "ring-2 ring-offset-1 ring-primary/20 shadow-sm")
                      : "border-input bg-background text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {TYPE_ICONS[t.value]}
                  <span className="text-[11px] font-semibold leading-none">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Mức độ ưu tiên</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set("priority", p.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium",
                    "transition-all duration-150",
                    form.priority === p.value
                      ? cn(p.activeClass, "border-2 shadow-sm")
                      : "border-input bg-background text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", p.dotClass)} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrapper
              label="Ngày bắt đầu"
              htmlFor="nd-startDate"
              required
              error={submitted && !!errors.startDate}
            >
              <Input
                id="nd-startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className={cn(
                  submitted && errors.startDate && "border-destructive focus-visible:ring-destructive/20",
                )}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Ngày kết thúc"
              htmlFor="nd-endDate"
            >
              <Input
                id="nd-endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </FieldWrapper>
          </div>

          {/* Recipients */}
          <FieldWrapper label="Người nhận" hint="(Để trống = gửi tất cả)">
            <RecipientSelector
              value={form.recipients}
              onChange={(ids) => set("recipients", ids)}
            />
          </FieldWrapper>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium leading-none">
                Kích hoạt ngay sau khi lưu
              </p>
              <p className="text-xs text-muted-foreground">
                {form.isActive
                  ? "Thông báo sẽ được gửi đi ngay lập tức"
                  : "Thông báo sẽ được lưu ở trạng thái nháp"}
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
            />
          </div>

        </div>

        {/* ── Sticky Footer ── */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t px-6 py-4">
          {showFooterErr && (
            <p className="mr-auto flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Vui lòng điền đầy đủ các trường bắt buộc
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Huy bo
          </Button>
          <Button
            type="button"
            disabled={contentLen > MAX_CONTENT}
            onClick={handleSubmit}
            className="gap-2"
          >
            <Check className="h-3.5 w-3.5" />
            {isEdit ? "Cập nhật" : "Tạo thông báo"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}