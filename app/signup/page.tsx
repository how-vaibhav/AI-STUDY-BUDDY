'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function SignupPage() {
	const router = useRouter();
	const { toast } = useToast();

	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	/* ---------- Ambient background motion (subtle & premium) ---------- */
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to('.blob-1', {
				x: 40,
				y: 60,
				duration: 10,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
			gsap.to('.blob-2', {
				x: -50,
				y: -40,
				duration: 12,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
			gsap.to('.blob-3', {
				x: 30,
				y: -50,
				duration: 11,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	/* ---------- Card entrance ---------- */
	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{ opacity: 0, y: 32, scale: 0.97 },
			{ opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
		);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			toast({
				title: 'Missing information',
				description: 'Please fill in all required fields',
				variant: 'destructive',
			});
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			toast({
				title: 'Password mismatch',
				description: 'Passwords do not match',
				variant: 'destructive',
			});
			return;
		}

		if (formData.password.length < 6) {
			toast({
				title: 'Weak password',
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
					title: 'Signup failed',
					description: result.error,
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Welcome!',
					description: 'Your account has been created successfully',
				});

				gsap.to(cardRef.current, {
					opacity: 0,
					y: -40,
					duration: 0.45,
					ease: 'power2.in',
					onComplete: () => router.push('/dashboard'),
				});
			}
		} catch {
			toast({
				title: 'Unexpected error',
				description: 'Please try again later',
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
				className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4"
			>
				{/* Background blobs */}
				<div className="absolute inset-0 -z-10 overflow-hidden">
					<div className="blob-1 absolute top-24 left-12 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
					<div className="blob-2 absolute bottom-24 right-12 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
					<div className="blob-3 absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
				</div>

				{/* Card */}
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="w-full flex justify-center"
				>
					<Card
						ref={cardRef}
						className="
              w-full max-w-sm
              border border-border/60
              bg-white/80 dark:bg-card/80
              backdrop-blur-xl
              shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]
            "
					>
						<CardHeader className="space-y-2 text-center pt-8">
							<CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
								Create your account
							</CardTitle>

							<CardDescription className="text-sm text-muted-foreground">
								Start learning smarter with AI Study Buddy
							</CardDescription>
						</CardHeader>

						<CardContent className="pt-4 pb-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								{[
									{
										id: 'email',
										label: 'Email address',
										type: 'email',
										placeholder: 'you@email.com',
									},
									{
										id: 'password',
										label: 'Password',
										type: 'password',
										placeholder: 'Minimum 6 characters',
									},
									{
										id: 'confirmPassword',
										label: 'Confirm password',
										type: 'password',
										placeholder: 'Re-enter password',
									},
								].map((field) => (
									<div key={field.id} className="space-y-1.5">
										<label htmlFor={field.id} className="text-sm font-medium">
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
											className="h-10"
										/>
									</div>
								))}

								<Button
									type="submit"
									disabled={loading}
									className="w-full h-10 text-sm font-semibold transition-all hover:scale-[1.02]"
								>
									{loading ? 'Creating account…' : 'Create account'}
								</Button>
							</form>

							<div className="mt-6 text-center text-sm">
								<span className="text-muted-foreground">
									Already have an account?
								</span>{' '}
								<Link
									href="/login"
									className="font-medium text-primary hover:underline"
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
