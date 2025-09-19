"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { menuItems } from "./DashboardHorizontalNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


type MenuItem = (typeof menuItems)[number];

type DashboardHeaderProps = {
  activePage: MenuItem;
  setActivePage: (page: MenuItem) => void;
};

export function DashboardHeader({
  activePage,
  setActivePage,
}: DashboardHeaderProps) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="text-4xl font-bold whitespace-nowrap">
          Surveillance Manager <span className="text-gold">PRO</span>
        </span>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
         <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <SheetHeader className="mb-4 text-left">
                <SheetTitle>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Logo />
                        <span className="">Surveillance Manager <span className="text-gold">PRO</span></span>
                    </a>
                </SheetTitle>
                <SheetDescription>
                    Select a page to navigate to.
                </SheetDescription>
            </SheetHeader>
            <nav className="grid gap-2 text-lg font-medium">
              {menuItems.map((item) => (
                <a
                  href="#"
                  key={item}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item);
                  }}
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                    activePage === item
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
