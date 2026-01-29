"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Brain,
  MessageSquare,
  Zap,
  Globe,
  ShieldCheck,
  ArrowRight,
  Lightbulb,
  Calendar,
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  const start = (path = "/signup") => {
    try {
      localStorage.setItem("hasSeenOnboarding", "true");
    } catch {}
    router.push(path);
  };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/30 to-purple-100/20 rounded-full blur-3xl -mr-48 -mt-48 dark:from-indigo-900/20 dark:to-purple-900/10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-200/20 to-slate-100/10 rounded-full blur-3xl -ml-48 -mb-48 dark:from-slate-800/20 dark:to-slate-900/10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center pt-20 pb-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            {/* Logo/Brand Identifier */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50"
            >
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Cerevia: The AI Path to Understanding
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white"
            >
              Structured Learning,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Not Just Answers
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
            >
              An AI system designed for how serious students think. Plan your
              study path, solve complex doubts, and master concepts with
              cognitive clarity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button
                onClick={() => start("/signup")}
                className="px-8 py-6 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => start("/login")}
                className="px-8 py-6 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Sign In
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={item}
              className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Privacy-First & Secure</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>AI Built for Exams</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Structured Understanding</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* WHY CEREVIA */}
        <section className="py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={item} className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Why Cerevia?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 font-light">
                Because thinking clearly is the first step to learning deeply.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="grid gap-6 md:grid-cols-2 pt-8"
            >
              <div className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Cognitive Clarity
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  We help you break down complex topics into structured learning
                  paths, not just answer questions.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Exam-Native Design
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Built specifically for JEE, NEET, GATE, UPSC, and Boards—not
                  generic, but purpose-built.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Unified Workflow
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Plan, understand, practice, and review—all in one place. No
                  app-switching chaos.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Your Privacy First
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Your learning data is yours alone. We don't sell, we don't
                  track unnecessarily.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CORE CAPABILITIES */}
        <section className="py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            <motion.div
              variants={item}
              className="text-center space-y-4 max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                How Cerevia Works
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                AI that understands how students think, built for structured
                mastery.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "Study Path Planning",
                  desc: "Personalized, week-by-week learning plans tailored to your exam timeline.",
                },
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  title: "Deep Doubt Resolution",
                  desc: "Step-by-step explanations with exam-focused reasoning, in your language.",
                },
                {
                  icon: <BookOpen className="w-6 h-6" />,
                  title: "Smart Summarization",
                  desc: "Transform notes and PDFs into exam-ready, structured summaries.",
                },
                {
                  icon: <Lightbulb className="w-6 h-6" />,
                  title: "Concept Mastery",
                  desc: "Interactive practice with instant feedback and knowledge reinforcement.",
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "Learning Analytics",
                  desc: "Track your progress and identify knowledge gaps before exams.",
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Multilingual Support",
                  desc: "Learn in Hindi, English, or multiple languages simultaneously.",
                },
              ].map((f, i) => (
                <motion.div
                  variants={item}
                  key={i}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 w-fit mb-4">
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {f.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={item} className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Common Questions
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Everything you need to know about Cerevia.
              </p>
            </motion.div>

            <motion.div variants={item} className="mt-10">
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem
                  value="what"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-slate-900 dark:text-white">
                      What makes Cerevia different from ChatGPT?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                    Cerevia is purpose-built for students and exams. We
                    specialize in structured learning workflows, exam-focused
                    reasoning, and step-by-step mastery. ChatGPT is a
                    general-purpose AI. We're specialized, exam-aware, and
                    designed for long-term understanding—not just quick answers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="lang"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-slate-900 dark:text-white">
                      Does Cerevia support multiple languages?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                    Yes—Hindi and English are fully supported. You can switch
                    languages mid-session. We're expanding to regional languages
                    based on student demand. Learn in whatever language helps
                    you think clearly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="exams"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-slate-900 dark:text-white">
                      Which exams does Cerevia cover?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                    JEE Mains & Advanced, NEET, GATE, UPSC, CBSE/ICSE Boards,
                    CA/CS, and many state exams. Our knowledge base is
                    continuously expanded based on exam syllabi and student
                    feedback.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="privacy"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-slate-900 dark:text-white">
                      How is my data protected?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                    Your data is encrypted, stored securely, and used only to
                    provide Cerevia's services. We don't sell your data, track
                    you unnecessarily, or use it for marketing. Privacy is
                    non-negotiable for us.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="cost"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-slate-900 dark:text-white">
                      What's the pricing model?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-4">
                    We offer a free tier to get started. Premium plans unlock
                    unlimited access, advanced features, and priority support.
                    We believe good education shouldn't be expensive, so we keep
                    our plans affordable for students.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>
        </section>

        {/* PHILOSOPHY */}
        <section className="py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={item}
              className="p-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-800/50"
            >
              <p className="text-lg md:text-xl text-slate-900 dark:text-white font-light leading-relaxed">
                <span className="font-semibold">
                  "Cerevia is built on the idea that learning is a process—not a
                  prompt."
                </span>
                <br />
                <br />
                We believe good education requires structure, clarity, and
                guidance. Our AI doesn't just answer questions; it helps you
                build a cognitive framework for understanding. Every feature is
                designed around how your brain learns best: breaking down
                complexity, reinforcing connections, and mastering concepts at
                depth.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={item} className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Ready to Take Control of Your Learning?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 font-light">
                Join thousands of students who've moved beyond chatbots to
                structured, AI-guided mastery.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button
                onClick={() => start("/signup")}
                className="px-8 py-6 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Path Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => start("/login")}
                className="px-8 py-6 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Sign In
              </Button>
            </motion.div>

            <motion.p
              variants={item}
              className="text-sm text-slate-600 dark:text-slate-400 pt-4"
            >
              No credit card required. Free access to core features.
            </motion.p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
