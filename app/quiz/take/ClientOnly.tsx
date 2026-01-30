"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Button } from "@/components/ui/button";

const QuizClient = dynamic(() => import("./QuizClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  ),
});

export default function ClientOnly() {
  return <QuizClient />;
}
