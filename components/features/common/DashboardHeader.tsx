"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Search, Menu, LogOut, ChevronRight } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import { useProfileDetails } from "@/hooks/queries/profileQueries";
import type { UserProfile } from "@/types/auth";
import { SearchDialog } from "./SearchResult";
import { useAuthStore } from "@/store/auth.store";

interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ===== Auth =====
  const token = Cookies.get(ACCESS_TOKEN);
  const { user } = useAuthStore();

  const normalizeProfile = (raw: any): UserProfile | null => {
    if (!raw) return null;
    if (raw.data?.result) return raw.data.result;
    if (raw.result) return raw.result;
    if (raw.data) return raw.data;
    return raw;
  };

  const profile = useMemo<UserProfile | null>(() => {
    if (!user) return null;
    return normalizeProfile(user);
  }, [user]);

  const displayName = profile?.fullname || "User";
  const displayEmail = profile?.email || "";
  const role = (profile?.role || "USER").toUpperCase();

  function handleSignOut() {
    Cookies.remove(ACCESS_TOKEN);
    router.push("/login");
  }

  function handleNavigate(target: string) {
    setIsUserMenuOpen(false);
    router.push(target);
  }

  return (
    <header className="h-16 sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <div className="h-6 w-px bg-border" />
          {!user ? (
            <Skeleton className="h-9 w-9 rounded-lg" />
          ) : (
            <Sheet open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[11px] font-bold">{displayName}</div>
                    <div className="text-[9px] text-primary font-bold uppercase tracking-widest">
                      {role}
                    </div>
                  </div>
                  <Avatar className="h-9 w-9 ring-1 ring-gray-50 shadow-lg">
                    {profile?.avatar ? (
                      <AvatarImage
                        src={profile.avatar}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold">
                        {displayName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Tài khoản</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleNavigate("/website")}
                  >
                    Trang chủ
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-between text-destructive"
                    onClick={handleSignOut}
                  >
                    Đăng xuất
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
