"use client";

import { Logo } from "@/components/Logo";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-4xl font-bold">CCTV Manager</h1>
      </div>
    </header>
  );
}
