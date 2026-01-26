"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { signUp } from "@/lib/auth";

import { gsap } from "gsap";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { MouseParallax } from "react-just-parallax";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [text] = useTypewriter({
    words: ["Learn smarter.", "Plan better.", "Succeed faster."],
    loop: false,
    delaySpeed: 1500,
  });

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
      );

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully! Please log in.",
        });
        router.push("/login");
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background px-4">
      {/* Decorative parallax blobs */}
      <MouseParallax strength={0.04} enableOnTouchDevice={false}>
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </MouseParallax>

      <Card
        ref={cardRef}
        className="relative w-full max-w-md border border-border/60 bg-background/80 backdrop-blur-xl shadow-xl"
      >
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create your account
          </CardTitle>

          <CardDescription className="text-sm">
            <span className="text-primary font-medium">{text}</span>
            <Cursor cursorStyle="|" />
          </CardDescription>

          <p className="text-xs text-muted-foreground">
            Join <span className="font-medium">AI Study Buddy for Bharat</span>
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                id: "fullName",
                label: "Full Name",
                type: "text",
                placeholder: "Your name",
              },
              {
                id: "email",
                label: "Email Address",
                type: "email",
                placeholder: "you@email.com",
              },
              {
                id: "password",
                label: "Password",
                type: "password",
                placeholder: "At least 6 characters",
              },
              {
                id: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "Confirm password",
              },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.id]}
                  onChange={handleInputChange}
                  className="transition focus-visible:ring-primary"
                  required
                />
              </div>
            ))}

            <Button
              type="submit"
              className="w-full transition-all duration-300 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?
            </span>{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
