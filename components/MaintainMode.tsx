"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Coffee,
  Wrench,
  Mail,
  RefreshCw,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  HeartHandshake,
  Zap,
} from "lucide-react";
import { useSettingStore } from "@/store/setting.store";

import { usePathname, useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface MessageCard {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  accent: string;
}

// ─── Message Data ─────────────────────────────────────────────────────────────
const MESSAGE_CARDS: MessageCard[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    tag: "Cải tiến",
    title: "Giao diện hoàn toàn mới",
    body: "Chúng tôi đang hoàn thiện giao diện người dùng với trải nghiệm mượt mà và hiện đại hơn, giúp bạn dễ dàng khám phá các sự kiện hơn bao giờ hết.",
    accent: "var(--brand-primary)",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    tag: "Hiệu suất",
    title: "Tốc độ tải trang nhanh gấp đôi",
    body: "Hệ thống máy chủ được nâng cấp toàn diện. Mọi thứ sẽ phản hồi nhanh hơn, ổn định hơn — đặc biệt trong các sự kiện tuyển dụng cao điểm.",
    accent: "var(--brand-secondary)",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    tag: "Bảo mật",
    title: "Bảo vệ dữ liệu tốt hơn",
    body: "Chúng tôi triển khai lớp mã hoá mới và cập nhật chứng chỉ SSL, đảm bảo thông tin cá nhân và hồ sơ của bạn luôn an toàn tuyệt đối.",
    accent: "var(--brand-accent)",
  },
  {
    icon: <HeartHandshake className="w-5 h-5" />,
    tag: "Cộng đồng",
    title: "Kết nối sinh viên & doanh nghiệp",
    body: "Tính năng ghép cặp thông minh mới sẽ giúp đúng sinh viên gặp đúng nhà tuyển dụng — hiệu quả hơn, có ý nghĩa hơn với từng hành trình nghề nghiệp.",
    accent: "var(--brand-primary)",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    tag: "Thông báo",
    title: "Hệ thống thông báo thời gian thực",
    body: "Nhận cập nhật ngay lập tức về sự kiện, lời mời tham gia và kết quả tuyển dụng — không bỏ lỡ bất kỳ cơ hội nào dù chỉ một giây.",
    accent: "var(--brand-secondary)",
  },
];

// ─── Countdown Unit ───────────────────────────────────────────────────────────
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-[var(--brand-accent)]/10" />
        <span className="relative z-10 text-2xl md:text-3xl font-bold tabular-nums text-foreground font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </span>
    </div>
  );
}

function ColonSep() {
  return (
    <div className="flex items-center pb-4">
      <span
        className="text-2xl font-bold animate-pulse"
        style={{ color: "var(--brand-accent)" }}
      >
        :
      </span>
    </div>
  );
}

