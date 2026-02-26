"use client";

import { useRouter, usePathname } from "next/navigation";

import { Maintenance } from "@/components/MaintainMode";
import { useSettingStore } from "@/store/setting.store";

// import Cookies from "js-cookie";
import { useEffect } from "react";
import { ALLOWED_REGISTER } from "@/shared/const/cookie";
import { useSettingGeneralQuery } from "@/hooks/query/setting";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function SettingProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  // const { data: general } = useSettingGeneralQuery();

  // const setGeneral = useSettingStore((s) => s.setGeneral);

  // useEffect(() => {
  //   if (general) {
  //     setGeneral(general);
  //   }
  // }, [general, setGeneral]);

  const isMaintenance = false // useSettingStore((state) => state.general?.maintainMode);
  const allowRegister = false // useSettingStore(
  //   (state) => state.general?.allowRegister
  // );

  const allowDuringMaintenance =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  useEffect(() => {
    if (allowRegister !== undefined) {
      // Cookies.set(ALLOWED_REGISTER, allowRegister.toString(), { expires: 7 });
    }
  }, [allowRegister]);

  if (isMaintenance && !allowDuringMaintenance) {
    return <Maintenance />;
  }
  return <>{children}</>;
}
