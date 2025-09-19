"use client";

import { cn } from "@/lib/utils";

export const menuItems = ["Cameras", "NVRs", "POE Switch", "Todo", "IP Scanner", "Zones", "Settings"] as const;

type MenuItem = (typeof menuItems)[number];

type DashboardHorizontalNavProps = {
  activePage: MenuItem;
  setActivePage: (page: MenuItem) => void;
};

export function DashboardHorizontalNav({
  activePage,
  setActivePage,
}: DashboardHorizontalNavProps) {
  return (
    <nav className="hidden border-b bg-background md:block">
      <div className="flex h-12 items-center px-4 lg:px-6">
        <div className="flex items-center gap-6 text-sm font-medium">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item);
              }}
              className={cn(
                "transition-colors hover:text-foreground",
                activePage === item
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
