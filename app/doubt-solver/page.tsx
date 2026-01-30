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
import { usePDFWorker } from "@/hooks/use-pdf-worker";
import { MessageCircle, Send, Lightbulb, Upload, X, File, Play, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { processUploadedFile } from "@/lib/file-utils";
import generateYoutubeVideosFromContent from "../../lib/video-utils";

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

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: number;
}

const convertMarkdownToHTML = (markdown: string, colorScheme: 'emerald' | 'purple') => {
  let html = markdown;

  // Headers
  html = html.replace(/^#### (.*$)/gm, `<h4 style="font-size: 1rem; font-weight: bold; color: ${colorScheme === 'emerald' ? '#059669' : '#9333ea'}; margin-top: 0.5rem; margin-bottom: 0.25rem;">$1</h4>`);
  html = html.replace(/^### (.*$)/gm, `<h3 style="font-size: 1.125rem; font-weight: bold; color: ${colorScheme === 'emerald' ? '#059669' : '#9333ea'}; margin-top: 0.75rem; margin-bottom: 0.5rem;">$1</h3>`);
  html = html.replace(/^## (.*$)/gm, `<h2 style="font-size: 1.25rem; font-weight: bold; color: ${colorScheme === 'emerald' ? '#047857' : '#7c3aed'}; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h2>`);
  html = html.replace(/^# (.*$)/gm, `<h1 style="font-size: 1.5rem; font-weight: bold; color: ${colorScheme === 'emerald' ? '#047857' : '#7c3aed'}; margin-top: 1.25rem; margin-bottom: 0.75rem;">$1</h1>`);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, `<strong style="font-weight: bold; color: ${colorScheme === 'emerald' ? '#111827' : '#7c3aed'};">$1</strong>`);

  // Italic
  html = html.replace(/\*(.*?)\*/g, `<em style="font-style: italic; color: ${colorScheme === 'emerald' ? '#374151' : '#9333ea'};">$1</em>`);

  // Code inline
  html = html.replace(/`([^`]+)`/g, `<code style="background-color: ${colorScheme === 'emerald' ? '#d1fae5' : '#faf5ff'}; color: ${colorScheme === 'emerald' ? '#065f46' : '#581c87'}; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">$1</code>`);

  // Code block
  html = html.replace(/```([\s\S]*?)```/g, `<pre style="background-color: ${colorScheme === 'emerald' ? '#111827' : 'rgba(147, 51, 234, 0.3)'}; color: ${colorScheme === 'emerald' ? '#6ee7b7' : '#faf5ff'}; padding: 0.75rem 1rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem; overflow-x: auto; margin: 0.75rem 0;"><code>$1</code></pre>`);

  // Lists
  html = html.replace(/^- (.*$)/gm, `<li style="color: #374151; margin-left: 1rem; line-height: 1.625;">$1</li>`);
  html = html.replace(/^\d+\. (.*$)/gm, `<li style="color: #374151; margin-left: 1rem; line-height: 1.625;">$1</li>`);

  // Paragraphs
  html = html.split('\n\n').map(p => p.trim()).filter(p => p).map(p => `<p style="color: #374151; line-height: 1.625; margin-bottom: 0.75rem;">${p.replace(/\n/g, '<br>')}</p>`).join('');

  // Wrap lists
  html = html.replace(/(<li.*<\/li>\s*)+/g, '<ul style="list-style-type: disc; list-style-position: inside; margin-bottom: 0.75rem; margin-left: 0.5rem;">$&</ul>');

  return html;
};

export default function DoubtSolverPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState<currentDoubt | null>(null);
  const [doubts, setDoubts] = useState<doubts[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<Array<{title:string;url:string;channel:string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize PDF worker
  usePDFWorker();

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

    // Load uploaded files from localStorage
    const loadUploadedFiles = () => {
      try {
        const stored = localStorage.getItem("doubt_solver_files");
        if (stored) {
          setUploadedFiles(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load uploaded files:", err);
      }
    };

    fetchDoubts();
    loadUploadedFiles();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
    );
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ["application/pdf", "image/png", "text/plain"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `${file.name} is not a supported format (PDF, PNG, or TXT)`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const rawContent = event.target?.result;
            const processedContent = await processUploadedFile(
              file,
              rawContent as any,
            );

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
              localStorage.setItem(
                "doubt_solver_files",
                JSON.stringify(updated),
              );
              return updated;
            });

            toast({
              title: "Success",
              description: `${file.name} uploaded and processed successfully`,
            });
          } catch (err) {
            toast({
              title: "Error",
              description: `Failed to process ${file.name}: ${err instanceof Error ? err.message : "Unknown error"}`,
              variant: "destructive",
            });
          }
        };

        if (file.type === "application/pdf") {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to read ${file.name}`,
          variant: "destructive",
        });
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      localStorage.setItem("doubt_solver_files", JSON.stringify(updated));
      return updated;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const downloadDoubt = async () => {
    if (!currentDoubt) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const answerHTML = convertMarkdownToHTML(currentDoubt.answer, 'purple');

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 10px;">${currentDoubt.question}</h1>
          <p style="color: #888; font-size: 12px; margin: 5px 0;">Generated: ${new Date().toLocaleDateString()}</p>
          <div style="margin-top: 20px;">
            ${answerHTML}
          </div>
        </div>
      `;

      const options = {
        margin: 1,
        filename: `doubt-solution-${Date.now()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(options).from(htmlContent).save();

      toast({
        title: "Downloaded",
        description: "Doubt solution downloaded as PDF successfully",
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

    if (uploadedFiles.length === 0) {
      toast({
        title: "Info",
        description:
          "Consider uploading reference files for better doubt solving",
        variant: "default",
      });
    }

    setLoading(true);

    try {
      // Prepare file context with better formatting
      let fileContext =
        uploadedFiles.length > 0
          ? uploadedFiles
              .map((f) => `### ${f.name}\n${f.content}`)
              .join("\n\n---\n\n")
          : null;

      // Truncate file context to max 10000 characters to stay within Groq limits
      if (fileContext && fileContext.length > 10000) {
        fileContext = fileContext.substring(0, 10000) + "\n\n[... content truncated ...]";
      }

      const response = await fetch("/api/solve-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fileContext: fileContext,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to solve doubt");
      }

      // Extract answer text
      const answerText = data.answer || "";

      // Detect subject and topic via server API (server-side Groq call)
      const contentForAnalysis = fileContext || answerText;
      let detectedSubject = 'general';
      let detectedTopic = '';
      try {
        const res = await fetch('/api/detect-subject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentForAnalysis }),
        });
        const j = await res.json();
        if (res.ok && j.success) {
          if (j.subject) detectedSubject = j.subject;
          if (j.topic) detectedTopic = j.topic;
        }
      } catch (err) {
        console.warn('[doubt-solver] Subject detection failed, falling back to hint', err);
      }

      // Prefer user-selected subject if provided, otherwise use detected subject
      const effectiveSubject = formData.subject && formData.subject.trim() ? formData.subject.trim() : detectedSubject;

      // Generate recommended videos based on detected topic (preferred) then subject
      const vids = generateYoutubeVideosFromContent(contentForAnalysis, effectiveSubject, detectedTopic);
      setRecommendedVideos(vids);

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
          <p className="text-slate-600 dark:text-slate-400 text-lg">
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
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Upload Reference Files (Optional)
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
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
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
                          className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <File className="w-4 h-4 text-purple-600 shrink-0" />
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
                            className="shrink-0 p-1 hover:bg-purple-200 rounded transition"
                          >
                            <X className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  name="question"
                  placeholder="Type your question here…"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full min-h-28 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm shadow-sm dark:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-0 dark:focus:ring-offset-0 hover:border-purple-300 dark:hover:border-purple-600"
                  required
                />

                <Input
                  name="subject"
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="border-purple-200 dark:border-purple-700 focus-visible:border-purple-500 dark:focus-visible:border-purple-400 focus-visible:ring-purple-500/30 dark:focus-visible:ring-purple-400/30"
                />

                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm shadow-sm dark:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 hover:border-purple-300 dark:hover:border-purple-600"
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {currentDoubt.question}
                        </CardTitle>
                        <CardDescription>
                          {currentDoubt.subject && `📘 ${currentDoubt.subject}`}{" "}
                          {currentDoubt.examType &&
                            ` • 🎯 ${currentDoubt.examType}`}
                        </CardDescription>
                      </div>
                      <Button
                        onClick={downloadDoubt}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
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
                                                  {(() => {
                                                      const defaultVideos = [
                                                          { title: 'Understanding Core Concepts', channel: 'Educational', url: 'https://www.youtube.com/results?search_query=understanding+core+concepts' },
                                                          { title: 'Advanced Problem Solving', channel: 'Educational', url: 'https://www.youtube.com/results?search_query=advanced+problem+solving' },
                                                          { title: 'In-Depth Explanation', channel: 'Educational', url: 'https://www.youtube.com/results?search_query=in+depth+explanation' },
                                                      ];

                                                      const videosToShow = (recommendedVideos && recommendedVideos.length > 0) ? recommendedVideos : defaultVideos;

                                                      return videosToShow.map((video, idx) => (
                                                          <a
                                                              key={idx}
                                                              href={video.url}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/40 dark:border-purple-500/30 hover:shadow-md transition-all hover:border-purple-400 group"
                                                          >
                                                              <div className="flex items-start gap-3 mb-2">
                                                                  <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition">
                                                                      <Play className="w-4 h-4 text-purple-600" />
                                                                  </div>
                                                                  <div className="flex-1 min-w-0">
                                                                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                                                                          {video.title}
                                                                      </h4>
                                                                      <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                                                                  </div>
                                                              </div>
                                                          </a>
                                                      ));
                                                  })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-96 flex items-center justify-center glass-card border-purple-200/60">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
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
