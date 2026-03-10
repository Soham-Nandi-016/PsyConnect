"use client";

import {
  MessageSquare,
  BookOpen,
  ArrowRight,
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
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 25 }}
        className="glass-heavy rounded-3xl shadow-modal p-8 w-full max-w-sm relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-5 border border-white/50">
          <LayoutDashboard className="w-8 h-8 text-primary" />
        </div>

        <h2 className="heading-serif text-xl text-gray-900 mb-2">Your Dashboard Awaits</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          To access your personalized wellness tools, please sign in first.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/signin?callbackUrl=/dashboard" onClick={onClose}>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#6b8f66] text-white py-3.5 rounded-full font-bold hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(138,154,134,0.40)] "
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
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm text-foreground px-8 py-3.5 rounded-full font-bold text-lg border border-white/60 hover:bg-white/90 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
          >
            <LayoutDashboard className="w-5 h-5" />
            My Dashboard
          </motion.button>
        </Link>
      ) : (
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm text-foreground px-8 py-3.5 rounded-full font-bold text-lg border border-white/60 hover:bg-white/90 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
        >
          <LayoutDashboard className="w-5 h-5" />
          My Dashboard
        </motion.button>
      )}
    </>
  );
}

// ── Custom Gradient Play Button ───────────────────────────────
function GradientPlayButton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${className}`}>
      <svg viewBox="0 0 24 24" fill="white" className="w-1/2 h-1/2 ml-1 drop-shadow">
        <path d="M8 5.14v14l11-7-11-7z" />
      </svg>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section (Split Layout) */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-36 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Enhanced decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[32rem] h-[32rem] bg-purple-200/30 rounded-full blur-[80px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[36rem] h-[36rem] bg-emerald-200/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-amber-100/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 w-full">
          {/* Left Column: Welcome text & CTA */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-sm font-semibold border border-primary/20 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
              Safe &amp; Anonymous
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-serif text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-foreground leading-tight"
            >
              You are not alone.{" "}
              <span className="text-secondary relative whitespace-nowrap">
                Join the conversation.
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-secondary/30" viewBox="0 0 200 9" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0.5,8 C50,2 150,2 199.5,8" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-foreground/65 md:text-xl font-medium max-w-xl leading-relaxed"
            >
              PsyConnect is your safe space on campus. Share anonymously, access free wellness resources, or book a confidential session with a professional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-2"
            >
              <Link href="/forum">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-[#c8895a] text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-[0_6px_24px_rgba(212,163,115,0.40),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_8px_30px_rgba(212,163,115,0.50)]"
                >
                  <MessageSquare className="w-5 h-5" />
                  Enter Peer Forum
                </motion.button>
              </Link>
              {/* Auth-guarded Dashboard button */}
              <DashboardButton />
            </motion.div>
          </div>

          {/* Right Column: Dynamic Forum Pulse grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass p-5 transform sm:translate-y-8 cursor-default"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
                  <span className="text-xs font-semibold text-foreground/50">Anonymous • 2h ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">Feeling overwhelmed with finals approaching...</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">Does anyone else feel like they&apos;re just completely frozen? I have so much to do but I can&apos;t start.</p>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>12 replies</span><span>45 ♥</span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass p-5 cursor-default"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">U</div>
                  <span className="text-xs font-semibold text-foreground/50">Student2024 • 5h ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">A quick tip for anxiety attacks</h3>
                <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">The 5-4-3-2-1 grounding method really saved me today. Look around and name...</p>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>34 replies</span><span>128 ♥</span>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass p-5 hidden sm:block transform translate-y-8 cursor-default"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-300 to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">M</div>
                  <span className="text-xs font-semibold text-foreground/50">Anonymous • 1d ago</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">How to tell my roommate I need space?</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>8 replies</span><span>22 ♥</span>
                </div>
              </motion.div>

              {/* Fading overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-b-3xl"></div>
            </div>

            <Link href="/forum" className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-11 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.10)] text-primary hover:scale-110 transition-transform border border-white/50">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Resource Carousel Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/40 relative">
        {/* Subtle section glass background */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="heading-serif text-3xl text-foreground mb-2 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-2xl border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                Care Toolkit
              </h2>
              <p className="text-foreground/60 font-medium leading-relaxed">Curated wellness guides, meditations, and articles.</p>
            </div>
            <Link href="/resources" className="text-primary font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all text-sm group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource 1 — Audio */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-primary/30 to-teal-200/40 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                {/* Custom play button */}
                <GradientPlayButton className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-primary/90 text-white">Meditation</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">Audio • 5 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">Box Breathing for Panic</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">A quick guided session to help regulate your nervous system.</p>
              </div>
            </motion.div>

            {/* Resource 2 — Article */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-secondary/30 to-orange-100/60 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-secondary" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-secondary/90 text-white">Guide</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">Article • 4 min read</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">Surviving Finals Week</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">Actionable strategies for time management and stress reduction.</p>
              </div>
            </motion.div>

            {/* Resource 3 — Video */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer hidden lg:flex"
            >
              <div className="h-48 bg-gradient-to-br from-orange-200/40 to-amber-100/50 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                <GradientPlayButton className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-orange-400/90 text-white">Workshop</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">Video • 12 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">Yoga for Focus</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">Gentle stretches to be done right at your desk before a big exam.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
