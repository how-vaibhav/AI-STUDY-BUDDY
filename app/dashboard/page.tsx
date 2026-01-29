"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/auth";
import {
  BookOpen,
  Brain,
  FileText,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Study progress data
const studyProgressData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3.5 },
  { day: "Wed", hours: 2.5 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 3 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 2 },
];

const subjectData = [
  { name: "Physics", value: 30 },
  { name: "Chemistry", value: 25 },
  { name: "Mathematics", value: 25 },
  { name: "Biology", value: 20 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899"];

const performanceData = [
  { subject: "Physics", correct: 75, total: 100 },
  { subject: "Chemistry", correct: 82, total: 100 },
  { subject: "Math", correct: 88, total: 100 },
  { subject: "Biology", correct: 79, total: 100 },
];

export default function DashboardPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    plansCreated: 5,
    questionsAsked: 12,
    notesSummarized: 8,
    totalStudyHours: 24.5,
    streak: 7,
    accuracy: 81,
  });

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

      // Simulate loading user stats from localStorage
      const savedStats = localStorage.getItem("userStats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-muted-foreground animate-pulse">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Ambient parallax background */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-120 w-120 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />
      </MouseParallax>

      <main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"
      >
        {/* Welcome */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.full_name || "Student"} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Let's make today productive. Here's your learning dashboard.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              icon: Brain,
              title: "Study Plans",
              value: stats.plansCreated,
              color: "from-blue-600 to-blue-500",
            },
            {
              icon: FileText,
              title: "Questions",
              value: stats.questionsAsked,
              color: "from-purple-600 to-purple-500",
            },
            {
              icon: BookOpen,
              title: "Notes",
              value: stats.notesSummarized,
              color: "from-pink-600 to-pink-500",
            },
            {
              icon: TrendingUp,
              title: "Accuracy",
              value: `${stats.accuracy}%`,
              color: "from-emerald-600 to-emerald-500",
            },
          ].map((metric) => (
            <Card
              key={metric.title}
              className="glass-card border-indigo-200/60 dark:border-purple-500/30 hover:shadow-lg transition-all"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.title}
                    </p>
                    <p
                      className={`text-2xl md:text-3xl font-bold mt-2 bg-linear-to-r ${metric.color} bg-clip-text text-transparent`}
                    >
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-linear-to-br ${metric.color} bg-opacity-10`}
                  >
                    <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Study Progress Chart */}
          <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Weekly Study Hours
              </CardTitle>
              <CardDescription>Your study activity this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Study Distribution
              </CardTitle>
              <CardDescription>Time spent by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Accuracy by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="correct"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Streak Card */}
            <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30 bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.streak}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  days in a row 🔥
                </p>
              </CardContent>
            </Card>

            {/* Motivational Card */}
            <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-emerald-600 to-teal-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  3.25 of 5 hours completed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Brain,
                title: "Study Planner",
                desc: "Create personalized study plans",
                href: "/study-planner",
                cta: "Create Plan",
                color: "from-blue-600 to-blue-500",
              },
              {
                icon: FileText,
                title: "Doubt Solver",
                desc: "Ask questions and get answers",
                href: "/doubt-solver",
                cta: "Ask Now",
                color: "from-purple-600 to-purple-500",
              },
              {
                icon: BookOpen,
                title: "Notes Summarizer",
                desc: "Summarize long notes quickly",
                href: "/notes-summarizer",
                cta: "Summarize",
                color: "from-pink-600 to-pink-500",
              },
            ].map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg bg-linear-to-br ${action.color} bg-opacity-10`}
                      >
                        <action.icon
                          className={`w-5 h-5 bg-linear-to-r ${action.color} bg-clip-text text-transparent`}
                        />
                      </div>
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full bg-linear-to-r ${action.color} text-white hover:scale-[1.02] transition`}
                    >
                      {action.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
