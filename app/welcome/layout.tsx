import React from "react";

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-950">
      <header className="py-6">
        <div className="container mx-auto px-4">
          <a href="/" className="inline-flex items-center gap-3">
            <img src="/icon.svg" alt="AI Study Buddy" className="h-8 w-8" />
            <span className="text-lg font-semibold">AI Study Buddy</span>
          </a>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
