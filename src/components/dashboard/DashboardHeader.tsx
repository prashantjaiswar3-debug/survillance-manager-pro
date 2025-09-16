"use client";

import { Aperture } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Aperture className="h-6 w-6" />
        <h1 className="text-xl font-bold">CCTV Manager</h1>
      </div>
    </header>
  );
}
