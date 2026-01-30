"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import {
  Brain,
  CheckCircle,
  Zap,
  Lock,
  Unlock,
  Award,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Quiz {
  id: string;
  day: number;
  subject: string;
  totalQuestions: number;
  completed: boolean;
  score?: number;
  unlocked: boolean;
}

const AVAILABLE_TOPICS = [
  { label: "Oscillation", value: "oscillation" },
  { label: "Doppler Effect", value: "doppler effect" },
  { label: "Calculus", value: "calculus" },
  { label: "Algebra", value: "algebra" },
  { label: "Atomic Structure", value: "atomic structure" },
  { label: "Genetics", value: "genetics" },
];

export default function QuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("oscillation");
  const [totalStreak, setTotalStreak] = useState(7);
  const [totalAccuracy, setTotalAccuracy] = useState(81);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Generate sample quizzes based on study plan
      const mockQuizzes: Quiz[] = [
        {
          id: "1",
          day: 1,
          subject: "Physics - Mechanics",
          totalQuestions: 10,
          completed: true,
          score: 85,
          unlocked: true,
        },
        {
          id: "2",
          day: 2,
          subject: "Chemistry - Organic",
          totalQuestions: 12,
          completed: true,
          score: 92,
          unlocked: true,
        },
        {
          id: "3",
          day: 3,
          subject: "Mathematics - Calculus",
          totalQuestions: 15,
          completed: false,
          unlocked: true,
        },
        {
          id: "4",
          day: 4,
          subject: "Physics - Thermodynamics",
          totalQuestions: 10,
          completed: false,
          unlocked: false,
        },
        {
          id: "5",
          day: 5,
          subject: "Chemistry - Physical",
          totalQuestions: 12,
          completed: false,
          unlocked: false,
        },
      ];

      setQuizzes(mockQuizzes);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-muted-foreground animate-pulse">
            Loading quizzes…
          </p>
        </div>
      </div>
    );
  }

  const completedQuizzes = quizzes.filter((q) => q.completed).length;
  const averageScore =
    quizzes.filter((q) => q.completed && q.score).length > 0
      ? Math.round(
          quizzes
            .filter((q) => q.completed && q.score)
            .reduce((acc, q) => acc + (q.score || 0), 0) /
            quizzes.filter((q) => q.completed && q.score).length,
        )
      : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <main
        ref={containerRef}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Daily Quizzes 🎓
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              icon: CheckCircle,
              label: "Completed",
              value: completedQuizzes,
              color: "from-emerald-600 to-emerald-500",
            },
            {
              icon: TrendingUp,
              label: "Average Score",
              value: `${averageScore}%`,
              color: "from-blue-600 to-blue-500",
            },
            {
              icon: Zap,
              label: "Current Streak",
              value: totalStreak,
              color: "from-orange-600 to-orange-500",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="glass-card border-indigo-200/60 dark:border-purple-500/30"
              >
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p
                        className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quiz List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
              Your Quizzes
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`glass-card border-indigo-200/60 dark:border-purple-500/30 cursor-pointer hover:shadow-lg transition-all ${
                      !quiz.unlocked ? "opacity-50" : ""
                    }`}
                    onClick={() => quiz.unlocked && setSelectedQuiz(quiz)}
                  >
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                              Day {quiz.day}
                            </span>
                            {!quiz.unlocked && (
                              <Lock className="w-3 sm:w-4 h-3 sm:h-4 text-muted-foreground shrink-0" />
                            )}
                            {quiz.completed && (
                              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 truncate">
                            {quiz.subject}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {quiz.totalQuestions} questions
                            {quiz.completed && quiz.score && (
                              <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                • Score: {quiz.score}%
                              </span>
                            )}
                          </p>
                        </div>
                        <Button
                          disabled={!quiz.unlocked}
                          onClick={() => {
                            if (quiz.unlocked) {
                              if (!quiz.completed) {
                                setSelectedQuiz(quiz);
                                setShowTopicModal(true);
                              } else {
                                router.push(
                                  `/quiz/take?id=${quiz.id}&day=${quiz.day}`,
                                );
                              }
                            }
                          }}
                          className={`whitespace-nowrap h-9 sm:h-10 text-xs sm:text-sm ${
                            quiz.completed
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-linear-to-r from-indigo-600 to-purple-600"
                          }`}
                        >
                          {quiz.completed
                            ? "Review"
                            : quiz.unlocked
                              ? "Start"
                              : "Locked"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Card */}
            <Card className="glass-card border-blue-200/60 dark:border-blue-500/30 mt-4 sm:mt-6 bg-blue-50/50 dark:bg-blue-900/20">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex gap-3 sm:gap-4">
                  <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-1" />
                  <div className="min-w-0">
                    <h4 className="font-bold mb-1 text-sm sm:text-base">
                      Progressive Unlocking
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Today's quiz is available. Future quizzes unlock as you
                      complete previous ones. This helps you maintain a
                      consistent learning schedule and build momentum!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Tips Card */}
            <Card className="glass-card border-purple-200/60 dark:border-purple-500/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Brain className="w-4 sm:w-5 h-4 sm:h-5" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex gap-2">
                  <span className="text-base sm:text-lg shrink-0">⏱️</span>
                  <p>
                    Complete quizzes within 30 minutes for time-based bonuses
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-base sm:text-lg shrink-0">🎯</span>
                  <p>Focus on one topic at a time for better retention</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-base sm:text-lg shrink-0">📈</span>
                  <p>Review your mistakes to improve accuracy</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-base sm:text-lg shrink-0">🔥</span>
                  <p>Maintain your streak by completing daily quizzes</p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card border-amber-200/60 dark:border-amber-500/30">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Award className="w-4 sm:w-5 h-4 sm:h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs sm:text-sm">
                {[
                  "✓ Perfect Score (100%)",
                  "✓ 7-Day Streak",
                  "5+ Quizzes Completed",
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className={
                      achievement.startsWith("5")
                        ? "text-muted-foreground"
                        : "font-medium"
                    }
                  >
                    {achievement}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notification Card */}
            <Card className="glass-card border-green-200/60 dark:border-green-500/30 bg-green-50/50 dark:bg-green-900/20">
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium text-xs sm:text-sm">
                    <Unlock className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
                    Today's Quiz Unlocked!
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Complete it to unlock tomorrow's quiz and maintain your
                    streak.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Topic Selection Modal */}
        <Dialog open={showTopicModal} onOpenChange={setShowTopicModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Quiz Topic</DialogTitle>
              <DialogDescription>
                Choose a topic to start your quiz. You'll get 5 questions on
                this topic.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 py-4">
              {AVAILABLE_TOPICS.map((topic) => (
                <button
                  key={topic.value}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedTopic === topic.value
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-400"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowTopicModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedQuiz) {
                    router.push(
                      `/quiz/take?id=${selectedQuiz.id}&day=${selectedQuiz.day}&topic=${selectedTopic}`,
                    );
                  }
                  setShowTopicModal(false);
                }}
                className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600"
              >
                Start Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
