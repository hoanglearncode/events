"use client";

import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Globe,
  Search,
  Menu,
  Sparkles,
  Code,
  ShoppingBag,
  GraduationCap,
  FileText,
  LogOut,
  ChevronRight,
  X,
  User,
  Bell,
  Home,
  Shield,
  Database,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "./SearchResult";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import { validateUser } from "@/shared/validation/user.schemas";
import { useProfileDetails } from "@/hooks/queries/profileQueries";
import type { ProfileDetailData } from "@/types/profile";
import { decodeToken } from "@/middleware";

export default function PublicHeader() {
  const { i18n, t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const router = useRouter();

  const token = Cookies.get(ACCESS_TOKEN);
  const validate = validateUser(token);
  const enabled = Boolean(token) && validate.isValid;

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isSuccess: isProfileSuccess,
  } = useProfileDetails(enabled);

  useEffect(() => {
    if (isProfileSuccess && profileResponse?.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [isProfileSuccess, profileResponse?.mustChangePassword, router]);

  const normalizeProfile = (raw: any): ProfileDetailData | null => {
    if (!raw) return null;
    if (typeof raw === "object") {
      if (raw.data?.result) return raw.data.result as ProfileDetailData;
      if (raw.result) return raw.result as ProfileDetailData;
      if (raw.data && typeof raw.data === "object")
        return raw.data as ProfileDetailData;
      return raw as ProfileDetailData;
    }
    return null;
  };

  const profile = useMemo<ProfileDetailData | null>(() => {
    if (!enabled) return null;
    return normalizeProfile(profileResponse);
  }, [profileResponse, enabled]);

  // nav items
  const navItems : any = [];

  function handleSignOut() {
    Cookies.remove(ACCESS_TOKEN);
    router.push("/login");
  }
  function handleNavigateTo(target: string) {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push(target);
  }

  // language
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("language", lng);
    } catch {}
  };
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("language");
      if (savedLang && ["vi", "en"].includes(savedLang)) {
        i18n.changeLanguage(savedLang);
      }
    } catch {}
  }, [i18n]);

  const currentLang = i18n.language || "vi";
  const displayName = profile?.fullname || "User";
  const displayEmail = profile?.email || "";

  const hasToken = !!token;
  let userRole = "USER";
  if (hasToken && token) {
    try {
      const decoded = decodeToken(token);
      if (decoded?.role) userRole = decoded.role;
    } catch {}
  }
  const role = userRole;

  // refs for click-outside & search focus
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // click outside to close user menu
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userMenuRef.current) return;
      const el = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(el)) {
        setIsUserMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // focus input when opening search
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // lock body scroll when mobile sheet open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <Fragment>
      {/* Fixed nav - Optimized height for mobile */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo - More compact on mobile */}
          <div className="flex items-center gap-3 sm:gap-8 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 group shrink-0 touch-manipulation"
            >
              <div className="relative">
                <Image
                  src="/event_logo.jpg"
                  alt="Volhub"
                  width={28}
                  height={28}
                  className="w-7 h-7 sm:w-9 sm:h-9 transition-transform duration-300"
                  priority
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 blur-lg transition-opacity duration-300 rounded-full" />
              </div>
              <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Volhub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navItems.map((item : any) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      asChild
                      className="group inline-flex w-max items-center justify-center px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50 rounded-md"
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions - Optimized spacing */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search - Responsive button */}
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

            {/* Theme Toggle - Smaller on mobile */}
            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>

            {/* Language dropdown - Hidden on mobile */}
            <div className="hidden lg:flex">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 rounded-full px-3 text-xs h-9 touch-manipulation"
                    aria-label={t("navbar.selectLanguage")}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{currentLang.toUpperCase()}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="min-w-[120px] flex flex-col gap-1"
                >
                  <DropdownMenuItem
                    onClick={() => changeLanguage("vi")}
                    className={`text-xs cursor-pointer ${currentLang === "vi" ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    🇻🇳 Tiếng Việt
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => changeLanguage("en")}
                    className={`text-xs cursor-pointer ${currentLang === "en" ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop auth / user box */}
            <div className="hidden md:flex items-center gap-2 relative">
              {enabled ? (
                isProfileLoading ? (
                  <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1 hidden lg:block">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[120px]" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 p-1.5 rounded-xl transition-colors hover:bg-accent/50 touch-manipulation"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-border shadow-lg">
                        {profile?.avatar ? (
                          <AvatarImage
                            src={profile.avatar}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg font-bold">
                            {displayName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="text-left hidden lg:block">
                        <div className="text-sm font-bold text-foreground leading-tight truncate max-w-[120px]">
                          {displayName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {displayEmail}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground hidden lg:block" />
                    </button>

                    {/* Desktop User Menu Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-2xl shadow-xl p-3 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                          <Avatar className="h-10 w-10 ring-2 ring-border shadow-lg">
                            {profile?.avatar ? (
                              <AvatarImage
                                src={profile.avatar}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg font-bold">
                                {displayName?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground text-sm truncate">
                              {displayName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {displayEmail}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <button
                            onClick={() => handleNavigateTo("/profile")}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            {t("navbar.myProfile")}
                          </button>

                          <div className="pt-2 border-t border-border mt-2">
                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                              {t("navbar.quickLinks")}
                            </div>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleNavigateTo("/website")}
                                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                              >
                                <Home className="w-4 h-4" />
                                {t("navbar.home")}
                              </button>
                              <button
                                onClick={() => handleNavigateTo("/noti")}
                                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                              >
                                <Bell className="w-4 h-4" />
                                {t("navbar.notifications")}
                              </button>

                              {role === "ROLE_ADMIN" && (
                                <button
                                  onClick={() => handleNavigateTo("/admin")}
                                  className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                                >
                                  <Shield className="w-4 h-4" />
                                  {t("navbar.adminDashboard")}
                                </button>
                              )}
                              {role === "ROLE_SELLER" && (
                                <button
                                  onClick={() => handleNavigateTo("/seller")}
                                  className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                                >
                                  <Shield className="w-4 h-4" />
                                  {t("navbar.sellerDashboard")}
                                </button>
                              )}

                              <button
                                onClick={() => handleNavigateTo("/my-data")}
                                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                              >
                                <Database className="w-4 h-4" />
                                {t("navbar.myData")}
                              </button>
                              <button
                                onClick={() => handleNavigateTo("/post/new")}
                                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent/50 transition-colors"
                              >
                                <PlusCircle className="w-4 h-4" />
                                {t("navbar.addNewPost")}
                              </button>
                            </div>
                          </div>

                          <div className="border-t border-border mt-2 pt-2">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              {t("navbar.logout")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
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
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="h-9 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 touch-manipulation"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {t("navbar.register")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger - Larger touch target */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
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
                {/* Header - Fixed with better spacing */}
                <SheetHeader className="px-4 py-4 border-b border-border shrink-0">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href="/"
                        className="flex items-center gap-2 group touch-manipulation"
                      >
                        <div className="relative">
                          <Image
                            src="/manix-log.png"
                            alt="ManixAI"
                            width={32}
                            height={32}
                            className="transition-transform duration-300"
                          />
                        </div>
                        <span className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ManixAI
                        </span>
                      </Link>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                {/* Scrollable Content with momentum scrolling */}
                <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
                  {/* Navigation Links - Larger touch targets */}
                  <div className="space-y-2 mb-6">
                    {navItems.map((item : any) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block touch-manipulation"
                      >
                        <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-98">
                          <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-base text-foreground mb-1">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Settings */}
                  <div className="space-y-4 mb-6">
                    {/* Theme Toggle for mobile */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                      <span className="text-sm font-medium text-foreground">
                        {t("navbar.theme")}
                      </span>
                      <ThemeToggle />
                    </div>

                    {/* Language Selection - Better mobile layout */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                        {t("navbar.language")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            currentLang === "vi" ? "default" : "outline"
                          }
                          size="lg"
                          className="h-12 touch-manipulation"
                          onClick={() => changeLanguage("vi")}
                        >
                          <span className="text-base">🇻🇳</span>
                          <span className="ml-2 text-sm">Tiếng Việt</span>
                        </Button>
                        <Button
                          variant={
                            currentLang === "en" ? "default" : "outline"
                          }
                          size="lg"
                          className="h-12 touch-manipulation"
                          onClick={() => changeLanguage("en")}
                        >
                          <span className="text-base">🇺🇸</span>
                          <span className="ml-2 text-sm">English</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions - Fixed with safe area */}
                <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur p-4 pb-safe">
                  {enabled ? (
                    isProfileLoading ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                          <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-4 w-full max-w-[140px]" />
                            <Skeleton className="h-3 w-full max-w-[180px]" />
                          </div>
                        </div>
                        <Skeleton className="h-11 w-full rounded-lg" />
                      </div>
                    ) : profile ? (
                      <div className="space-y-3">
                        {/* User Info - Larger for easier tapping */}
                        <button
                          onClick={() => handleNavigateTo("/profile")}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors touch-manipulation"
                        >
                          <Avatar className="h-12 w-12 ring-2 ring-border shadow-lg shrink-0">
                            {profile.avatar ? (
                              <AvatarImage
                                src={profile.avatar}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-bold">
                                {displayName?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-bold text-base text-foreground truncate">
                              {displayName}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {displayEmail}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </button>

                        {/* Quick Action Buttons - Larger touch targets */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleNavigateTo("/website")}
                            variant="outline"
                            size="lg"
                            className="h-11 text-sm touch-manipulation"
                          >
                            <Home className="w-4 h-4 mr-2" />
                            {t("navbar.home")}
                          </Button>
                          <Button
                            onClick={() => handleNavigateTo("/noti")}
                            variant="outline"
                            size="lg"
                            className="h-11 text-sm touch-manipulation"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            {t("navbar.notifications")}
                          </Button>
                          {(role === "ROLE_ADMIN" ||
                            role === "ROLE_SELLER") && (
                            <Button
                              onClick={() =>
                                handleNavigateTo(
                                  role === "ROLE_ADMIN" ? "/admin" : "/seller"
                                )
                              }
                              variant="outline"
                              size="lg"
                              className="h-11 text-sm col-span-2 touch-manipulation"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Dashboard
                            </Button>
                          )}
                          <Button
                            onClick={() => handleNavigateTo("/my-data")}
                            variant="outline"
                            size="lg"
                            className="h-11 text-sm col-span-2 touch-manipulation"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            {t("navbar.myData")}
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleSignOut}
                          size="lg"
                          className="w-full h-11 text-sm touch-manipulation"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t("navbar.logout")}
                        </Button>
                      </div>
                    ) : null
                  ) : (
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
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
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
                  )}
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
    </Fragment>
  );
}   