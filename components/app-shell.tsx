"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SiteHeader pathname={pathname} />
      <main className="flex-1">{children}</main>
    </>
  );
}
