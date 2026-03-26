"use client";

export const dynamic = 'force-dynamic';

import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Handle redirect manually for better error UX
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                router.push(callbackUrl);
                router.refresh(); // Refresh server components to reflect new session
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Decorative blobs */}
            <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 sm:p-10 rounded-3xl relative z-10 w-full border border-white/40 shadow-xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-foreground mb-2">Welcome Back</h1>
                    <p className="text-foreground/70 font-medium text-sm">
                        Sign in to access your dashboard and resources.
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            className="block text-sm font-semibold text-foreground/80 mb-1"
                            htmlFor="email"
                        >
                            University Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                autoComplete="email"
                                className="w-full bg-white/50 border border-secondary/20 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="student@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label
                                className="block text-sm font-semibold text-foreground/80"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Link
                                href="#"
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                className="w-full bg-white/50 border border-secondary/20 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-foreground/70">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-secondary font-bold hover:underline transition-all"
                    >
                        Join the community
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

// useSearchParams requires Suspense in Next.js App Router
export default function SignInPage({ searchParams }: any) {
    return (
        <Suspense fallback={<div className="w-full max-w-md h-96 glass rounded-3xl animate-pulse" />}>
            <SignInForm />
        </Suspense>
    );
}
