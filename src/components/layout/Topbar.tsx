"use client";

import { Menu, User, Bell } from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { navItems } from "./Sidebar";
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

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md lg:hidden animate-in fade-in zoom-in-95 duration-200">
           <div className="flex h-16 items-center justify-between border-b px-6">
             <div className="flex items-center gap-2 font-bold text-xl text-primary">
                {/* Re-using Brand Logic if needed or just Text */}
                <span>Cadence</span>
             </div>
             <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
             >
               <span className="sr-only">Close Menu</span>
               {/* Close Icon (X) */}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
           </div>
           
           <nav className="flex-1 space-y-2 p-6">
              {/* We need navItems here. Importing them next. */}
              {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-all"
                    >
                      <Icon className="h-6 w-6" />
                      <span>{item.label}</span>
                    </Link>
                  )
              })}
           </nav>
        </div>
      )}
      
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
