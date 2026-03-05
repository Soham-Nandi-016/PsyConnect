"use client";

import { MessageSquare, BookOpen, Users, LayoutDashboard, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    // Derive role-correct dashboard URL from JWT session
    const role = (session?.user as { role?: string } | undefined)?.role;
    const dashboardHref =
        role === "COUNSELLOR" || role === "ADMIN"
            ? "/dashboard/senior"
            : "/dashboard/student";

    const links = [
        { name: "Home", href: "/" },
        { name: "Peer Forum", href: "/forum", icon: MessageSquare },
        { name: "Resource Hub", href: "/resources", icon: BookOpen },
        { name: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    ];

    return (
        <>
            <nav className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-secondary/20 shadow-sm relative z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="bg-primary/20 p-2 rounded-lg"
                        >
                            <Users className="w-6 h-6 text-primary font-bold group-hover:text-primary transition-colors" />
                        </motion.div>
                        <span className="text-xl font-bold text-foreground tracking-tight">PsyConnect</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6 font-medium text-foreground/80">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`transition-colors flex items-center gap-1.5 hover:text-primary relative ${pathname === link.href ? "text-primary font-semibold" : ""
                                    }`}
                            >
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/auth/signin">
                            <button className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">Sign In</button>
                        </Link>
                        <Link href="/community">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-shadow shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                Join Community <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground p-2 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-accent shadow-lg z-40"
                    >
                        <div className="flex flex-col px-4 py-6 gap-4">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-lg font-medium text-foreground/80 hover:text-primary transition-colors p-2 rounded-md hover:bg-accent/50"
                                    >
                                        {Icon && <Icon className="w-5 h-5" />}
                                        {link.name}
                                    </Link>
                                )
                            })}
                            <div className="border-t border-accent mt-2 pt-4 flex flex-col gap-3">
                                <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full bg-accent/30 text-foreground py-3 rounded-xl font-bold border border-accent">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/community" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-md">
                                        Join Community
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
