"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import { Brain } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the user hasn't seen onboarding yet, show it first.
    const hasSeen =
      typeof window !== "undefined" &&
      localStorage.getItem("hasSeenOnboarding");
    if (!hasSeen) {
      router.replace("/welcome");
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50">
        {/* Ambient background blobs */}
        <div className="absolute -top-40 -left-40 h-104 w-104 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-104 w-104 rounded-full bg-purple-300/20 blur-3xl" />

        {/* Loader Card */}
        <div className="relative z-10 glass-card px-10 py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
            AI Study Buddy for Bharat
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Preparing your personalized learning space…
          </p>

          {/* Loading dots */}
          <div className="mt-4 flex justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.2s]" />
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.1s]" />
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
