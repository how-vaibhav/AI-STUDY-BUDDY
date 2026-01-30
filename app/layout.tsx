import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AppFooter } from '@/components/app-footer';
import ConditionalNav from '@/components/conditional-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const geist = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
	display: 'swap',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'AI Study Buddy for Bharat – Smart Study Planning for Indian Students',
	description:
		'AI-powered study planner, doubt solver, and notes summarizer for Indian college and competitive exam students.',
	icons: {
		icon: [
			{ url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
			{ url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
			{ url: '/icon.svg', type: 'image/svg+xml' },
		],
		apple: '/apple-icon.png',
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${geist.variable} ${geistMono.variable}`}
			suppressHydrationWarning
		>
			<body
				className="
          min-h-screen
          flex flex-col
          font-sans
          antialiased
          text-foreground
          bg-linear-to-br
          from-background
          via-muted/30
          to-background
          selection:bg-primary/20
          selection:text-foreground
          dark:from-slate-950
          dark:via-slate-900
          dark:to-slate-950
        "
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{/* Global navbar visible on all pages (hidden on /welcome) */}
					<ConditionalNav />
					{/* Main app content */}
					<main className="flex-1">{children}</main>

					{/* Global footer (persistent across all routes) */}
					<AppFooter />
					<Toaster />
				</ThemeProvider>

				{/* Analytics */}
				<Analytics />
			</body>
		</html>
	);
}
