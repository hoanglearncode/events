"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  ChevronDown,
  Search,
  Menu,
  Sparkles,
  LogOut,
  ChevronRight,
  User,
  Bell,
  Home,
  Shield,
  Database,
  Box,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import Cookies from "js-cookie";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "./SearchResult";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import type { UserProfile } from "@/types/auth";
import { mainNavItems } from "@/components/sidebar/public_sidebar";
import { useSettingStore } from "@/store/setting.store";
import { useAuthStore } from "@/store/auth.store";
import { RegisterBlockedDialog } from "@/components/RegisterBlockedDialog";

// ─── Sub-components ──────────────────────────────────────────────────────────

interface AvatarDisplayProps {
  avatar?: string;
  fullName?: string;
  size?: "sm" | "md";
}

interface UserInfoRowProps {
  avatar?: string;
  fullName?: string;
  email?: string;
}

function UserAvatar({ avatar, fullName, size = "sm" }: AvatarDisplayProps) {
  const sizeClass = size === "md" ? "h-10 w-10 text-xl" : "h-9 w-9 text-lg";
  return (
    <Avatar className={`${sizeClass} ring-2 ring-border shadow-lg`}>
      {avatar ? (
        <AvatarImage src={avatar} className="object-cover" />
      ) : (
        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold">
          {fullName?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

function UserInfoRow({ avatar, fullName, email }: UserInfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar avatar={avatar} fullName={fullName} size="md" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground text-sm truncate">
          {fullName ?? "User"}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {email ?? ""}
        </div>
      </div>
    </div>
  );
}

// ─── Custom Hooks ─────────────────────────────────────────────────────────────

function useMenuState() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const closeAll = useCallback(() => {
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  return {
    isSearchOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isUserMenuOpen,
    setIsUserMenuOpen,
    closeAll,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PublicHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    isSearchOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isUserMenuOpen,
    setIsUserMenuOpen,
    closeAll,
  } = useMenuState();

  // const general = useSettingStore((state) => state.general);

  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

  // const handleRegisterClick = useCallback(
  //   (e: React.MouseEvent) => {
  //     if (!general?.allowRegister) {
  //       e.preventDefault();
  //       setOpenRegisterDialog(true);
  //     }
  //   },
  //   [general?.allowRegister]
  // );

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Global keyboard & click-outside handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    const onDocClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [closeAll, setIsUserMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const profile = useMemo<UserProfile | null>(
    () => (user ? { ...user } : null),
    [user]
  );

  const handleSignOut = useCallback(() => {
    // Cookies.remove(ACCESS_TOKEN);
    router.push("/login");
  }, [router]);

  const handleNavigateTo = useCallback(
    (target: string) => {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      router.push(target);
    },
    [router, setIsUserMenuOpen, setIsMobileMenuOpen]
  );

  // ─── Render Helpers ───────────────────────────────────────────────────────

  const renderDesktopAuth = () => {
    if (!user) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="h-9 touch-manipulation"
            >
              {t("navbar.login")}
            </Button>
          </Link>
          <Link
            href="/register"
            // onClick={handleRegisterClick}
            className={`font-semibold transition
                  ${
                    false
                      ? "text-primary hover:underline"
                      : "text-muted-foreground cursor-not-allowed"
                  }`
                }
          >
            <Button
              size="sm"
              className="h-9 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {t("navbar.register")}
            </Button>
          </Link>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center gap-2 p-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1 hidden lg:block">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-3 w-[120px]" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen((v) => !v)}
          className="flex items-center gap-2 p-1.5 rounded-xl transition-colors hover:bg-accent/50 touch-manipulation"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
        >
          <UserAvatar avatar={profile?.avatar || ""} fullName={user.fullname} />
          <div className="text-left hidden lg:block">
            <div className="text-sm font-bold text-foreground leading-tight truncate max-w-[120px]">
              {user.fullname ?? "User"}
            </div>
            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user.email ?? ""}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground hidden lg:block" />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-2xl shadow-xl p-3 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="mb-3 pb-3 border-b border-border">
              <UserInfoRow
                avatar={profile?.avatar || ""}
                fullName={user.fullname}
                email={user.email}
              />
            </div>

            {profile?.role === "ADMIN" && (
              <button
                onClick={() => handleNavigateTo("/admin")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Box className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}

            <div className="mt-2 pt-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("navbar.logout")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMobileBottom = () => {
    if (!user) {
      return (
        <div className="space-y-3">
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-base touch-manipulation"
            >
              {t("navbar.login")}
            </Button>
          </Link>
          <Link
            href="/register"
            className={`font-semibold transition
                  ${
                    // general?.allowRegister
                    false
                      ? "text-primary hover:underline"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
            onClick={() => {
              setIsMobileMenuOpen(false);
              // handleRegisterClick(null as any);
            }}
          >
            <Button
              size="lg"
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 touch-manipulation"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t("navbar.register")}
            </Button>
          </Link>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-3 w-[180px]" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      );
    }

    if (!profile) return null;

    const isDashboardRole =
      profile.role === "ROLE_ADMIN" || profile.role === "ROLE_SELLER";

    return (
      <div className="space-y-3">
        <button
          onClick={() => handleNavigateTo("/profile")}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors touch-manipulation"
        >
          <UserAvatar
            avatar={profile.avatar || ""}
            fullName={user.fullname}
            size="md"
          />
          <div className="flex-1 min-w-0 text-left">
            <div className="font-bold text-base text-foreground truncate">
              {user.fullname ?? "User"}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {user.email ?? ""}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleNavigateTo("/website")}
            variant="outline"
            size="lg"
            className="h-11 text-sm touch-manipulation"
          >
            <Home className="w-4 h-4 mr-2" /> {t("navbar.home")}
          </Button>
          <Button
            onClick={() => handleNavigateTo("/noti")}
            variant="outline"
            size="lg"
            className="h-11 text-sm touch-manipulation"
          >
            <Bell className="w-4 h-4 mr-2" /> {t("navbar.notifications")}
          </Button>
          {isDashboardRole && (
            <Button
              onClick={() =>
                handleNavigateTo(
                  profile.role === "ROLE_ADMIN" ? "/admin" : "/seller"
                )
              }
              variant="outline"
              size="lg"
              className="h-11 text-sm col-span-2 touch-manipulation"
            >
              <Shield className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          )}
          <Button
            onClick={() => handleNavigateTo("/my-data")}
            variant="outline"
            size="lg"
            className="h-11 text-sm col-span-2 touch-manipulation"
          >
            <Database className="w-4 h-4 mr-2" /> {t("navbar.myData")}
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={handleSignOut}
          size="lg"
          className="w-full h-11 text-sm touch-manipulation"
        >
          <LogOut className="w-4 h-4 mr-2" /> {t("navbar.logout")}
        </Button>
      </div>
    );
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <Fragment>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 min-w-0 group touch-manipulation"
            >
              {/* LOGO */}
              {/* <div className="relative shrink-0">
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
                {/* <div
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
              </div> */}

              {/* TEXT BLOCK */}
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
                  {/* {general?.systemName} */}
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
                  {/* {general?.systemTitle} */}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen((v) => !v)}
              aria-label={t("navbar.search")}
              className="h-9 w-9 sm:h-10 sm:w-auto sm:px-3 border flex items-center gap-2 touch-manipulation"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-sm">
                {t("navbar.search")}
              </span>
            </Button>

            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>

            <div className="hidden md:flex items-center gap-2">
              {renderDesktopAuth()}
            </div>

            {/* Mobile Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("navbar.openMenu")}
                  className="h-10 w-10 touch-manipulation"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[90vw] max-w-sm p-0 flex flex-col"
              >
                <SheetHeader className="px-4 py-4 border-b border-border shrink-0">
                  <SheetTitle>
                    <Link
                      onClick={() => setIsMobileMenuOpen(false)}
                      href="/"
                      className="flex items-center gap-2 touch-manipulation"
                    >
                      <Image
                        src="/event_logo.jpg"
                        alt="Event Logo"
                        width={32}
                        height={32}
                        className="transition-transform duration-300"
                      />
                      <span className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {/* {general?.systemName} */}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
                  <div className="space-y-2 mb-6">
                    {mainNavItems.map((item: any) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block touch-manipulation"
                      >
                        <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-98">
                          <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-semibold text-base text-foreground">
                            {item.label}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 mb-6">
                    <span className="text-sm font-medium text-foreground">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>

                <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur p-4 pb-safe">
                  {renderMobileBottom()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <SearchDialog
        open={isSearchOpen}
        onOpenChange={() => setIsSearchOpen(false)}
      />

      <RegisterBlockedDialog
        open={openRegisterDialog}
        onOpenChange={setOpenRegisterDialog}
      />
    </Fragment>
  );
}