// ─── Message Slider ───────────────────────────────────────────────────────────
function MessageSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const total = MESSAGE_CARDS.length;

  const go = useCallback(
    (next: number, dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent((next + total) % total);
        setAnimating(false);
      }, 300);
    },
    [animating, total]
  );

  const prev = () => go(current - 1, "left");
  const next = () => go(current + 1, "right");

  // Auto-play
  useEffect(() => {
    const t = setInterval(() => go(current + 1, "right"), 4500);
    return () => clearInterval(t);
  }, [current, go]);

  const card = MESSAGE_CARDS[current];

  return (
    <div className="w-full space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Tin tức cập nhật
        </p>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {MESSAGE_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? "right" : "left")}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  i === current
                    ? "var(--brand-primary)"
                    : "var(--muted-foreground)",
                opacity: i === current ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        style={{ minHeight: "178px" }}
      >
        {/* Accent left bar */}
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors duration-500"
          style={{ backgroundColor: card.accent }}
        />

        {/* Sliding content */}
        <div
          className="transition-all duration-300 ease-in-out"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === "right" ? "-24px" : "24px"})`
              : "translateX(0)",
          }}
        >
          <div className="p-6 pl-8 space-y-3">
            {/* Tag + icon */}
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: `color-mix(in srgb, ${card.accent} 12%, transparent)`,
                  color: card.accent,
                }}
              >
                {card.icon}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider"
                style={{
                  borderColor: `color-mix(in srgb, ${card.accent} 35%, transparent)`,
                  color: card.accent,
                  backgroundColor: `color-mix(in srgb, ${card.accent} 8%, transparent)`,
                }}
              >
                {card.tag}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold leading-snug text-foreground">
              {card.title}
            </h3>

            {/* Body */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.body}
            </p>
          </div>
        </div>

        {/* Subtle corner glow */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-[0.06] blur-2xl"
          style={{ backgroundColor: card.accent }}
        />
      </div>

      {/* Prev / Next controls */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={prev}
          className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:border-[var(--brand-primary)]/40
                     transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {current + 1} / {total}
        </span>
        <button
          onClick={next}
          className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:border-[var(--brand-primary)]/40
                     transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Maintenance() {
  const [target] = useState(() => Date.now() + 2 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0,
  });
  const [dots, setDots] = useState(".");

  const systemSetting = useSettingStore((state) => state.general);

  useEffect(() => {
    const iv = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [target]);

  useEffect(() => {
    const iv = setInterval(
      () => setDots((d) => (d.length >= 3 ? "." : d + ".")),
      600
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.07] bg-[var(--brand-primary)] blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.06] bg-[var(--brand-accent)] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(var(--brand-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--brand-primary) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-0 right-[20%] w-px h-full opacity-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--brand-accent), transparent)",
          }}
        />
        <div
          className="absolute top-0 left-[20%] w-px h-full opacity-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--brand-primary), transparent)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center gap-7">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl bg-[var(--brand-primary)]">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--brand-primary)" }}
          >
            {systemSetting?.systemName}
          </span>
        </div>

        {/* Badge */}
        <div className="animate-in fade-in slide-in-from-top-3 duration-700 delay-100">
          <Badge
            variant="outline"
            className="gap-2 px-4 py-1.5 text-xs uppercase tracking-widest font-semibold
                       border-[var(--brand-warning)]/40 text-[var(--brand-warning)] bg-[var(--brand-warning)]/10"
          >
            <Wrench className="w-3 h-3 animate-spin [animation-duration:3s]" />
            Đang bảo trì hệ thống
          </Badge>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Chúng tôi đang nâng cấp
            <br />
            <span style={{ color: "var(--brand-primary)" }}>
              hệ thống{" "}
              <span className="inline-block w-8 text-left">{dots}</span>
            </span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            {systemSetting?.systemName} đang thực hiện bảo trì định kỳ để mang
            lại trải nghiệm tốt hơn. Hệ thống sẽ trở lại trong ít phút nữa.
          </p>
        </div>

        <Separator className="bg-border w-2/3" />

        {/* Countdown */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
          <div className="flex items-end gap-2 md:gap-4">
            <CountdownUnit value={timeLeft.hours} label="Giờ" />
            <ColonSep />
            <CountdownUnit value={timeLeft.minutes} label="Phút" />
            <ColonSep />
            <CountdownUnit value={timeLeft.seconds} label="Giây" />
          </div>
        </div>

        {/* ── Message Slider ── */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <MessageSlider />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-700 delay-500">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border hover:border-[var(--brand-primary)]/50 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại trang
          </Button>
          <Button
            size="sm"
            className="gap-2 text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            asChild
          >
            <a href="mailto:nhacoevent.manager@gmail.com">
              <Mail className="w-3.5 h-3.5" />
              Liên hệ hỗ trợ
            </a>
          </Button>
        </div>

        {/* Status link */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-700 delay-500">
          <Wifi className="w-3.5 h-3.5" />
          <span>Theo dõi trạng thái hệ thống tại</span>
          <a
            href="https://www.facebook.com/profile.php?id=61552728892066"
            className="underline underline-offset-2 transition-colors"
            style={{ color: "var(--brand-primary)" }}
          >
            Update system
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pb-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {systemSetting?.systemName} · Nền tảng sự
        kiện & tuyển dụng
      </footer>
    </div>
  );
}
