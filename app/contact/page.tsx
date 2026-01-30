"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect } from "react";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1,
        onComplete: function () {
          // Ensure elements stay visible
          gsap.set("[data-animate]", { clearProps: "all" });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast({
        title: "Message Sent! 📧",
        description: data.message,
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
          data-animate
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Have questions or feedback? We'd love to hear from you. Reach out to
            our team and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Contact Info Cards */}
          {[
            {
              icon: Mail,
              title: "Email",
              description: "support@aibuddy.com",
              color: "from-purple-600 to-blue-600",
            },
            {
              icon: Phone,
              title: "Phone",
              description: "+1 (555) 123-4567",
              color: "from-blue-600 to-indigo-600",
            },
            {
              icon: MapPin,
              title: "Address",
              description: "San Francisco, CA 94105",
              color: "from-indigo-600 to-purple-600",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition"
                data-animate
              >
                <div
                  className={`inline-block p-2 sm:p-3 rounded-lg bg-gradient-to-br ${item.color} text-white mb-3 sm:mb-4`}
                >
                  <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
            data-animate
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="h-10 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-gray-300">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Message subject"
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-gray-300">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  required
                  className="text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-sm text-white hover:scale-[1.02] transition"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* FAQ or Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 sm:p-6 md:p-8"
            data-animate
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-white">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <p className="font-semibold dark:text-purple-300 mb-1">
                  How quickly will I get a response?
                </p>
                <p className="text-muted-foreground dark:text-gray-300">
                  We typically respond within 24 hours on business days.
                </p>
              </div>
              <div>
                <p className="font-semibold dark:text-purple-300 mb-1">
                  Do you offer technical support?
                </p>
                <p className="text-muted-foreground dark:text-gray-300">
                  Yes! Our support team is available to help with any technical
                  issues.
                </p>
              </div>
              <div>
                <p className="font-semibold dark:text-purple-300 mb-1">
                  Can I schedule a demo?
                </p>
                <p className="text-muted-foreground dark:text-gray-300">
                  Absolutely! Contact us to schedule a personalized demo with
                  our team.
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white dark:bg-slate-700 rounded-lg border-l-4 border-purple-600">
              <p className="text-xs sm:text-sm dark:text-gray-300">
                <strong>Pro Tip:</strong> For urgent matters, you can also reach
                out via email with "URGENT" in the subject line.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
