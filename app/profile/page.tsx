"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
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
import {
  User,
  Mail,
  BookOpen,
  Target,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle,
  Camera,
  Upload,
} from "lucide-react";

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

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    targetExam: "JEE Advanced",
    currentClass: "12",
    strengths: "",
    weaknesses: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.fullName.trim() || !profileData.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save profile data to localStorage
      const profileToSave = {
        ...profileData,
        photoUrl: photoPreview, // Store base64 or URL
      };
      localStorage.setItem("userProfile", JSON.stringify(profileToSave));

      // In production, you would upload the photo to Supabase:
      // const bucket = supabase.storage.from('profile-photos');
      // const { data } = await bucket.upload(`${user.id}/profile.jpg`, photoFile);

      setIsComplete(true);

      toast({
        title: "Success",
        description: "Profile completed successfully! 🎉",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnterAsGuest = () => {
    localStorage.setItem("isGuest", "true");
    toast({
      title: "Welcome Guest",
      description: "You can upgrade your profile anytime",
    });
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <motion.main
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!isComplete ? (
          <div>
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 shadow-xl">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent mb-4">
                Create Your Profile
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Help us personalize your study experience by sharing a few
                details about yourself
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <motion.div
                className="lg:col-span-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-purple-200/60 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        Profile Photo
                      </CardTitle>
                      <CardDescription>
                        Upload a profile picture (optional)
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-col items-center gap-4">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-24 h-24 rounded-full bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-purple-300 dark:border-purple-500/50"
                        >
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            {photoPreview ? "Change Photo" : "Upload Photo"}
                          </Button>
                          {photoPreview && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ✓ Photo selected
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-purple-200/60 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        Your Information
                      </CardTitle>
                      <CardDescription>
                        Provide details to create a personalized study plan
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <form
                        onSubmit={handleCompleteProfile}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <Input
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="border-purple-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                            className="border-purple-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Target Exam
                          </label>
                          <select
                            name="targetExam"
                            value={profileData.targetExam}
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
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Current Class
                          </label>
                          <select
                            name="currentClass"
                            value={profileData.currentClass}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                          >
                            {["9", "10", "11", "12", "Graduated"].map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Your Strengths
                          </label>
                          <textarea
                            name="strengths"
                            value={profileData.strengths}
                            onChange={handleInputChange}
                            placeholder="E.g., Mathematics, Problem Solving"
                            rows={3}
                            className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Areas to Improve
                          </label>
                          <textarea
                            name="weaknesses"
                            value={profileData.weaknesses}
                            onChange={handleInputChange}
                            placeholder="E.g., Chemistry Reactions, Reading Comprehension"
                            rows={3}
                            className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition h-10 text-base"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Complete Profile
                            </span>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Benefits Card */}
              <motion.div
                className="lg:col-span-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-purple-200/60 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Why Complete Your Profile?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <Target className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Personalized Plans
                          </p>
                          <p className="text-xs text-gray-600">
                            Study plans tailored to your level
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Better Tracking
                          </p>
                          <p className="text-xs text-gray-600">
                            Track your progress over time
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Smart Suggestions
                          </p>
                          <p className="text-xs text-gray-600">
                            AI-powered recommendations
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleEnterAsGuest}
                        variant="outline"
                        className="w-full mt-6"
                      >
                        Enter as Guest Instead
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-green-100">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Profile Created Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
