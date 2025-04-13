
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "דשבורד",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "יומן",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "לקוחות",
    href: "/clients",
    icon: Users,
  },
  {
    title: "כספים",
    href: "/finances",
    icon: FileText,
  },
  {
    title: "הזמנות",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    title: "משימות",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "הגדרות",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
        <h1 className="text-xl font-bold text-white">GalionTek</h1>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white hover:bg-primary/90">
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="p-5">
          <h1 className="text-2xl font-bold text-white mb-6">GalionTek</h1>
        </div>
        <nav className="px-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">GalionTek</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="text-white hover:bg-primary/90"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav>
                <ul className="space-y-3">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={toggleMobileMenu}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-white"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
