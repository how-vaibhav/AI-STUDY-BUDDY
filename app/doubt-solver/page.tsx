"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface currentDoubt {
  id: string;
  question: string;
  answer: string;
  subject?: string;
  examType?: string;
  timestamp: Date;
}

interface doubts {
  doubt_id: number;
  question: string;
  answer: string;
}

interface ApiResponse {
  success: boolean;
  Doubts: doubts[];
}

export default function DoubtSolverPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState<currentDoubt | null>(null);
  const [doubts, setDoubts] = useState<doubts[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    question: "",
    subject: "",
    examType: "",
    language: "english",
  });

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch("/api/solve-doubt");
        const data: ApiResponse = await response.json();

        if (data.success) setDoubts(data.Doubts);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    };
    fetchDoubts();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/solve-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to solve doubt");
      }

      setCurrentDoubt(data);

      setFormData({
        question: "",
        subject: "",
        examType: "",
        language: "english",
      });

      toast({
        title: "Success",
        description: "Your doubt has been solved!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to solve doubt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Parallax background accents */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-112 w-7xl rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-112 w-7xl rounded-full bg-pink-300/20 blur-3xl" />
      </MouseParallax>

      <motion.main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Ask Your Doubts
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Clear, exam-focused explanations — instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Form */}
          <Card className="lg:col-span-1 sticky top-24 glass-card border-purple-200/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                New Question
              </CardTitle>
              <CardDescription>Ask once. Understand clearly.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  name="question"
                  placeholder="Type your question here…"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full min-h-28 rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />

                <Input
                  name="subject"
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-white/70 border-purple-200"
                />

                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select exam</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="GATE">GATE</option>
                  <option value="Board">Board</option>
                </select>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
                  disabled={loading}
                >
                  {loading ? "Thinking…" : "Get Answer"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {/*current Doubt*/}
          <div className="lg:col-span-2 space-y-6">
            {currentDoubt ? (
              <motion.div
                key={currentDoubt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.08 }}
              >
                <Card className="glass-card border-purple-200/60 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {currentDoubt.question}
                    </CardTitle>
                    <CardDescription>
                      {currentDoubt.subject && `📘 ${currentDoubt.subject}`}{" "}
                      {currentDoubt.examType &&
                        ` • 🎯 ${currentDoubt.examType}`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="bg-linear-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 border border-purple-200/40 dark:border-purple-500/30 prose prose-sm max-w-none">
                      <div className="text-gray-800 dark:text-gray-100">
                        <div className="space-y-3">
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-4 mb-2"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-3 mb-2"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2 mb-1"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li
                                  className="text-gray-700 dark:text-gray-300 ml-4"
                                  {...props}
                                />
                              ),
                              code: ({ node, ...props }) => (
                                <code
                                  className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-purple-900 dark:text-purple-100 font-mono text-sm"
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-purple-400 pl-4 italic text-gray-600 dark:text-gray-400"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {currentDoubt.answer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    {/* Video Recommendations */}
                    <div className="mt-6 pt-6 border-t border-purple-200/40 dark:border-purple-500/30">
                      <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                        📺 Recommended Videos
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          {
                            title: "Understanding Core Concepts",
                            channel: "Physics Academy",
                            duration: "12:34",
                            url: "https://www.youtube.com/results?search_query=understanding+core+concepts",
                          },
                          {
                            title: "Advanced Problem Solving",
                            channel: "Math Mastery",
                            duration: "18:45",
                            url: "https://www.youtube.com/results?search_query=advanced+problem+solving",
                          },
                          {
                            title: "In-Depth Explanation",
                            channel: "Science Hub",
                            duration: "25:20",
                            url: "https://www.youtube.com/results?search_query=in+depth+explanation",
                          },
                        ].map((video, idx) => (
                          <a
                            key={idx}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/40 dark:border-purple-500/30 hover:shadow-md transition-all hover:border-purple-400 group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded bg-linear-to-br from-purple-500 to-blue-500 shrink-0 flex items-center justify-center text-white font-bold">
                                ▶
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition line-clamp-2">
                                  {video.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {video.channel} • {video.duration}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-96 flex items-center justify-center glass-card border-purple-200/60">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                  <p className="text-gray-600 font-medium">
                    Ask your first doubt to begin ✨
                  </p>
                </div>
              </Card>
            )}
          </div>
          {/* Previous Doubts History */}
          <div className="lg:col-span-1">
            <Card className="mt-6 glass-card border-blue-200/60 backdrop-blur-xl max-h-100 overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  Previous Doubts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {doubts.length > 0 ? (
                  doubts.map((doubt) => (
                    <button
                      key={doubt.doubt_id}
                      onClick={() =>
                        setCurrentDoubt({
                          id: doubt.doubt_id.toString(),
                          question: doubt.question,
                          answer: doubt.answer,
                          timestamp: new Date(), // Fallback timestamp
                        })
                      }
                      className="w-full text-left p-3 rounded-lg text-sm bg-white/50 hover:bg-white transition-colors border border-transparent hover:border-blue-200 group"
                    >
                      <p className="font-medium text-gray-700 line-clamp-2 group-hover:text-blue-600">
                        {doubt.question}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No history yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
