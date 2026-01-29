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

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
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
              <p className="text-gray-600 mt-2">
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
                            : "text-gray-700 hover:bg-gray-100"
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
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="border-purple-200"
                      />
                      <p className="text-xs text-gray-600">
                        Your target number of study hours per day
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                        className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Theme Preference
                      </h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setTheme("light")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                            resolvedTheme === "light"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          Light
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                            resolvedTheme === "dark"
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
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
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Notification Reminders
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Sound Effects
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Daily Reminder
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>
                    </div>

                    {settings.dailyReminder && (
                      <div className="space-y-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <label className="block text-sm font-medium text-gray-700">
                          Reminder Time
                        </label>
                        <Input
                          type="time"
                          value={settings.reminderTime}
                          onChange={(e) =>
                            handleSettingChange("reminderTime", e.target.value)
                          }
                          className="border-blue-200"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Focus Mode
                          </p>
                          <p className="text-sm text-gray-600">
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
                        className="w-5 h-5 rounded"
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
                      <label className="block text-sm font-medium text-gray-700">
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) =>
                          handleSettingChange("fontSize", e.target.value)
                        }
                        className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Compact View
                          </p>
                          <p className="text-sm text-gray-600">
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
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Animations & Effects
                          </p>
                          <p className="text-sm text-gray-600">
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
                        className="w-5 h-5 rounded"
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
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Data Collection
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Analytics Tracking
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Email Updates
                            </p>
                            <p className="text-sm text-gray-600">
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
                          className="w-5 h-5 rounded"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">
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
