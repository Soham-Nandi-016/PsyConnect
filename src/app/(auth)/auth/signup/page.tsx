"use client";

export const dynamic = 'force-dynamic';

import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle, Loader2, GraduationCap, HandHeart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { register } from "@/app/actions/register";
import { signIn } from "next-auth/react";

// Separate component that uses useSearchParams (must be wrapped in Suspense)
function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Read ?role=STUDENT|SENIOR|COUNSELLOR from URL, default to STUDENT
    const [role, setRole] = useState<"STUDENT" | "COUNSELLOR">("STUDENT");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fill role from URL param when page loads
    useEffect(() => {
        const roleParam = searchParams?.get("role")?.toUpperCase();
        if (roleParam === "COUNSELLOR" || roleParam === "SENIOR") {
            setRole("COUNSELLOR");
        } else {
            setRole("STUDENT");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await register(name, email, password, role);

            if (!result.success) {
                setError(result.error || "Registration failed.");
                return;
            }

            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInResult?.error) {
                router.push("/auth/signin?registered=true");
            } else {
                // Redirect based on role
                const dest = role === "COUNSELLOR" ? "/dashboard/senior" : "/dashboard/student";
                router.push(dest);
                router.refresh();
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const isStudent = role === "STUDENT";

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
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold text-foreground mb-1">Join PsyConnect</h1>
                    <p className="text-foreground/70 font-medium text-sm">
                        Your safe space on campus. Free and confidential.
                    </p>
                </div>

                {/* Role Toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setRole("STUDENT")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${isStudent
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("COUNSELLOR")}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${!isStudent
                                ? "bg-white text-secondary shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <HandHeart className="w-4 h-4" />
                        Mentor / Senior
                    </button>
                </div>

                {/* Role description */}
                <motion.p
                    key={role}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-medium px-3 py-2 rounded-xl mb-5 text-center ${isStudent
                            ? "bg-primary/8 text-primary"
                            : "bg-secondary/8 text-secondary"
                        }`}
                >
                    {isStudent
                        ? "You'll get matched with peer mentors and access mental health resources."
                        : "You'll mentor students and support their wellbeing journey."}
                </motion.p>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-1" htmlFor="name">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                autoComplete="name"
                                className="w-full bg-white/50 border border-secondary/20 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Alex Johnson"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-1" htmlFor="email">
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
                        <label className="block text-sm font-semibold text-foreground/80 mb-1" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                className="w-full bg-white/50 border border-secondary/20 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {password.length > 0 && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs">
                                <CheckCircle className={`w-3.5 h-3.5 ${password.length >= 8 ? "text-green-500" : "text-foreground/30"}`} />
                                <span className={password.length >= 8 ? "text-green-600 font-medium" : "text-foreground/50"}>
                                    At least 8 characters
                                </span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed text-white ${isStudent ? "bg-primary" : "bg-secondary"
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Join as {isStudent ? "Student" : "Mentor"}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 text-center text-sm font-medium text-foreground/70">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-secondary font-bold hover:underline transition-all">
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="w-full max-w-md glass p-10 rounded-3xl animate-pulse" />}>
            <SignUpForm />
        </Suspense>
    );
}
