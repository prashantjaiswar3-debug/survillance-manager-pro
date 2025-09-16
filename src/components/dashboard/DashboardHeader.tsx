"use client";

import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <h1 className="text-xl font-bold">CCTV Manager</h1>
      </div>
    </header>
  );
}
