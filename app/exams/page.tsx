"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { Calendar, Trash2, Plus } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  examType: string;
  date: string;
  subject: string;
  totalMarks: number;
  status: "upcoming" | "completed" | "preparation";
}

export default function ExamsPage() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    examType: "",
    date: "",
    subject: "",
    totalMarks: "100",
  });

  /* ---------- GSAP entrance ---------- */
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.subject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      name: formData.name,
      examType: formData.examType || "Other",
      date: formData.date,
      subject: formData.subject,
      totalMarks: parseInt(formData.totalMarks),
      status: "preparation",
    };

    setExams((prev) => [newExam, ...prev]);
    setFormData({
      name: "",
      examType: "",
      date: "",
      subject: "",
      totalMarks: "100",
    });
    setShowForm(false);

    toast({
      title: "Success",
      description: "Exam added to your preparation list!",
    });
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
    toast({
      title: "Deleted",
      description: "Exam removed from your list",
    });
  };

  const statusBadge = (status: Exam["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Ambient background */}
      <MouseParallax strength={0.03} enableOnTouchDevice={false}>
        <div className="absolute -top-40 -left-40 h-112 w-112 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-112 w-112 rounded-full bg-purple-300/20 blur-3xl" />
      </MouseParallax>

      <main
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              My Exams
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage all your upcoming exams
            </p>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white gap-2 hover:scale-[1.02] transition"
          >
            <Plus size={18} />
            Add Exam
          </Button>
        </div>

        {/* Add Exam Form */}
        {showForm && (
          <Card className="mb-10 glass-card border-indigo-200/60">
            <CardHeader>
              <CardTitle>Add New Exam</CardTitle>
              <CardDescription>
                Add important exams you’re preparing for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
              >
                <Input
                  name="name"
                  placeholder="Exam Name (e.g. JEE Main 2024)"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select type</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="GATE">GATE</option>
                  <option value="Board Exam">Board Exam</option>
                  <option value="Other">Other</option>
                </select>

                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  name="subject"
                  placeholder="Subject (e.g. Physics)"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                />

                <div className="flex gap-3 md:col-span-2">
                  <Button type="submit" className="flex-1">
                    Add Exam
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.length ? (
            exams.map((exam) => (
              <Card
                key={exam.id}
                className="glass-card border-indigo-200/60 hover:shadow-xl transition"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{exam.name}</CardTitle>
                      <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExam(exam.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exam Type</span>
                      <span className="font-medium">{exam.examType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={14} />
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marks</span>
                      <span className="font-medium">{exam.totalMarks}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        exam.status,
                      )}`}
                    >
                      {exam.status === "preparation"
                        ? "In Preparation"
                        : exam.status.charAt(0).toUpperCase() +
                          exam.status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3 h-44 flex items-center justify-center glass-card">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 text-indigo-300" />
                <p className="text-muted-foreground">
                  No exams added yet. Click “Add Exam” to get started.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
