'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Doubt {
	id: string;
	question: string;
	answer: string;
	subject?: string;
	examType?: string;
	timestamp: Date;
}

export default function DoubtSolverPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    question: "",
    subject: "",
    examType: "",
    language: "english",
  });

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
				title: 'Error',
				description: 'Please enter a question',
				variant: 'destructive',
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
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to solve doubt");
      }

      setDoubts((prev) => [
        {
          id: Date.now().toString(),
          question: formData.question,
          answer: data.answer || "",
          subject: formData.subject || undefined,
          examType: formData.examType || undefined,
          timestamp: new Date(),
        },
        ...prev,
      ]);

      setFormData({
        question: "",
        subject: "",
        examType: "",
        language: "english",
      });

			toast({
				title: 'Success',
				description: 'Your doubt has been solved!',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to solve doubt',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <DashboardNav />

      {/* Parallax background accents */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-pink-300/20 blur-3xl" />
      </MouseParallax>

      <motion.main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
                  disabled={loading}
                >
                  {loading ? "Thinking…" : "Get Answer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Doubt History */}
          <div className="lg:col-span-3 space-y-6">
            {doubts.length ? (
              doubts.map((doubt, i) => (
                <motion.div
                  key={doubt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-card border-purple-200/60 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {doubt.question}
                      </CardTitle>
                      <CardDescription>
                        {doubt.subject && `📘 ${doubt.subject}`}{" "}
                        {doubt.examType && ` • 🎯 ${doubt.examType}`}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="prose prose-sm max-w-none">
                      <ReactMarkdown>{doubt.answer}</ReactMarkdown>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
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
        </div>
      </motion.main>
    </div>
  );
}
