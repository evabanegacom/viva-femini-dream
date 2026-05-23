import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Home, Heart, Stethoscope, Settings } from "lucide-react";
import profilePic from "@/assets/profile-image.svg";
import bellNotification from "@/assets/bell-notification.svg";

import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tracking", label: "Tracking", icon: Heart },
  { to: "/health-report", label: "Health Report", icon: Stethoscope },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      {/* Header */}

<header className="sticky top-4 md:top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">  <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center">

    {/* LEFT */}
    <div className="flex items-center gap-3 shrink-0">
      <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-pink-400 flex items-center justify-center text-primary-foreground font-bold shrink-0">
        <img src={profilePic} alt="Profile" className="h-full w-full rounded-full object-cover" />
      </div>

      <div>
        <p className="text-xs text-[#9CA3AF]">Good Morning ☀️</p>
        <p className="font-bold text-[#0F172A] text-sm">Emmanuelle</p>
      </div>
    </div>

    {/* CENTER (perfectly centered) */}
    <div className="flex-1 flex justify-center">
      <nav className="hidden md:flex items-center gap-1 bg-[#F3F4F6] rounded-full p-1 shadow-sm border border-border/50">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center flex-col gap-1 px-10 py-1 rounded-full text-sm font-semibold transition-all",
                active
                  ? "bg-[#B32070] text-white shadow font-semibold"
                  : "text-[#0F172A] font-normal bg-white"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>

    {/* RIGHT (mobile only) */}
    <div className="flex items-center gap-4 md:hidden shrink-0">
      <img src={bellNotification} alt="Notifications" className="h-6 w-6" />
      <Settings className="h-6 w-6 text-[#9CA3AF]" />
    </div>

  </div>
</header>

      <main className="max-w-7xl mx-auto md:px-8 py-4 md:py-6">
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
                    "flex items-center flex-col gap-1.5 px-8 py-1.5 rounded-full text-[#0F172A] font-normal",
                    active && "bg-[#B32070] text-white font-semibold"
                  )}
                >
                  <Icon className="size-4" />
                  <span className={cn(active ? "inline text-center" : "hidden")}>{label}</span>
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
