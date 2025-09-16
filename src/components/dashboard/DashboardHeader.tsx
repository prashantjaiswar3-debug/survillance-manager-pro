"use client";

import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-4xl font-bold">CCTV Manager</h1>
      </div>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8"
        />
      </div>
    </header>
  );
}
