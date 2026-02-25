import { General } from "@/app/(dashboard)/admin/settings/_types/setting";

export const defaultGeneralConfig: General = {
  systemName: "Event Platform",
  systemLogo: "/event_logo.jpg",
  systemEmail: "admin@system",
  systemTitle: "Event Platform - Updated",
  systemDescription: "Event management platform",
  maintainMode: false,
  allowRegister: true,
};
