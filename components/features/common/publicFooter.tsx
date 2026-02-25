"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Send,
  CheckCircle2,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react";

import TikTokIcon from "@/components/icon/Tiktok";
import ThreadsIcon from "@/components/icon/Threads";

import { useSettingStore } from "@/store/setting.store";

import Image from "next/image";

export default function PublicFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const socialLinks = [
    {
      icon: ThreadsIcon,
      href: "https://www.threads.com/@nhacoevent",
      label: "Threads",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61552728892066",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/nhacoevent/",
      label: "Instagram",
    },
    { icon: Youtube, href: "https://www.youtube.com/", label: "YouTube" },
    {
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@nhacoevent",
      label: "TikTok",
    },
  ];

  const general = useSettingStore((state) => state.general);
  const handleSubscribe = () => {
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="relative border-t bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="container relative mx-auto px-4 py-16">
        {/* MAIN */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* BRAND */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Image
                  src={general?.systemLogo || "/event_logo.jpg"}
                  alt={
                    general?.systemName ? `${general.systemName} logo` : "logo"
                  }
                  width={36}
                  height={36}
                  priority
                  className="
                    w-8 h-8
                    sm:w-9 sm:h-9
                    rounded-full
                    object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />

                {/* glow effect */}
                <div
                  className="
                    absolute -inset-1
                    rounded-full
                    bg-gradient-to-r from-primary to-accent
                    opacity-0
                    blur-lg
                    group-hover:opacity-40
                    transition
                  "
                />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                {/* system name */}
                <span
                  className="
                    text-sm sm:text-base lg:text-lg
                    font-bold
                    bg-gradient-to-r from-primary via-accent to-primary
                    bg-clip-text text-transparent
                    bg-[length:200%_auto]
                    animate-gradient
                    truncate
                  "
                >
                  {general?.systemName}
                </span>

                {/* system title */}
                <span
                  className="
                    hidden sm:block
                    text-xs
                    text-muted-foreground
                    truncate
                  "
                >
                  {general?.systemTitle}
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {general?.systemDescription}
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative w-9 h-9 bg-muted/50 hover:bg-gradient-to-br hover:from-primary hover:to-accent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div className="space-y-4"> </div>

          {/* NEWSLETTER */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Đăng ký nhận tin
            </h4>

            <p className="text-sm text-muted-foreground">
              Nhận thông tin mới nhất về sự kiện và tin tức từ chúng tôi.
            </p>

            <div className="relative max-w-sm">
              <Input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSubscribed}
                className="rounded-full pr-12 bg-muted/50"
              />

              <Button
                size="icon"
                onClick={handleSubscribe}
                disabled={isLoading || isSubscribed || !email}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-gradient-to-r from-primary to-accent"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : isSubscribed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isSubscribed && (
              <p className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                {t("footer.subscribeSuccess")}
              </p>
            )}
          </div>
        </div>

        <Separator className="my-10" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 text-center text-xs text-muted-foreground md:flex-row md:justify-between md:text-left">
          <span>
            {general?.systemName} · {t("footer.allRightsReserved")}
          </span>

          <div className="flex justify-center gap-6">
            {["termsOfService", "privacyPolicy", "cookies"].map((k) => (
              <a key={k} href="#" className="hover:text-foreground transition">
                {t(`footer.${k}`)}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          {t("footer.madeWithLove")}
        </p>
      </div>
    </footer>
  );
}
