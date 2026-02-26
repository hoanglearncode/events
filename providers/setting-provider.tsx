"use client";

import { useRouter, usePathname } from "next/navigation";
import { Maintenance } from "@/components/MaintainMode";
import { useSettingStore } from "@/store/setting.store";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { ALLOWED_REGISTER } from "@/shared/const/cookie";
import { useSettingGeneralQuery } from "@/hooks/query/setting";
import { defaultGeneralConfig } from "@/shared/config/site.config";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function SettingProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();

  const {
    data: general,
    isLoading,
    isError,
  } = useSettingGeneralQuery();

  const setGeneral = useSettingStore((s) => s.setGeneral);

  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      console.warn("⚠️ Load setting failed → using default config");
      setGeneral(defaultGeneralConfig);
      return;
    }

    if (general) {
      setGeneral(general);
    }
  }, [general, isError, isLoading, setGeneral]);

  const isMaintenance = useSettingStore(
    (state) => state.general?.maintainMode
  );

  const allowRegister = useSettingStore(
    (state) => state.general?.allowRegister
  );

  const allowDuringMaintenance =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login");


  useEffect(() => {
    if (allowRegister !== undefined) {
      Cookies.set(ALLOWED_REGISTER, allowRegister.toString(), {
        expires: 7,
      });
    }
  }, [allowRegister]);


  if (isLoading) {
    return null;
  }

  if (isMaintenance && !allowDuringMaintenance) {
    return <Maintenance />;
  }

  return <>{children}</>;
}