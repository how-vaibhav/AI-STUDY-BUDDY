'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { MouseParallax } from 'react-just-parallax';

import { DashboardNav } from '@/components/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import {
	BookOpen,
	Zap,
	Clock,
	Target,
	Sparkles,
	Calendar,
	AlertCircle,
	CheckCircle,
	Loader2,
} from 'lucide-react';

/* ---------- motion presets (kept lightweight) ---------- */

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
		transition: { duration: 0.45, ease: 'easeOut' },
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface DayRoutine {
	dayNumber: number;
	title: string;
	content: string;
}

interface StudyPlanSubsections {
	generalInfo: string;
	dailyRoutines: DayRoutine[];
}

export default function StudyPlannerPage() {
	const { toast } = useToast();
	const pageRef = useRef<HTMLDivElement>(null);

	const [formData, setFormData] = useState({
		subject: '',
		exam: 'JEE Advanced',
		numDays: '30',
		topics: '',
		difficulty: '4-6 hours',
	});

	const [loading, setLoading] = useState(false);
	const [plan, setPlan] = useState<StudyPlanSubsections | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [title, setTitle] = useState('');

	/* ---------- GSAP page entrance ---------- */
	useEffect(() => {
		gsap.fromTo(
			pageRef.current,
			{ opacity: 0, y: 26 },
			{ opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
		);
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const savePlan = async () => {
		try {
			setSaving(true);

			const payload = {
				...plan,
				title: title,
			};

			const response = await fetch('/api/save-study-plan', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || 'Internal Server Error');
			}

			toast({ title: 'Saved', description: 'Plan was saved successfully.' });
			setPlan(null);
		} catch (error) {
			const msg = error instanceof Error ? error.message : 'An error occurred!';
			setError(msg);
			toast({ title: 'Error', description: msg, variant: 'destructive' });
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.subject.trim()) {
			toast({
				title: 'Error',
				description: 'Please enter a subject',
				variant: 'destructive',
			});
			return;
		}

		const days = parseInt(formData.numDays);
		if (isNaN(days) || days < 1 || days > 365) {
			toast({
				title: 'Error',
				description: 'Please enter days between 1 and 365',
				variant: 'destructive',
			});
			return;
		}

		setLoading(true);
		setError(null);
		setPlan(null);

		try {
			const response = await fetch('/api/generate-study-plan', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok || !data.success || !data.studyPlanSubsections) {
				throw new Error(data.error || 'Failed to generate study plan');
			}

			setPlan(data.studyPlanSubsections);

			setTitle(
				`${formData.subject} Routine for ${formData.exam} in ${formData.numDays} days.`,
			);

			toast({
				title: 'Success',
				description: 'Study plan generated successfully',
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'An error occurred';
			setError(msg);
			toast({ title: 'Error', description: msg, variant: 'destructive' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
			<DashboardNav />

			{/* Parallax ambient blobs */}
			<MouseParallax strength={0.03} enableOnTouchDevice={false}>
				<div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-purple-300/20 blur-3xl" />
				<div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-blue-300/20 blur-3xl" />
			</MouseParallax>

			<motion.main
				ref={pageRef}
				className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
			>
				{/* Header */}
				<div className="mb-14">
					<div className="flex items-center gap-4 mb-4">
						<div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
							<Calendar className="w-7 h-7 text-white" />
						</div>
						<h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
							Study Plan Generator
						</h1>
					</div>
					<p className="text-lg text-gray-600 max-w-3xl">
						Create realistic, day-wise study plans with focused goals, revision
						buffers, and exam-oriented strategies.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Form */}
					<motion.div
						className="lg:col-span-1"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div variants={itemVariants}>
							<Card className="sticky top-24 glass-card border-purple-200/60">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Target className="w-5 h-5 text-purple-600" />
										Plan Details
									</CardTitle>
									<CardDescription>
										Personalize your study strategy
									</CardDescription>
								</CardHeader>

								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-4">
										<Input
											name="subject"
											value={formData.subject}
											onChange={handleInputChange}
											placeholder="Subject (e.g. Physics)"
											required
										/>

										<select
											name="exam"
											value={formData.exam}
											onChange={handleInputChange}
											className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
										>
											{[
												'JEE Advanced',
												'JEE Mains',
												'NEET',
												'GATE',
												'Board Exam',
												'UPSC',
												'CAT',
											].map((e) => (
												<option key={e} value={e}>
													{e}
												</option>
											))}
										</select>

										<Input
											type="number"
											name="numDays"
											value={formData.numDays}
											onChange={handleInputChange}
											min={1}
											max={365}
											placeholder="Days available"
											required
										/>

										<Input
											name="topics"
											value={formData.topics}
											onChange={handleInputChange}
											placeholder="Topics (e.g. For Physics- occilation, Simple Harmonic Motion, Dopler's Principle, etc.)"
											required
										/>

										<select
											name="difficulty"
											value={formData.difficulty}
											onChange={handleInputChange}
											className="w-full rounded-lg border border-purple-200 bg-white/70 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
										>
											<option value="3-4 hours">Easy (3–4 hrs/day)</option>
											<option value="4-6 hours">Medium (4–6 hrs/day)</option>
											<option value="6-8 hours">Hard (6–8 hrs/day)</option>
										</select>

										<Button
											type="submit"
											disabled={loading}
											className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
										>
											{loading ? (
												<span className="flex items-center gap-2">
													<Loader2 className="w-4 h-4 animate-spin" />
													Generating…
												</span>
											) : (
												<span className="flex items-center gap-2">
													<Sparkles className="w-4 h-4" />
													Generate Plan
												</span>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>

					{/* Results */}
					<motion.div
						className="lg:col-span-2"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{error && (
							<motion.div variants={itemVariants}>
								<Card className="border-red-200 bg-red-50">
									<CardContent className="pt-6 flex gap-3">
										<AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
										<div>
											<p className="font-semibold text-red-900">Error</p>
											<p className="text-sm text-red-800">{error}</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{plan && (
							<motion.div variants={itemVariants}>
								<Card className="glass-card border-purple-200/60">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<CheckCircle className="w-5 h-5 text-green-600" />
											Your Personalized Study Plan
										</CardTitle>
										<CardDescription>
											{formData.exam} • {formData.subject} • {formData.numDays}{' '}
											days
										</CardDescription>
									</CardHeader>

									{plan.dailyRoutines.map((day, i) => (
										<Card key={i} className="m-2">
											<CardTitle className="flex items-center gap-2 m-2">
												Day {i + 1}
											</CardTitle>
											<CardContent>
												<div className="rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-blue-50 p-6 prose prose-sm max-w-none">
													<ReactMarkdown>{day}</ReactMarkdown>
												</div>
											</CardContent>
										</Card>
									))}

									<CardContent>
										<div className="rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-blue-50 p-6 prose prose-sm max-w-none">
											<ReactMarkdown>{plan.generalInfo}</ReactMarkdown>
										</div>
										<Button
											type="submit"
											disabled={saving}
											onClick={savePlan}
											className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-[1.02] transition"
										>
											{saving ? (
												<span className="flex items-center gap-2">
													<Loader2 className="w-4 h-4 animate-spin" />
													Saving...
												</span>
											) : (
												<span className="flex items-center gap-2">
													<Sparkles className="w-4 h-4" />
													Save Plan
												</span>
											)}
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{!plan && !error && (
							<motion.div variants={itemVariants}>
								<Card className="border-dashed border-purple-300 bg-purple-50/60">
									<CardContent className="py-16 text-center">
										<BookOpen className="w-10 h-10 mx-auto mb-4 text-purple-500" />
										<p className="font-medium text-gray-700">
											Fill the form to generate your plan
										</p>
										<p className="text-sm text-gray-600 max-w-sm mx-auto mt-2">
											You’ll get a realistic, revision-friendly schedule
											tailored to your exam and difficulty level.
										</p>
									</CardContent>
								</Card>
							</motion.div>
						)}
					</motion.div>
				</div>

				{/* Features */}
				<motion.div
					className="mt-20"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<h2 className="text-3xl font-bold mb-10">What You’ll Get</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								icon: Calendar,
								t: 'Day-wise Breakdown',
								d: 'Clear daily tasks',
							},
							{ icon: Target, t: 'Focused Goals', d: 'Priority-driven topics' },
							{ icon: Zap, t: 'Expert Tips', d: 'Exam-oriented strategy' },
							{ icon: Clock, t: 'Time Management', d: 'Realistic schedules' },
						].map((f, i) => (
							<motion.div key={i} variants={cardVariants}>
								<Card className="glass-card border-purple-200/60 hover:shadow-lg transition">
									<CardContent className="pt-6">
										<f.icon className="w-8 h-8 text-purple-600 mb-3" />
										<h3 className="font-semibold mb-1">{f.t}</h3>
										<p className="text-sm text-gray-600">{f.d}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			</motion.main>
		</div>
	);
}
