"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Zap, Send, CheckCircle2,  Twitter,
  Facebook,
  Linkedin,
  Youtube, } from "lucide-react";

export default function PublicFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">ManixAI</span>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t("footer.brandDescription")}
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
              {t("footer.newsletterTitle")}
            </h4>

            <p className="text-sm text-muted-foreground">
              {t("footer.newsletterDesc")}
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
            {t("footer.copyright")} · {t("footer.allRightsReserved")}
          </span>

          <div className="flex justify-center gap-6">
            {["termsOfService", "privacyPolicy", "cookies"].map((k) => (
              <a
                key={k}
                href="#"
                className="hover:text-foreground transition"
              >
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
