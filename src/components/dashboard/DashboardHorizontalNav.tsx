export const menuItems = ["Cameras", "NVRs", "POE Switch", "Todo", "IP Scanner"];

export function DashboardHorizontalNav() {
  return (
    <nav className="hidden border-b bg-background md:block">
      <div className="flex h-12 items-center px-4 lg:px-6">
        <div className="flex items-center gap-6 text-sm font-medium">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
