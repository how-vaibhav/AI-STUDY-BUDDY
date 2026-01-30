"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  Settings,
  Moon,
  Sun,
  Bell,
  Lock,
  Zap,
  Volume2,
  Clock,
  Eye,
  CheckCircle,
  LogOut,
  Download,
  Trash2,
  Save,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saveLoading, setSaveLoading] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    appName: "AI Study Buddy",
    dailyGoalHours: "5",
    preferredLanguage: "english",

    // Study Preferences
    notificationReminders: true,
    soundEnabled: true,
    dailyReminder: true,
    reminderTime: "09:00",
    focusMode: false,

    // Display Preferences
    fontSize: "medium",
    compactView: false,
    animationsEnabled: true,

    // Privacy & Data
    dataCollection: true,
    analyticsTracking: false,
    emailUpdates: true,
  });

  useEffect(() => {
    setMounted(true);
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );

    // Focus container without scrolling to prevent Next's auto-scroll behavior
    try {
      containerRef.current?.focus?.({ preventScroll: true } as FocusOptions);
    } catch (e) {
      // older browsers may not support preventScroll — still fine
      containerRef.current?.focus?.();
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      // Apply settings immediately
      applyFontSize(parsed.fontSize);
      applyCompactView(parsed.compactView);
      applyAnimations(parsed.animationsEnabled);
    }
  }, []);

  // Apply font size setting to document root
  const applyFontSize = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: "14px",
      medium: "16px",
      large: "18px",
      xlarge: "20px",
    };
    const fontSize = sizeMap[size] || "16px";
    document.documentElement.style.fontSize = fontSize;
    // Also set as CSS variable for easier access
    document.documentElement.style.setProperty("--font-size-base", fontSize);
  };

  // Apply compact view by setting data attribute
  const applyCompactView = (isCompact: boolean) => {
    if (isCompact) {
      document.documentElement.setAttribute("data-compact", "true");
    } else {
      document.documentElement.removeAttribute("data-compact");
    }
  };

  // Apply animations setting by setting data attribute
  const applyAnimations = (enabled: boolean) => {
    if (!enabled) {
      document.documentElement.setAttribute("data-animations-disabled", "true");
    } else {
      document.documentElement.removeAttribute("data-animations-disabled");
    }
  };

  // Watch for changes to fontSize and apply them
  useEffect(() => {
    if (mounted && settings.fontSize) {
      applyFontSize(settings.fontSize);
    }
  }, [settings.fontSize, mounted]);

  // Watch for changes to compactView and apply them
  useEffect(() => {
    if (mounted) {
      applyCompactView(settings.compactView);
    }
  }, [settings.compactView, mounted]);

  // Watch for changes to animationsEnabled and apply them
  useEffect(() => {
    if (mounted) {
      applyAnimations(settings.animationsEnabled);
    }
  }, [settings.animationsEnabled, mounted]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
      // Apply all settings immediately
      applyFontSize(settings.fontSize);
      applyCompactView(settings.compactView);
      applyAnimations(settings.animationsEnabled);
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will clear all your saved data.")) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All your data has been cleared",
      });
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      // Add your logout logic here
      localStorage.removeItem("userProfile");
      localStorage.removeItem("isGuest");
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (!mounted) return null;

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "study", label: "Study", icon: Zap },
    { id: "display", label: "Display", icon: Eye },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <motion.div
        ref={containerRef}
        tabIndex={-1}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Customize your experience and preferences
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="glass-card border-purple-200/60 sticky top-24">
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <Card className="glass-card border-purple-200/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure basic application settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Daily Study Goal (hours)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        value={settings.dailyGoalHours}
                        onChange={(e) =>
                          handleSettingChange("dailyGoalHours", e.target.value)
                        }
                        className="border-slate-200 dark:border-slate-700"
                      />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Your target number of study hours per day
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Preferred Language
                      </label>
                      <select
                        value={settings.preferredLanguage}
                        onChange={(e) =>
                          handleSettingChange(
                            "preferredLanguage",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm shadow-sm dark:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 hover:border-slate-300 dark:hover:border-slate-600"
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Theme Preference
                      </h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setTheme("light")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                            resolvedTheme === "light"
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          Light
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                            resolvedTheme === "dark"
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          Dark
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Study Preferences */}
            {activeTab === "study" && (
              <div className="space-y-6">
                <Card className="glass-card border-purple-200/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Study Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage your study and learning settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Notification Reminders
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Get notified about your study schedule
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notificationReminders}
                          onChange={(e) =>
                            handleSettingChange(
                              "notificationReminders",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Sound Effects
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Enable notification sounds
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.soundEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "soundEnabled",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Daily Reminder
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Remind me to study at a specific time
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.dailyReminder}
                          onChange={(e) =>
                            handleSettingChange(
                              "dailyReminder",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    {settings.dailyReminder && (
                      <div className="space-y-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Reminder Time
                        </label>
                        <Input
                          type="time"
                          value={settings.reminderTime}
                          onChange={(e) =>
                            handleSettingChange("reminderTime", e.target.value)
                          }
                          className="border-blue-200 dark:border-blue-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Focus Mode
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Minimize distractions while studying
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.focusMode}
                        onChange={(e) =>
                          handleSettingChange("focusMode", e.target.checked)
                        }
                        className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === "display" && (
              <div className="space-y-6">
                <Card className="glass-card border-purple-200/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-600" />
                      Display Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize how content is displayed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) =>
                          handleSettingChange("fontSize", e.target.value)
                        }
                        className="w-full rounded-lg border border-purple-200 bg-white/70 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Compact View
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Show more content in less space
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactView}
                        onChange={(e) =>
                          handleSettingChange("compactView", e.target.checked)
                        }
                        className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Animations & Effects
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enable smooth animations
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.animationsEnabled}
                        onChange={(e) =>
                          handleSettingChange(
                            "animationsEnabled",
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy & Data */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card className="glass-card border-purple-200/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-purple-600" />
                      Privacy & Data
                    </CardTitle>
                    <CardDescription>
                      Control your data and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Data Collection
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Allow usage data collection for improvements
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.dataCollection}
                          onChange={(e) =>
                            handleSettingChange(
                              "dataCollection",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Analytics Tracking
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Track my learning analytics
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.analyticsTracking}
                          onChange={(e) =>
                            handleSettingChange(
                              "analyticsTracking",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Email Updates
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Receive email newsletters and updates
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.emailUpdates}
                          onChange={(e) =>
                            handleSettingChange(
                              "emailUpdates",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 rounded accent-purple-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Data Management
                      </h3>

                      <Button
                        onClick={handleClearData}
                        variant="outline"
                        className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSaveSettings}
                disabled={saveLoading}
                className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveLoading ? "Saving..." : "Save Settings"}
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
