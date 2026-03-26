"use client";

import { MessageSquare, BookOpen, Users, LayoutDashboard, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    
    // Configurable Auth Modal State
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title?: string, description?: React.ReactNode }>({
        isOpen: false,
    });

    const role = (session?.user as { role?: string } | undefined)?.role;
    const dashboardHref =
        role === "COUNSELLOR" || role === "ADMIN"
            ? "/dashboard/senior"
            : "/dashboard/student";

    const links = [
        { name: "Home", href: "/", isProtected: false },
        { name: "Peer Forum", href: "/forum", icon: MessageSquare, isProtected: true },
        { name: "Resource Hub", href: "/resources", icon: BookOpen, isProtected: true },
        { name: "Dashboard", href: dashboardHref, icon: LayoutDashboard, isProtected: true },
    ];

    const closeAuthModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleNavClick = (e: React.MouseEvent, href: string, isProtected: boolean) => {
        if (isProtected && !session) {
            e.preventDefault();
            setModalConfig({
                isOpen: true,
                title: "Login Required 🔒",
                description: (
                    <>
                        To protect our students&apos; privacy, a verified login is required for this section.{" "}
                        <Link href="/community" onClick={closeAuthModal} className="text-[#6b8f66] font-semibold hover:underline">
                            Visit our Join Community page
                        </Link>{" "}
                        to learn more about how we keep you safe.
                    </>
                )
            });
            setIsMobileMenuOpen(false);
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <AuthModal 
               isOpen={modalConfig.isOpen} 
               onClose={closeAuthModal} 
               title={modalConfig.title}
               description={modalConfig.description}
            />

            <nav className="w-full bg-white/60 backdrop-blur-xl sticky top-0 z-[100] border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="bg-gradient-to-tr from-primary/20 to-secondary/20 p-2 rounded-2xl shadow-sm border border-white/50"
                        >
                            <Users className="w-5 h-5 text-primary font-bold" />
                        </motion.div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            Psy<span className="text-primary">Connect</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6 font-medium text-foreground/70">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href, link.isProtected!)}
                                className={`transition-all flex items-center gap-1.5 hover:text-primary relative px-1 py-0.5 ${pathname === link.href ? "text-primary font-semibold" : ""
                                    }`}
                            >
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                                    />
                                )}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {!session ? (
                            <Link href="/auth/signin">
                                <button className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors px-3 py-2 rounded-full hover:bg-primary/5">
                                    Sign In
                                </button>
                            </Link>
                        ) : null}
                        {/* ONLY links strictly to community landing page without triggering AuthGuard */}
                        <Link href={session ? dashboardHref : "/community"}>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-gradient-to-r from-primary to-[#6b8f66] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_4px_14px_rgba(138,154,134,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(138,154,134,0.45)] flex items-center gap-2"
                            >
                                {session ? "My Dashboard" : "Join Community"} <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-foreground p-2 rounded-xl hover:bg-primary/10 focus:outline-none transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden fixed inset-x-0 top-16 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.08)] z-40"
                    >
                        <div className="flex flex-col px-4 py-6 gap-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href, link.isProtected!)}
                                        className={`flex items-center gap-3 text-base font-medium p-3 rounded-2xl transition-all ${pathname === link.href
                                                ? "text-primary bg-primary/10 font-semibold"
                                                : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                                            }`}
                                    >
                                        {Icon && <Icon className="w-5 h-5" />}
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <div className="border-t border-white/60 mt-3 pt-4 flex flex-col gap-3">
                                {!session ? (
                                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full bg-white/70 text-foreground py-3 rounded-2xl font-semibold border border-white/50 hover:bg-white transition-all shadow-sm">
                                            Sign In
                                        </button>
                                    </Link>
                                ) : null}
                                <Link href={session ? dashboardHref : "/community"} onClick={() => setIsMobileMenuOpen(false)}>
                                    <button 
                                        className="w-full bg-gradient-to-r from-primary to-[#6b8f66] text-white py-3 rounded-2xl font-bold shadow-[0_4px_14px_rgba(138,154,134,0.35)]"
                                    >
                                        {session ? "My Dashboard" : "Join Community"}
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
