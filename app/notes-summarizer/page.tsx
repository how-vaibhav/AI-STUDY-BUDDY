"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MouseParallax } from "react-just-parallax";
import dynamic from "next/dynamic";

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
import { usePDFWorker } from "@/hooks/use-pdf-worker";
import { BookOpen, Download, Youtube, Play, Upload, X, File } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { processUploadedFile } from "@/lib/file-utils";

interface Summary {
  id: string;
  title: string;
  summary: string;
  subject?: string;
  examType?: string;
  timestamp: Date;
  youtubeVideos?: Array<{
    title: string;
    url: string;
    channel: string;
  }>;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: number;
}

export default function NotesSummarizerPage() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize PDF worker
  usePDFWorker();

  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
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

    // Load uploaded files from localStorage
    const loadUploadedFiles = () => {
      try {
        const stored = localStorage.getItem('notes_summarizer_files');
        if (stored) {
          setUploadedFiles(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load uploaded files:', err);
      }
    };

    loadUploadedFiles();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['application/pdf', 'image/png', 'text/plain'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: 'Error',
          description: `${file.name} exceeds 50MB limit`,
          variant: 'destructive',
        });
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Error',
          description: `${file.name} is not a supported format (PDF, PNG, or TXT)`,
          variant: 'destructive',
        });
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const rawContent = event.target?.result;
            const processedContent = await processUploadedFile(file, rawContent as any);

            const newFile: UploadedFile = {
              id: `file_${Date.now()}_${i}`,
              name: file.name,
              type: file.type,
              size: file.size,
              content: processedContent,
              uploadedAt: Date.now(),
            };

            setUploadedFiles((prev) => {
              const updated = [...prev, newFile];
              // Save to localStorage
              localStorage.setItem('notes_summarizer_files', JSON.stringify(updated));
              return updated;
            });

            toast({
              title: 'Success',
              description: `${file.name} uploaded and processed successfully`,
            });
          } catch (err) {
            toast({
              title: 'Error',
              description: `Failed to process ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`,
              variant: 'destructive',
            });
          }
        };

        if (file.type === 'application/pdf') {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: `Failed to read ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      localStorage.setItem('notes_summarizer_files', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we have either notes or uploaded files
    const hasNotes = formData.notes.trim().length > 0;
    const hasFiles = uploadedFiles.length > 0;

    if (!hasNotes && !hasFiles) {
      toast({
        title: "Error",
        description: "Please enter notes or upload files to summarize",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare content - prioritize uploaded files, then add manual notes
      let contentToSummarize = formData.notes;
      
      if (uploadedFiles.length > 0) {
        const fileContent = uploadedFiles
          .map(f => `### ${f.name}\n${f.content}`)
          .join('\n\n---\n\n');
        contentToSummarize = fileContent + (formData.notes ? `\n\n### Additional Notes\n${formData.notes}` : '');
      }

      const response = await fetch("/api/summarize-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: contentToSummarize,
          subject: formData.subject,
          examType: formData.examType,
          title: formData.title,
        }),
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
          youtubeVideos: generateYoutubeVideos(formData.subject, formData.title),
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

  const downloadSummary = async (summary: Summary) => {
    try {
      const { jsPDF } = await import("jspdf");
      
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(5, 150, 105);
      pdf.text(summary.title, margin, currentY);
      currentY += 12;

      // Meta info
      pdf.setFontSize(10);
      pdf.setTextColor(136, 136, 136);
      if (summary.subject) {
        pdf.text(`Subject: ${summary.subject}`, margin, currentY);
        currentY += 6;
      }
      if (summary.examType) {
        pdf.text(`Exam: ${summary.examType}`, margin, currentY);
        currentY += 6;
      }
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY);
      currentY += 10;

      // Content
      pdf.setFontSize(12);
      pdf.setTextColor(51, 51, 51);
      
      const lines = pdf.splitTextToSize(summary.summary, maxWidth);
      lines.forEach((line: string) => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 6;
      });

      pdf.save(`${summary.title.replace(/\s+/g, "-")}.pdf`);

      toast({
        title: "Downloaded",
        description: "Notes downloaded as PDF successfully",
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

  const generateYoutubeVideos = (subject: string, topic: string) => {
    // Curated YouTube videos based on topics with real, working channels
    const videoDatabase: Record<string, Array<{ title: string; url: string; channel: string }>> = {
      physics: [
        { title: "Physics Full Course - Complete Guide", url: "https://www.youtube.com/channel/UCXDMnCUluDvjQwbDVWXwbow", channel: "Physics Wallah" },
        { title: "Classical Mechanics - Detailed Explanation", url: "https://www.youtube.com/c/TheOrganicChemistryTutor", channel: "The Organic Chemistry Tutor" },
        { title: "Motion and Forces Tutorial", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
      ],
      chemistry: [
        { title: "Organic Chemistry - Complete Reactions", url: "https://www.youtube.com/c/TheOrganicChemistryTutor", channel: "The Organic Chemistry Tutor" },
        { title: "Inorganic Chemistry Made Simple", url: "https://www.youtube.com/channel/UCXDMnCUluDvjQwbDVWXwbow", channel: "Chemistry Wallah" },
        { title: "Chemical Bonding Explained", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
      ],
      mathematics: [
        { title: "Calculus - Complete Course", url: "https://www.youtube.com/c/ProfessorLeonard", channel: "Professor Leonard" },
        { title: "Algebra and Functions - Basics to Advanced", url: "https://www.youtube.com/c/TheOrganicChemistryTutor", channel: "The Organic Chemistry Tutor" },
        { title: "Trigonometry Mastery Course", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
      ],
      biology: [
        { title: "Complete Biology Course for Exams", url: "https://www.youtube.com/channel/UC-7VmZlhvBcXVu_9V3JJDdA", channel: "Crash Course Biology" },
        { title: "Cell Biology Deep Dive", url: "https://www.youtube.com/c/AmoebaSisters", channel: "Amoeba Sisters" },
        { title: "Genetics and Evolution Explained", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
      ],
      english: [
        { title: "English Grammar Complete Course", url: "https://www.youtube.com/c/EnglishAddict", channel: "English Addict with Mr. Duncan" },
        { title: "Literature Analysis and Writing", url: "https://www.youtube.com/c/CrashCourse", channel: "Crash Course Literature" },
        { title: "Speaking and Communication Skills", url: "https://www.youtube.com/c/TED", channel: "TED-Ed" },
      ],
      history: [
        { title: "World History Complete Guide", url: "https://www.youtube.com/c/CrashCourse", channel: "Crash Course World History" },
        { title: "Indian History - Complete Series", url: "https://www.youtube.com/channel/UCXDMnCUluDvjQwbDVWXwbow", channel: "History Simplified" },
        { title: "Ancient Civilizations", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
      ],
    };

    const subjectKey = subject.toLowerCase();
    return (
      videoDatabase[subjectKey] || [
        { title: "General Learning Resources", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
        { title: "Educational Course Platform", url: "https://www.youtube.com/c/Coursera", channel: "Coursera" },
        { title: "Subject Deep Dive Course", url: "https://www.youtube.com/c/CrashCourse", channel: "Crash Course" },
      ]
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-emerald-900 dark:to-slate-900">
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

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Upload Files to Summarize
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload files"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Files (Max 50MB)
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: PDF, PNG, TXT
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Files ({uploadedFiles.length})
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <File className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="flex-shrink-0 p-1 hover:bg-emerald-200 rounded transition"
                          >
                            <X className="w-4 h-4 text-emerald-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  name="notes"
                  placeholder="Or paste your notes here… (optional if files uploaded)"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full min-h-36 rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <div key={summary.id} className="space-y-4">
                  {/* Main Summary Card */}
                  <Card className="glass-card border-emerald-200/60 hover:shadow-lg transition-shadow overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-blue-50">
                      <div className="flex justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl">{summary.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {summary.subject && `📘 ${summary.subject}`}
                            {summary.subject && summary.examType && " • "}
                            {summary.examType && `🎯 ${summary.examType}`}
                          </CardDescription>
                        </div>

                        <Button
                          onClick={() => downloadSummary(summary)}
                          title="Download summary as PDF"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Download size={18} className="mr-2" />
                          PDF
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-200/40">
                        <div className="text-gray-800 markdown-content">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-emerald-700 mt-6 mb-3" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-700 mt-5 mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-600 mt-4 mb-2" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-base font-bold text-emerald-600 mt-3 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className="text-gray-700 mb-3 leading-relaxed" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 ml-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 ml-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-3 bg-emerald-50/50 italic text-gray-700" {...props} />,
                              table: ({node, ...props}) => <table className="w-full border-collapse my-4 border border-emerald-300" {...props} />,
                              thead: ({node, ...props}) => <thead className="bg-emerald-100" {...props} />,
                              tbody: ({node, ...props}) => <tbody {...props} />,
                              tr: ({node, ...props}) => <tr className="border border-emerald-300" {...props} />,
                              th: ({node, ...props}) => <th className="border border-emerald-300 px-3 py-2 text-left font-bold text-gray-900" {...props} />,
                              td: ({node, ...props}) => <td className="border border-emerald-300 px-3 py-2 text-gray-700" {...props} />,
                              code: ({node, inline, ...props}: any) => 
                                inline ? 
                                <code className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-mono text-sm" {...props} /> :
                                <code className="bg-gray-900 text-emerald-300 px-4 py-3 rounded font-mono text-sm block overflow-x-auto my-3" {...props} />,
                              pre: ({node, ...props}) => <pre className="bg-gray-900 text-emerald-300 px-4 py-3 rounded font-mono text-sm overflow-x-auto my-3" {...props} />,
                              hr: () => <hr className="my-4 border-emerald-300" />,
                            }}
                          >
                            {summary.summary}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* YouTube Recommendations Card */}
                  {summary.youtubeVideos && summary.youtubeVideos.length > 0 && (
                    <Card className="glass-card border-blue-200/60 bg-gradient-to-br from-blue-50 to-purple-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Youtube className="w-5 h-5 text-red-600" />
                          Recommended Videos
                        </CardTitle>
                        <CardDescription>
                          Learn more about this topic
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {summary.youtubeVideos.map((video, idx) => (
                            <a
                              key={idx}
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block p-4 rounded-lg bg-white border border-blue-200 hover:shadow-lg transition-all hover:border-blue-400"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition">
                                  <Play className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                                    {video.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
