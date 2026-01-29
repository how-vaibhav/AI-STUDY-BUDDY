"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Zap,
  Clock,
  Target,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

/* ---------- motion presets (kept lightweight) ---------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface DayRoutine {
  dayNumber: number;
  title: string;
  content: string;
}

interface StudyPlanSubsections {
  generalInfo: string;
  dailyRoutines: DayRoutine[];
}

export default function StudyPlannerPage() {
  const { toast } = useToast();
  const pageRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    subject: "",
    exam: "JEE Advanced",
    numDays: "30",
    topics: "",
    difficulty: "4-6 hours",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlanSubsections | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayRoutine | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  /* ---------- GSAP page entrance ---------- */
  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "PDF must be less than 50MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or image file",
          variant: "destructive",
        });
        return;
      }

      setPdfFile(file);
      setPdfName(file.name);
      toast({
        title: "File selected",
        description: `${file.name} ready for upload`,
      });
    }
  };

  const downloadStudyPlan = async () => {
    if (!plan) return;

    try {
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Title
      pdf.setFontSize(18);
      pdf.setTextColor(102, 126, 234);
      pdf.text(title, margin, currentY);
      currentY += 12;

      // Generated date
      pdf.setFontSize(10);
      pdf.setTextColor(136, 136, 136);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        margin,
        currentY,
      );
      currentY += 10;

      // General Info Section
      pdf.setFontSize(14);
      pdf.setTextColor(102, 126, 234);
      pdf.text("General Information", margin, currentY);
      currentY += 8;

      pdf.setFontSize(11);
      pdf.setTextColor(51, 51, 51);
      const generalLines = pdf.splitTextToSize(plan.generalInfo, maxWidth);
      generalLines.forEach((line: string) => {
        if (currentY > pageHeight - margin - 10) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 5;
      });

      currentY += 5;

      // Daily Routines
      plan.dailyRoutines.forEach((day, index) => {
        if (currentY > pageHeight - margin - 20) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(13);
        pdf.setTextColor(102, 126, 234);
        pdf.text(`Day ${index + 1}`, margin, currentY);
        currentY += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(51, 51, 51);
        const dayLines = pdf.splitTextToSize(day.toString(), maxWidth);
        dayLines.forEach((line: string) => {
          if (currentY > pageHeight - margin - 10) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += 5;
        });

        currentY += 8;
      });

      pdf.save(`${title.replace(/\s+/g, "-")}.pdf`);

      toast({
        title: "Downloaded",
        description: "Study plan downloaded as PDF successfully",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompletionToggle = () => {
    setIsCompleted(!isCompleted);
    toast({
      title: isCompleted ? "Incomplete" : "Completed",
      description: isCompleted
        ? "Study plan marked as incomplete"
        : "Study plan marked as completed",
    });
  };

  const savePlan = async () => {
    try {
      setSaving(true);

      const payload = {
        ...plan,
        title: title,
      };

      const response = await fetch("/api/save-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Internal Server Error");
      }

      toast({ title: "Saved", description: "Plan was saved successfully." });
      setPlan(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An error occurred!";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject",
        variant: "destructive",
      });
      return;
    }

    const days = parseInt(formData.numDays);
    if (isNaN(days) || days < 1 || days > 365) {
      toast({
        title: "Error",
        description: "Please enter days between 1 and 365",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch("/api/generate-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.studyPlanSubsections) {
        throw new Error(data.error || "Failed to generate study plan");
      }

      setPlan(data.studyPlanSubsections);

      setTitle(
        `${formData.subject} Routine for ${formData.exam} in ${formData.numDays} days.`,
      );

      toast({
        title: "Success",
        description: "Study plan generated successfully",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Parallax ambient blobs */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-120 w-120 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-blue-300/20 blur-3xl" />
      </MouseParallax>

      <motion.main
        ref={pageRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Study Plan Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Create realistic, day-wise study plans with focused goals, revision
            buffers, and exam-oriented strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="sticky top-24 glass-card border-purple-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Plan Details
                  </CardTitle>
                  <CardDescription>
                    Personalize your study strategy
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject (e.g. Physics)"
                      required
                    />

                    <select
                      name="exam"
                      value={formData.exam}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                    >
                      {[
                        "JEE Advanced",
                        "JEE Mains",
                        "NEET",
                        "GATE",
                        "Board Exam",
                        "UPSC",
                        "CAT",
                      ].map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="number"
                      name="numDays"
                      value={formData.numDays}
                      onChange={handleInputChange}
                      min={1}
                      max={365}
                      placeholder="Days available"
                      required
                    />

                    <Input
                      name="topics"
                      value={formData.topics}
                      onChange={handleInputChange}
                      placeholder="Topics (e.g. For Physics- occilation, Simple Harmonic Motion, Dopler's Principle, etc.)"
                      required
                    />

                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="3-4 hours">Easy (3–4 hrs/day)</option>
                      <option value="4-6 hours">Medium (4–6 hrs/day)</option>
                      <option value="6-8 hours">Hard (6–8 hrs/day)</option>
                    </select>

                    <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50/50 dark:bg-purple-900/20 cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition group">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handlePdfChange}
                      />
                      <div className="space-y-2">
                        {pdfName ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                              {pdfName}
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition">
                              📄 Upload Schedule/Notes (Optional)
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, JPG, or PNG (Max 50MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Generate Plan
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Results */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {error && (
              <motion.div variants={itemVariants}>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Error</p>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {plan && (
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Header Card */}
                <Card className="glass-card border-purple-200/60 dark:border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Your Personalized Study Plan
                    </CardTitle>
                    <CardDescription>
                      {formData.exam} • {formData.subject} • {formData.numDays}{" "}
                      days
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Day Cards Grid - 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {plan.dailyRoutines.map((day, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="glass-card border-purple-200/60 dark:border-purple-500/30 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group overflow-hidden">
                        <CardHeader className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30">
                          <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {day.dayNumber}
                            </div>
                            <span>{day.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-3 mb-4">
                            <p className="text-sm text-muted-foreground line-clamp-4">
                              {day.content
                                .split("\n")
                                .slice(0, 3)
                                .map((line: string) => line.trim())
                                .filter((line: string) => line.length > 0)
                                .join(" • ")}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition"
                            onClick={() => {
                              setSelectedDay(day);
                              setShowDetailModal(true);
                            }}
                          >
                            View Details →
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* General Info Section */}
                <Card className="glass-card border-purple-200/60 dark:border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-700 dark:text-purple-300">
                      📖 General Information
                    </CardTitle>
                    <CardDescription>
                      Key study notes and resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-purple-200/40 dark:border-purple-500/30 bg-linear-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6">
                      <div className="text-gray-800 dark:text-gray-100 prose dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-3xl font-bold text-purple-800 dark:text-purple-200 mt-6 mb-3 first:mt-0"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-5 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-4 mb-2"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside space-y-1 my-3 ml-2"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-inside space-y-1 my-3 ml-2"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li
                                className="text-gray-700 dark:text-gray-300 ml-0"
                                {...props}
                              />
                            ),
                            code: (props: any) =>
                              props.inline ? (
                                <code
                                  className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-purple-900 dark:text-purple-100 font-mono text-sm"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-purple-900/30 text-purple-100 p-4 rounded-lg my-2 overflow-x-auto font-mono text-sm"
                                  {...props}
                                />
                              ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-purple-600 pl-4 italic text-gray-600 dark:text-gray-400 my-3"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="font-bold text-purple-700 dark:text-purple-300"
                                {...props}
                              />
                            ),
                            em: ({ node, ...props }) => (
                              <em
                                className="italic text-purple-600 dark:text-purple-400"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {plan.generalInfo}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save/Download Buttons */}
                <div className="flex gap-4 mt-8 flex-wrap">
                  <Button
                    type="submit"
                    disabled={saving}
                    onClick={savePlan}
                    className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Save Plan
                      </span>
                    )}
                  </Button>
                  <Button
                    onClick={downloadStudyPlan}
                    variant="outline"
                    className="flex-1"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Download PDF
                    </span>
                  </Button>
                </div>

                {/* Completion Checkbox */}
                <div className="flex items-center gap-3 mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={isCompleted}
                    onChange={handleCompletionToggle}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="completed"
                    className="flex-1 cursor-pointer font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mark study plan as completed
                  </label>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </motion.div>
            )}

            {!plan && !error && (
              <motion.div variants={itemVariants}>
                <Card className="border-dashed border-purple-300 bg-purple-50/60">
                  <CardContent className="py-16 text-center">
                    <BookOpen className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                    <p className="font-medium text-gray-700">
                      Fill the form to generate your plan
                    </p>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto mt-2">
                      You’ll get a realistic, revision-friendly schedule
                      tailored to your exam and difficulty level.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.main>

      {/* Features Section - improved layout & animation */}
      <motion.section
        className="mt-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold">What You’ll Get</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            A concise summary of what the generated study plan includes and why
            it helps you prepare efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            className=""
          >
            <Card className="glass-card border-purple-200/60 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Day-wise Breakdown</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Each day lists focused activities: theory, practice, and short
                  revision slots.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Daily learning targets</li>
                  <li>Short reviews and checkpoints</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }}>
            <Card className="glass-card border-purple-200/60 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <Target className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Focused Goals</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Clarity on priority topics and measurable milestones so you
                  know what to complete each week.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Topic prioritization</li>
                  <li>Milestone reminders</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }}>
            <Card className="glass-card border-purple-200/60 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <Zap className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Practical Tips</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Actionable study techniques and quick strategies tailored to
                  your exam type.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Problem-solving heuristics</li>
                  <li>Smart revision tactics</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }}>
            <Card className="glass-card border-purple-200/60 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <Clock className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Time Management</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Realistic daily schedules that balance focused study and
                  recovery to avoid burnout.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Balanced daily hours</li>
                  <li>Built-in recovery slots</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDay && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {selectedDay.dayNumber}
                  </div>
                  <span>{selectedDay.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Detailed schedule for this day
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold text-purple-800 dark:text-purple-200 mt-4 mb-2 first:mt-0"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-3 mb-2"
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
                          className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside space-y-1 my-2 ml-2"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="text-gray-700 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-bold text-purple-700 dark:text-purple-300"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {selectedDay.content}
                  </ReactMarkdown>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-2">
                      Timing Breakdown:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>⏰ Morning: 6:00 AM - 9:00 AM</div>
                      <div>📚 Afternoon: 1:00 PM - 4:00 PM</div>
                      <div>🌙 Evening: 6:00 PM - 8:00 PM</div>
                      <div>🎯 Night: 8:00 PM - 10:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
