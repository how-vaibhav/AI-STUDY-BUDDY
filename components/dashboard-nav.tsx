"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { RemoveScroll } from "react-remove-scroll";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/auth";
import {
  Menu,
  X,
  LogOut,
  BookOpen,
  Brain,
  FileText,
  Sun,
  Moon,
  User,
  Settings,
  Trophy,
  HelpCircle,
  Bell,
  Mail,
} from "lucide-react";

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch notifications on mount
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/send-notification");
      const data = await response.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BookOpen },
    { href: "/study-planner", label: "Study Planner", icon: Brain },
    { href: "/doubt-solver", label: "Doubt Solver", icon: FileText },
    { href: "/notes-summarizer", label: "Notes Summarizer", icon: FileText },
    { href: "/quiz", label: "Quizzes", icon: Trophy },
  ];

  /* 🌊 SAFE wave animation */
  useEffect(() => {
    if (!waveRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(waveRef.current, {
      x: "-12%",
      duration: 18,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  /* 📱 Drawer animation */
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (mobileMenuOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power3.out" },
      );
    } else {
      gsap.to(drawerRef.current, { x: "100%", duration: 0.3 });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className="
          sticky top-0 z-50
          border-b
          bg-linear-to-r
          from-indigo-100/95 via-white/95 to-blue-100/95
          dark:from-[#0b1020]/95 dark:via-[#101a35]/95 dark:to-[#0b1020]/95
          backdrop-blur-xl
          border-indigo-200/40 dark:border-white/10
        "
      >
        {/* 🌊 Wave (visual only) */}
        <div
          ref={waveRef}
          className="
            pointer-events-none
            absolute inset-0 z-0
            -left-[20%] w-[140%]
            bg-linear-to-r
            from-indigo-500/30 via-purple-500/30 to-blue-500/30
            blur-3xl
          "
        />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold"
            >
              <div className="p-2 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
                <Brain size={18} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="hidden sm:inline text-lg text-foreground">
                  Cerevia
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  The Path to Understanding
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`gap-2 ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Notifications Bell */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/notifications")}
                className="relative hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              {/* Theme toggle (SAFE) */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  {resolvedTheme === "dark" ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )}
                </Button>
              )}

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center ring-2 ring-indigo-400/50"
                >
                  U
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 glass-card z-80">
                    <button
                      onClick={() => router.push("/profile")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <User size={16} /> Profile
                    </button>
                    <button
                      onClick={() => router.push("/settings")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <button
                      onClick={() => router.push("/about")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <HelpCircle size={16} /> About
                    </button>
                    <button
                      onClick={() => router.push("/contact")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Mail size={16} /> Contact
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* ✅ FIXED HAMBURGER */}
              <button
                className="
                  md:hidden
                  relative z-60
                  p-2 rounded-lg
                  bg-primary/15
                  text-primary
                  hover:bg-primary/25
                "
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <RemoveScroll>
          <div className="fixed inset-0 z-100">
            {/* Overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-black/50 opacity-0 z-90"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div
              ref={drawerRef}
              className="absolute right-0 top-0 h-full w-72 bg-background shadow-2xl z-100 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 ${
                          active
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t space-y-2">
                {mounted && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun size={16} />
                    ) : (
                      <Moon size={16} />
                    )}
                    Toggle Theme
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    router.push("/notifications");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bell size={16} />
                  Notifications
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    router.push("/about");
                    setMobileMenuOpen(false);
                  }}
                >
                  <HelpCircle size={16} />
                  About
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    router.push("/contact");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Mail size={16} />
                  Contact
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </RemoveScroll>
      )}
    </>
  );
}
