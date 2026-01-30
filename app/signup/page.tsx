'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { signUp } from '@/lib/auth';
import { AuthNav } from '@/components/auth-nav';

import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export default function SignupPage() {
	const router = useRouter();
	const { toast } = useToast();
	const cardRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	// Advanced background animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Floating blobs animation
			gsap.to('.blob-1', {
				x: 30,
				y: 50,
				duration: 6,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
			gsap.to('.blob-2', {
				x: -40,
				y: -60,
				duration: 8,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
			gsap.to('.blob-3', {
				x: 50,
				y: -30,
				duration: 7,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
			// Rotating gradient
			gsap.to('.gradient-orb', {
				rotation: 360,
				duration: 20,
				repeat: -1,
				ease: 'none',
			});
		}, containerRef);
		return () => ctx.revert();
	}, []);

	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{ opacity: 0, y: 40, scale: 0.96 },
			{ opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
		);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.email || !formData.password) {
			toast({
				title: 'Error',
				description: 'Please fill in all fields',
				variant: 'destructive',
			});
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			toast({
				title: 'Error',
				description: 'Passwords do not match',
				variant: 'destructive',
			});
			return;
		}

		if (formData.password.length < 6) {
			toast({
				title: 'Error',
				description: 'Password must be at least 6 characters',
				variant: 'destructive',
			});
			return;
		}

		setLoading(true);

		try {
			const result = await signUp(formData.email, formData.password);
			if (result.error) {
				toast({
					title: 'Error',
					description: result.error,
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Success',
					description: 'Account created successfully!',
				});
				// Animate to dashboard
				gsap.to('.signup-card', {
					opacity: 0,
					y: -50,
					duration: 0.5,
					ease: 'power2.in',
					onComplete: () => router.push('/dashboard'),
				});
			}
		} catch {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<AuthNav />
			<div
				ref={containerRef}
				className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 pt-20 dark:from-slate-950 dark:via-purple-900/20 dark:to-slate-950"
			>
				{/* Animated background blobs */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="blob-1 absolute top-20 left-10 w-72 h-72 bg-purple-600/20 dark:bg-purple-500/15 rounded-full blur-3xl" />
					<div className="blob-2 absolute bottom-20 right-10 w-80 h-80 bg-blue-600/15 dark:bg-blue-500/10 rounded-full blur-3xl" />
					<div className="blob-3 absolute top-1/2 left-1/3 w-96 h-96 bg-indigo-600/15 dark:bg-indigo-500/10 rounded-full blur-3xl" />
					<div className="gradient-orb absolute inset-0 opacity-10 dark:opacity-5 bg-gradient-conic from-purple-600 via-blue-600 to-purple-600" />
				</div>

				{/* Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="signup-card relative z-10"
				>
					<Card
						ref={cardRef}
						className="w-full max-w-md shadow-2xl border-white/20 dark:border-white/10 bg-white dark:bg-card/80 backdrop-blur-xl"
					>
						<CardHeader className="space-y-3 text-center">
							<CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
								Create your account
							</CardTitle>

							<CardDescription className="text-muted-foreground">
								Join AI Study Buddy and start your learning journey
							</CardDescription>
						</CardHeader>

						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								{[
									{
										id: 'fullName',
										label: 'Full Name',
										type: 'text',
										placeholder: 'Your name',
									},
									{
										id: 'email',
										label: 'Email Address',
										type: 'email',
										placeholder: 'you@email.com',
									},
									{
										id: 'password',
										label: 'Password',
										type: 'password',
										placeholder: 'At least 6 characters',
									},
									{
										id: 'confirmPassword',
										label: 'Confirm Password',
										type: 'password',
										placeholder: 'Confirm password',
									},
								].map((field) => (
									<div key={field.id} className="space-y-1.5">
										<label
											htmlFor={field.id}
											className="text-sm font-medium text-foreground"
										>
											{field.label}
										</label>
										<Input
											id={field.id}
											name={field.id}
											type={field.type}
											placeholder={field.placeholder}
											value={(formData as any)[field.id]}
											onChange={handleInputChange}
											required
										/>
									</div>
								))}

								<Button
									type="submit"
									className="w-full transition-all duration-300 hover:scale-[1.02]"
									disabled={loading}
								>
									{loading ? 'Creating account…' : 'Create Account'}
								</Button>
							</form>

							<div className="mt-6 text-center text-sm">
								<span className="text-muted-foreground">
									Already have an account?
								</span>{' '}
								<Link
									href="/login"
									className="font-medium text-primary hover:underline transition"
								>
									Sign in
								</Link>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</>
	);
}
