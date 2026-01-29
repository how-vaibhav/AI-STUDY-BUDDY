"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Target,
  Users,
  Sparkles,
  CheckCircle,
  Award,
  Zap,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered",
      description:
        "Leveraging advanced AI to provide personalized learning paths",
    },
    {
      icon: Target,
      title: "Exam Focused",
      description:
        "Designed specifically for Indian competitive exams (JEE, NEET, GATE)",
    },
    {
      icon: Zap,
      title: "Interactive",
      description:
        "Daily quizzes, real-time doubt solving, and instant feedback",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Connect with thousands of students on similar learning journeys",
    },
  ];

  const milestones = [
    {
      number: "10K+",
      label: "Active Students",
      color: "from-blue-600 to-blue-500",
    },
    {
      number: "500K+",
      label: "Questions Answered",
      color: "from-purple-600 to-purple-500",
    },
    {
      number: "50K+",
      label: "Study Plans Created",
      color: "from-pink-600 to-pink-500",
    },
    {
      number: "98%",
      label: "Success Rate",
      color: "from-emerald-600 to-emerald-500",
    },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      bio: "Former NEET ranker, passionate about education tech",
    },
    {
      name: "Rahul Kapoor",
      role: "Lead Developer",
      bio: "Full-stack developer with 8+ years of experience",
    },
    {
      name: "Aisha Khan",
      role: "Content Director",
      bio: "Curriculum expert with background in IIT-JEE coaching",
    },
    {
      name: "Vikram Singh",
      role: "AI Specialist",
      bio: "ML engineer focused on educational applications",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            About AI Study Buddy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Revolutionizing education for Indian students through AI-powered
            learning tools and personalized study experiences.
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition">
              Start Learning Today
            </Button>
          </Link>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              To democratize quality education and help every Indian student
              unlock their full potential through AI-driven, personalized
              learning experiences. We believe that with the right tools and
              guidance, every student can excel.
            </CardContent>
          </Card>

          <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              To create a world where every student, regardless of background,
              has access to world-class education resources and personalized
              guidance powered by artificial intelligence.
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose AI Study Buddy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="glass-card border-indigo-200/60 dark:border-purple-500/30 hover:shadow-lg transition"
                >
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((milestone) => (
              <Card
                key={milestone.label}
                className="glass-card border-indigo-200/60 dark:border-purple-500/30"
              >
                <CardContent className="pt-8 text-center">
                  <div
                    className={`text-4xl font-bold bg-linear-to-r ${milestone.color} bg-clip-text text-transparent mb-2`}
                  >
                    {milestone.number}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {milestone.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="glass-card border-indigo-200/60 dark:border-purple-500/30 hover:shadow-lg transition hover:-translate-y-1"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Excellence",
                description:
                  "We strive for the highest quality in every feature and interaction",
                icon: Award,
              },
              {
                title: "Innovation",
                description:
                  "Continuously pushing boundaries with cutting-edge AI technology",
                icon: Zap,
              },
              {
                title: "Compassion",
                description:
                  "We care deeply about our students' success and well-being",
                icon: Heart,
              },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Card className="glass-card border-indigo-200/60 dark:border-purple-500/30 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 mb-8">
          <CardContent className="pt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Join the Learning Revolution
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Be part of a community of students using AI to achieve their
              academic goals. Start your journey today and transform your
              learning experience.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
