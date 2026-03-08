"use client";

import {
  MessageSquare,
  BookOpen,
  ArrowRight,
  PlayCircle,
  LayoutDashboard,
  LogIn,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// ── Auth Guard Modal ─────────────────────────────────────────

function AuthGuardModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <LayoutDashboard className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your Dashboard Awaits</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          To access your personalized wellness tools, please sign in first.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/signin?callbackUrl=/dashboard" onClick={onClose}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </motion.button>
          </Link>
          <Link href="/auth/signup?callbackUrl=/dashboard" onClick={onClose}>
            <button className="w-full text-sm font-semibold text-gray-500 hover:text-primary transition-colors py-2">
              New here? Create a free account →
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Auth-Guarded Dashboard Button ────────────────────────────

function DashboardButton() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  const role = session ? (session.user as { role?: string })?.role : null;
  const dashboardHref =
    role === "COUNSELLOR" || role === "ADMIN"
      ? "/dashboard/senior"
      : "/dashboard/student";

  const handleClick = () => {
    if (status === "loading") return;
    if (!session) {
      setShowModal(true);
    }
    // If logged in, the Link itself navigates
  };

  return (
    <>
      <AnimatePresence>
        {showModal && <AuthGuardModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {session ? (
        <Link href={dashboardHref}>
          <button className="flex items-center justify-center gap-2 bg-white text-foreground px-8 py-3.5 rounded-full font-bold text-lg border border-accent hover:bg-accent/50 transition-all shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
            My Dashboard
          </button>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center justify-center gap-2 bg-white text-foreground px-8 py-3.5 rounded-full font-bold text-lg border border-accent hover:bg-accent/50 transition-all shadow-sm"
        >
          <LayoutDashboard className="w-5 h-5" />
          My Dashboard
        </button>
      )}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero Section (Split Layout) */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 w-full">
          {/* Left Column: Welcome text & CTA */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
              Safe &amp; Anonymous
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              You are not alone.{" "}
              <span className="text-secondary relative whitespace-nowrap">
                Join the conversation.
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-secondary/30" viewBox="0 0 200 9" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0.5,8 C50,2 150,2 199.5,8" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-foreground/70 md:text-xl font-medium max-w-xl text-balance">
              PsyConnect is your safe space on campus. Share anonymously, access free wellness resources, or book a confidential session with a professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/forum">
                <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-bold text-lg hover:bg-secondary/90 transition-all shadow-lg hover:-translate-y-1 hover:shadow-xl">
                  <MessageSquare className="w-5 h-5" />
                  Enter Peer Forum
                </button>
              </Link>
              {/* Auth-guarded Dashboard button */}
              <DashboardButton />
            </div>
          </div>

          {/* Right Column: Dynamic Forum Pulse grid */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* Card 1 */}
              <div className="glass p-5 rounded-2xl transform sm:translate-y-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">A</div>
                  <span className="text-xs font-semibold text-foreground/60">Anonymous • 2h ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">Feeling overwhelmed with finals approaching...</h3>
                <p className="text-sm text-foreground/70 line-clamp-2">Does anyone else feel like they&apos;re just completely frozen? I have so much to do but I can&apos;t start.</p>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>12 replies</span><span>45 ♥</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass p-5 rounded-2xl transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-orange-400 flex items-center justify-center text-white text-xs font-bold">U</div>
                  <span className="text-xs font-semibold text-foreground/60">Student2024 • 5h ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">A quick tip for anxiety attacks</h3>
                <p className="text-sm text-foreground/70 line-clamp-2">The 5-4-3-2-1 grounding method really saved me today. Look around and name...</p>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>34 replies</span><span>128 ♥</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass p-5 rounded-2xl hidden sm:block transform translate-y-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground text-xs font-bold">M</div>
                  <span className="text-xs font-semibold text-foreground/60">Anonymous • 1d ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">How to tell my roommate I need space?</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>8 replies</span><span>22 ♥</span>
                </div>
              </div>

              {/* Fading overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-2xl"></div>
            </div>

            <div className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg text-primary cursor-pointer hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Resource Carousel Section */}
      <section className="bg-accent/30 py-20 px-4 sm:px-6 lg:px-8 border-t border-white/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Care Toolkit
              </h2>
              <p className="text-foreground/70 font-medium">Curated wellness guides, meditations, and articles.</p>
            </div>
            <Link href="/resources" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full cursor-pointer">
              <div className="h-48 bg-primary/20 relative flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-primary opacity-80 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">Audio • 5 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Meditation</span>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Box Breathing for Panic</h3>
                <p className="text-sm text-foreground/70 line-clamp-2 mt-auto">A quick guided session to help regulate your nervous system.</p>
              </div>
            </div>

            {/* Resource 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full cursor-pointer">
              <div className="h-48 bg-secondary/20 relative flex items-center justify-center p-6">
                <div className="w-full h-full bg-white/50 rounded-lg border-2 border-dashed border-secondary/40 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-secondary" />
                </div>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">Article • 4 min read</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Guide</span>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Surviving Finals Week</h3>
                <p className="text-sm text-foreground/70 line-clamp-2 mt-auto">Actionable strategies for time management and stress reduction.</p>
              </div>
            </div>

            {/* Resource 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full cursor-pointer hidden lg:flex">
              <div className="h-48 bg-orange-100 relative flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-orange-400 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">Video • 12 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Workshop</span>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Yoga for Focus</h3>
                <p className="text-sm text-foreground/70 line-clamp-2 mt-auto">Gentle stretches to be done right at your desk before a big exam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
