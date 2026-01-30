"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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
import { signIn } from "@/lib/auth";
import { AuthNav } from "@/components/auth-nav";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ---------- Smooth ambient motion (eye-friendly) ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orb-a", {
        x: 60,
        y: 40,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orb-b", {
        x: -50,
        y: -30,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orb-c", {
        x: 40,
        y: -50,
        duration: 26,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back",
          description: "Signed in successfully",
        });

        gsap.to(".login-card", {
          opacity: 0,
          y: -40,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => router.push("/dashboard"),
        });
      }
    } catch {
      toast({
        title: "Unexpected error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNav />

      <div
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4"
      >
        {/* Ambient animated shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="orb-a absolute top-20 left-16 w-80 h-80 rounded-full bg-purple-500/25 blur-[120px]" />
          <div className="orb-b absolute bottom-24 right-20 w-96 h-96 rounded-full bg-blue-500/20 blur-[140px]" />
          <div className="orb-c absolute top-1/2 left-1/3 w-[28rem] h-[28rem] rounded-full bg-indigo-500/15 blur-[160px]" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="login-card w-full flex justify-center"
        >
          <Card
            className="
              w-full max-w-sm
              border border-border/60
              bg-white/80 dark:bg-[#0b1020]/80
              backdrop-blur-xl
              shadow-[0_40px_90px_-25px_rgba(0,0,0,0.45)]
            "
          >
            <CardHeader className="text-center pt-8 space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI Study Buddy
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue learning
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="
                      h-11
                      bg-white/70 dark:bg-white/5
                      border border-border/70
                      backdrop-blur
                      shadow-inner
                      focus:border-purple-400
                      focus:ring-2 focus:ring-purple-500/30
                    "
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="
                      h-11
                      bg-white/70 dark:bg-white/5
                      border border-border/70
                      backdrop-blur
                      shadow-inner
                      focus:border-purple-400
                      focus:ring-2 focus:ring-purple-500/30
                    "
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full h-11 font-semibold
                    bg-gradient-to-r from-purple-600 to-blue-600
                    hover:from-purple-700 hover:to-blue-700
                    transition-all
                  "
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Don’t have an account?
                </span>{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
