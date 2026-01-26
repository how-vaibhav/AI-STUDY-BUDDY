"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";

import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/auth";
import { BookOpen, Brain, FileText, Clock } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- GSAP page entrance ---------- */
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [loading]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUser(data || session.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-muted-foreground animate-pulse">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <DashboardNav />

      {/* Ambient parallax background */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-purple-300/20 blur-3xl" />
      </MouseParallax>

      <main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.full_name || "Student"} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Let’s make today productive.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Brain,
              title: "Study Planner",
              desc: "Create personalized, exam-focused study plans.",
              href: "/study-planner",
              cta: "Create Study Plan",
            },
            {
              icon: FileText,
              title: "Doubt Solver",
              desc: "Ask questions and get clear explanations instantly.",
              href: "/doubt-solver",
              cta: "Ask a Question",
            },
            {
              icon: BookOpen,
              title: "Notes Summarizer",
              desc: "Turn long notes or PDFs into crisp summaries.",
              href: "/notes-summarizer",
              cta: "Summarize Notes",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="glass-card border-indigo-200/60 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] transition">
                    {item.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { label: "Study Plans Created", value: "0" },
            { label: "Questions Asked", value: "0" },
            { label: "Notes Summarized", value: "0" },
            { label: "Study Time", value: "0h", icon: Clock },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="glass-card border-indigo-200/60 hover:shadow-md transition"
            >
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center items-center gap-2">
                  {stat.icon && (
                    <stat.icon className="w-5 h-5 text-indigo-600" />
                  )}
                  <p className="text-3xl font-bold text-indigo-700">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
