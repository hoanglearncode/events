import type { ReactNode } from "react";
import PublicHeader from "@/components/features/common/publicHeader";
import PublicFooter from "@/components/features/common/publicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
