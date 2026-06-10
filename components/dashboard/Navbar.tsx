"use client";

import { Bell, User, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const { profile } = useStore();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-8 text-card-foreground">
      <div className="flex items-center space-x-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          HealthSaaS Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center space-x-3 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{profile?.full_name ?? "..."}</p>
            <p className="text-xs text-muted-foreground">{profile?.role ?? ""}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {initials !== "?" ? initials : <User className="h-5 w-5" />}
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
