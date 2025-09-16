"use client";

import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";

export function DashboardHeader() {
  const menuItems = ["Cameras", "NVRs", "POE Switch", "Todo", "IP Scanner"];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-4xl font-bold">CCTV Manager</h1>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-lg font-medium md:text-sm">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {item}
          </a>
        ))}
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center gap-4">
              <Logo />
              <h1 className="text-2xl font-bold">CCTV Manager</h1>
            </div>
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
    </header>
  );
}
