import { Link, useLocation } from "wouter";
import { Home, BookOpen, Users, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/lib/accessibility-context";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

export function TopNavigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useAccessibility();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-h-[70px] md:min-h-[80px] items-center justify-between gap-2 md:gap-4 px-4 md:px-6 w-full">
        <Link href="/">
          <div 
            className="flex items-center gap-2 md:gap-3 hover-elevate rounded-lg px-2 md:px-3 py-2 cursor-pointer min-h-[60px]"
            data-testid="link-logo"
          >
            <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-xl bg-primary flex-shrink-0">
              <BookOpen className="h-6 md:h-7 w-6 md:w-7 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-xl md:text-2xl font-bold text-foreground">WiseConnect</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`min-h-[60px] px-4 text-base md:text-lg font-medium gap-2 md:gap-3 ${
                    isActive ? "" : "text-muted-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-5 md:h-6 w-5 md:w-6" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-[56px] md:h-[60px] w-[56px] md:w-[60px]"
            data-testid="button-theme-toggle"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-5 md:h-6 w-5 md:w-6" />
            ) : (
              <Sun className="h-5 md:h-6 w-5 md:w-6" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-24 items-center justify-around px-1 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location === item.href || 
            (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center justify-center gap-1 px-3 md:px-4 py-2 md:py-3 rounded-xl min-w-[72px] md:min-w-[80px] min-h-[68px] md:min-h-[72px] transition-colors active:scale-95 ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover-elevate"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <Icon className="h-6 md:h-7 w-6 md:w-7" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
