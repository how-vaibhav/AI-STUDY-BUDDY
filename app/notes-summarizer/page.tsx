"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";

import { DashboardNav } from "@/components/dashboard-nav";
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
import { BookOpen, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Summary {
  id: string;
  title: string;
  summary: string;
  subject?: string;
  examType?: string;
  timestamp: Date;
}

export default function NotesSummarizerPage() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [formData, setFormData] = useState({
    notes: "",
    subject: "",
    examType: "",
    title: "",
  });

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 28 },
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

    if (!formData.notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some notes to summarize",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/summarize-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to summarize notes");
      }

      setSummaries((prev) => [
        {
          id: Date.now().toString(),
          title:
            formData.title || `Summary - ${new Date().toLocaleDateString()}`,
          summary: data.summary || "",
          subject: formData.subject || undefined,
          examType: formData.examType || undefined,
          timestamp: new Date(),
        },
        ...prev,
      ]);

      setFormData({
        notes: "",
        subject: "",
        examType: "",
        title: "",
      });

      toast({
        title: "Success",
        description: "Notes summarized successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to summarize notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = (summary: Summary) => {
    const element = document.createElement("a");
    const file = new Blob([summary.summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${summary.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <DashboardNav />

      {/* Parallax background accents */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-300/20 blur-3xl" />
      </MouseParallax>

      <main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-blue-600 shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-blue-600 bg-clip-text text-transparent">
              Notes Summarizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Convert raw notes into clean, exam-focused summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1 sticky top-24 glass-card border-emerald-200/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-600" />
                Summarize Notes
              </CardTitle>
              <CardDescription>
                Paste notes and get structured output
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="title"
                  placeholder="Title (optional)"
                  value={formData.title}
                  onChange={handleInputChange}
                />

                <textarea
                  name="notes"
                  placeholder="Paste your notes here…"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full min-h-36 rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />

                <Input
                  name="subject"
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={handleInputChange}
                />

                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select exam</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="GATE">GATE</option>
                  <option value="Board Exam">Board Exam</option>
                </select>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:scale-[1.02] transition"
                  disabled={loading}
                >
                  {loading ? "Summarizing…" : "Summarize Notes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summaries */}
          <div className="lg:col-span-3 space-y-6">
            {summaries.length ? (
              summaries.map((summary, i) => (
                <Card
                  key={summary.id}
                  className="glass-card border-emerald-200/60 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between gap-4">
                      <div>
                        <CardTitle>{summary.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {summary.subject && `📘 ${summary.subject}`}
                          {summary.subject && summary.examType && " • "}
                          {summary.examType && `🎯 ${summary.examType}`}
                        </CardDescription>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadSummary(summary)}
                        title="Download summary"
                      >
                        <Download size={18} />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="prose prose-sm max-w-none">
                    <ReactMarkdown>{summary.summary}</ReactMarkdown>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="h-96 flex items-center justify-center glass-card border-emerald-200/60">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                  <p className="text-gray-600 font-medium">
                    No summaries yet. Paste notes to begin ✨
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
