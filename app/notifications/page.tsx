"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bell,
  CheckCircle,
  Trophy,
  Zap,
  Info,
  Trash2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface Notification {
  id: string;
  type: "quiz" | "achievement" | "reminder" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/send-notification");
      const data = await response.json();
      setNotifications(
        data.notifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })),
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/send-notification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "achievement":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "reminder":
        return <Zap className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "achievement":
        return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
      case "reminder":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || !n.read,
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-purple-600 to-blue-600 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold dark:text-white">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "All caught up!"}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-linear-to-r from-purple-600 to-blue-600"
                  : ""
              }
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              className={
                filter === "unread"
                  ? "bg-linear-to-r from-purple-600 to-blue-600"
                  : ""
              }
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="text-center py-12 dark:bg-slate-800 dark:border-slate-700">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, idx) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                data-animate
              >
                <Card
                  className={`border-l-4 p-6 dark:bg-slate-800 dark:border-slate-700 ${getNotificationColor(
                    notification.type,
                  )} ${!notification.read ? "ring-2 ring-purple-400/50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground dark:text-gray-300 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="hover:bg-white/20 dark:hover:bg-slate-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="hover:bg-red-100/50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
