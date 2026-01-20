"use client";

import { Menu, User, Bell } from "lucide-react";
import { useState } from "react";


export function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md lg:bg-background">
      {/* Mobile Menu Trigger & Title */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-bold text-lg text-primary">Cadence</span>
      </div>

      {/* Desktop Helper (Spacer) */}
      <div className="hidden lg:block lg:flex-1">
        {/* Placeholder for Breadcrumbs or Search */}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-l">
            <div className="flex flex-col items-end hidden sm:block">
                <span className="text-sm font-semibold">Guest Dancer</span>
                <span className="text-xs text-muted-foreground">Level 1</span>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-2 ring-transparent transition-all hover:ring-primary/20">
            <User className="h-5 w-5" />
            </button>
        </div>
      </div>
      
      {/* Mobile specific drawer could go here if implementing a real Sheet later */}
    </header>
  );
}
