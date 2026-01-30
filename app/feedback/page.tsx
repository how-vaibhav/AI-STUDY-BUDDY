"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { ErrorDisplay } from "@/components/error-display";
import { SuccessDisplay } from "@/components/success-display";

interface FeedbackForm {
  name: string;
  email: string;
  category: string;
  message: string;
}

export default function FeedbackPage() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    category: "suggestion",
    message: "",
  });

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }
      if (!formData.message.trim()) {
        setError("Please enter your feedback message");
        setLoading(false);
        return;
      }

      // Store feedback in localStorage (or send to API)
      const storedFeedback = localStorage.getItem("cerevia_feedback");
      const feedbackList = storedFeedback ? JSON.parse(storedFeedback) : [];

      feedbackList.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
      });

      localStorage.setItem("cerevia_feedback", JSON.stringify(feedbackList));

      // Reset form
      setFormData({
        name: "",
        email: "",
        category: "suggestion",
        message: "",
      });

      setSuccess("Thank you for your feedback! We appreciate your input.");
      toast({
        title: "Success",
        description: "Your feedback has been submitted successfully",
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit feedback";
      setError(msg);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12 md:py-20">
      <div ref={containerRef} className="container mx-auto px-4 max-w-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Share Your Feedback
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Help us improve Cerevia. We value your suggestions, bug reports,
              and general feedback.
            </p>
          </motion.div>

          {/* Feedback Form */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>
                  Tell us what you think about Cerevia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Error Display */}
                  {error && (
                    <ErrorDisplay
                      error={error}
                      onDismiss={() => setError(null)}
                      autoHide={0}
                    />
                  )}

                  {/* Success Display */}
                  {success && (
                    <SuccessDisplay
                      message={success}
                      onDismiss={() => setSuccess(null)}
                    />
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Feedback Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm shadow-sm dark:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-slate-300 dark:hover:border-slate-600"
                      >
                        <option value="suggestion">Suggestion</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="general">General Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Your Feedback *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please share your thoughts, suggestions, or report issues here..."
                        rows={6}
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 h-10"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                title: "Quick Feedback",
                description: "Share quick suggestions or observations",
              },
              {
                title: "Report Issues",
                description: "Report bugs or technical problems",
              },
              {
                title: "Feature Ideas",
                description: "Request new features or improvements",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-slate-200/60 dark:border-slate-700/60"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
