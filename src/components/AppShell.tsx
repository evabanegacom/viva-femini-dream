import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Heart, FileText } from "lucide-react";
import profilePic from "@/assets/profile-image.svg";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tracking", label: "Tracking", icon: Heart },
  { to: "/health-report", label: "Health Report", icon: FileText },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-pink-400 flex items-center justify-center text-primary-foreground font-bold shrink-0">
              <img src={profilePic} alt="Profile" className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">Good Morning ☀️</p>
              <p className="font-semibold text-sm truncate">Emmanuelle</p>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-border/50">
            {tabs.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center flex-col gap-1 px-10 py-1 rounded-full text-sm font-semibold transition-all",
                    active
                      ? "bg-[#B32070] text-primary-foreground shadow"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="w-10 md:w-24" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 md:px-8 py-4 md:py-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-border shadow-lg">
        <div className="grid grid-cols-3 max-w-md mx-auto">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
                  active ? "text-primary-foreground" : "text-foreground/60"
                )}
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full",
                    active && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span className={cn(active ? "inline" : "hidden")}>{label}</span>
                </span>
                {!active && <span>{label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
