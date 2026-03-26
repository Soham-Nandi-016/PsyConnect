"use client";

import { MessageSquare, BookOpen, ArrowRight, LayoutDashboard, Heart, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

// ── Interactive Forum Card ─────────────────────────────────────
function InteractiveForumCard({ 
  id,
  avatarLetter, 
  authorStr, 
  title, 
  preview, 
  initialReplies, 
  initialLikes, 
  onGuestClick,
  gradientFrom,
  gradientTo,
  hiddenSm = false 
}: any) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse "Name • Time" back to structured elements so "Anonymous" and "Student2024" align perfectly.
  const [authorName, timeAgo] = authorStr.split(" • ");

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      onGuestClick();
      return;
    }
    setHasLiked(!hasLiked);
    setLikes((l: number) => hasLiked ? l - 1 : l + 1);
  };

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded(false);
  };

  const CardContent = ({ expanded = false }) => (
    <>
      {/* 3. Match the Header: Exact spacing/font for both states */}
      <div className="flex items-center gap-3 mb-4 mt-1">
        <div className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr ${gradientFrom} ${gradientTo} flex items-center justify-center text-white text-[13px] font-bold shadow-sm`}>
          {avatarLetter}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground/85 leading-none">{authorName}</span>
          <span className="text-[11px] font-medium text-foreground/50 leading-none">{timeAgo}</span>
        </div>
      </div>

      <h3 className={`font-bold text-foreground mb-2 leading-snug ${expanded ? 'text-[22px] mt-1' : 'text-base'}`}>{title}</h3>
      
      {/* Preview text */}
      {preview && !expanded && <p className="text-[15px] text-foreground/60 line-clamp-2 leading-relaxed flex-1">{preview}</p>}
      
      {/* Expanded content */}
      {/* 2. Fix the sizing: Added hidden webkit scrollbar utilities to keep it clean */}
      {expanded && (
          <div className="mt-3 flex flex-col gap-3 flex-1 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <p className="text-[16px] text-foreground/75 leading-relaxed mb-4">{preview || "I'm not sure how to handle this situation. Any advice right now?"}</p>
            
            <div className="border-t border-black/[0.06] pt-5">
              <span className="text-[11px] font-bold text-primary/70 mb-4 block uppercase tracking-widest">Top Comments</span>
              
              <div className="bg-foreground/[0.03] rounded-2xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">P</div>
                      <span className="text-xs font-bold text-foreground/70">PeerUser</span>
                  </div>
                  <p className="text-[14px] text-foreground/80 leading-snug">I honestly feel the exact same way. Take it one day at a time.</p>
              </div>

              <div className="bg-foreground/[0.03] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">S</div>
                      <span className="text-xs font-bold text-foreground/70">StudyBuddy</span>
                  </div>
                  <p className="text-[14px] text-foreground/80 leading-snug">Have you tried using the Pomodoro timer in the resources? It really helps break the freeze state instantly.</p>
              </div>
            </div>
            
            {/* The Guidance Link */}
            <div className="mt-auto pt-6 text-center">
                <Link href="/forum" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-sm font-bold text-[#6b8f66] hover:bg-primary/20 transition-colors" onClick={e => e.stopPropagation()}>
                    Want to see more? Visit the Peer Forum →
                </Link>
            </div>
          </div>
      )}

      {/* Persistence and generic sizing adjustments */}
      <div className={`flex items-center justify-between text-[13px] text-primary font-semibold ${!preview && !expanded ? 'mt-auto' : expanded ? 'mt-5 pt-4 border-t border-black/[0.06]' : 'mt-5'}`}>
        <span>{initialReplies} replies</span>
        <motion.button 
          onClick={handleLike}
          whileTap={{ scale: 0.8 }}
          className="flex items-center gap-2 hover:text-rose-500 transition-colors bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/10 shadow-sm"
        >
          {likes} <Heart className={`w-[14px] h-[14px] ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-primary'}`} />
        </motion.button>
      </div>
      
      {expanded && (
          <button onClick={handleCollapse} className="absolute top-5 right-5 p-2 bg-black/5 rounded-full hover:bg-black/10 text-foreground/50 transition-colors">
              <X className="w-5 h-5" />
          </button>
      )}
    </>
  );

  return (
    <>
      {/* 1. Unify the Components: Every card is treated identically */}
      <motion.div
        layoutId={`forum-card-${id}`}
        onClick={handleExpand}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`glass p-6 cursor-pointer flex flex-col ${hiddenSm ? 'hidden sm:flex' : 'flex'} relative group`}
        style={{ 
            boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
            opacity: isExpanded ? 0 : 1,
            borderRadius: "1.5rem"
        }}
        animate={{ opacity: isExpanded ? 0 : 1 }}
      >
        <CardContent expanded={false} />
      </motion.div>

      {/* 4. Background Blur: Overlay blur guaranteed consistent. */}
      {/* 2. Fix the Sizing: Forced aspect/height map so it's not squashed. */}
      <AnimatePresence>
          {isExpanded && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/30 backdrop-blur-md" 
                    onClick={() => setIsExpanded(false)} 
                  />
                  
                  <motion.div
                    layoutId={`forum-card-${id}`}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="glass-heavy w-full max-w-md h-[550px] p-6 sm:p-8 rounded-[2rem] flex flex-col relative z-20 bg-white/95 overflow-hidden shadow-2xl"
                    style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                  >
                      <CardContent expanded={true} />
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </>
  );
}

// ── Custom Gradient Action Button ──────────────────────────────
function GradientActionBtn({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] ${className}`}>
        <ChevronRight className="w-[50%] h-[50%] text-white ml-0.5 drop-shadow" />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title?: string, description?: React.ReactNode }>({
      isOpen: false,
  });

  const role = session ? (session.user as { role?: string })?.role : null;
  const dashboardHref = role === "COUNSELLOR" || role === "ADMIN" ? "/dashboard/senior" : "/dashboard/student";

  const closeAuthModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const handleProtectedAction = (e: React.MouseEvent, dest: string, sectionName: string = "section") => {
    e.preventDefault();
    if (status === "loading") return;
    if (!session) {
      setModalConfig({
          isOpen: true,
          title: "Login Required 🔒",
          description: (
              <>
                  To protect our students&apos; privacy, a verified login is required for the {sectionName}.{" "}
                  <Link href="/community" onClick={closeAuthModal} className="text-[#6b8f66] font-semibold hover:underline">
                      Visit our Join Community page
                  </Link>{" "}
                  to learn more about how we keep you safe.
              </>
          )
      });
    } else {
      router.push(dest);
    }
  };

  const openSoftModal = () => {
    setModalConfig({
        isOpen: true,
        title: "A Safe Space Awaits ✨",
        description: <span className="text-[#5c6659] text-[15px] leading-relaxed mb-7 px-1">Join our anonymous community to share, listen, and grow together.</span>
    });
  }

  return (
    <main className="min-h-screen flex flex-col">
      <AuthModal 
        isOpen={modalConfig.isOpen} 
        onClose={closeAuthModal} 
        title={modalConfig.title} 
        description={modalConfig.description} 
      />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-36 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Soft decorative blobs */}
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-sm font-semibold border border-primary/20 shadow-sm transition-transform hover:scale-105"
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
              <button onClick={(e) => handleProtectedAction(e, dashboardHref, "Dashboard")}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm text-foreground px-8 py-3.5 rounded-full font-bold text-lg border border-white/60 hover:bg-white/90 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  My Dashboard
                </motion.div>
              </button>

              <button onClick={() => router.push("/community")}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-[#c8895a] text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-[0_6px_24px_rgba(212,163,115,0.40),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_8px_30px_rgba(212,163,115,0.50)]"
                >
                  <MessageSquare className="w-5 h-5" />
                  Join Community
                </motion.div>
              </button>
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
              {/* REPLACED TRANSFORM CLASSES WITH MARGINS TO FIX LAYOUTID SQUASHING */}
              <div className="sm:mt-8">
                <InteractiveForumCard 
                  id="1"
                  avatarLetter="A" authorStr="Anonymous • 2h ago" 
                  title="Feeling overwhelmed with finals approaching..." 
                  preview="Does anyone else feel like they're just completely frozen? I have so much to do but I can't start." 
                  initialReplies={12} initialLikes={45} onGuestClick={openSoftModal}
                  gradientFrom="from-primary" gradientTo="to-secondary"
                />
              </div>

              <div>
                <InteractiveForumCard 
                  id="2"
                  avatarLetter="U" authorStr="Student2024 • 5h ago" 
                  title="A quick tip for anxiety attacks" 
                  preview="The 5-4-3-2-1 grounding method really saved me today. Look around and name..." 
                  initialReplies={34} initialLikes={128} onGuestClick={openSoftModal}
                  gradientFrom="from-secondary" gradientTo="to-orange-400"
                />
              </div>

              <div className="mt-8">
                <InteractiveForumCard 
                  id="3"
                  avatarLetter="M" authorStr="Anonymous • 1d ago" 
                  title="How to tell my roommate I need space?" 
                  preview={null}
                  initialReplies={8} initialLikes={22} onGuestClick={openSoftModal}
                  gradientFrom="from-violet-300" gradientTo="to-indigo-400"
                  hiddenSm={true}
                />
              </div>

              {/* Fading overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-b-3xl z-0"></div>
            </div>

            <button onClick={(e) => handleProtectedAction(e, "/forum", "Peer Forum")} className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-11 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.10)] text-primary hover:scale-110 transition-transform border border-white/50 z-10">
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Resource Carousel Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/40 relative">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="heading-serif text-3xl text-foreground mb-3 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-2xl border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                Care Toolkit
              </h2>
              <p className="text-foreground/60 font-medium leading-relaxed">Curated wellness guides, meditations, and articles.</p>
            </div>
            <button onClick={(e) => handleProtectedAction(e, "/resources", "Resource Hub")} className="text-primary font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all text-sm group w-fit">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource 1 — Audio */}
            <motion.div
              onClick={(e) => handleProtectedAction(e, "/resources", "Resource Hub")}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset" }}
            >
              <div className="h-48 bg-gradient-to-br from-primary/30 to-teal-200/40 relative flex items-center justify-center rounded-t-3xl overflow-hidden p-4">
                <GradientActionBtn className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-primary/90 text-white backdrop-blur-sm border-white/20 border">Meditation</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">Audio • 5 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white/40">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">Box Breathing for Panic</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">A quick guided session to help regulate your nervous system.</p>
              </div>
            </motion.div>

            {/* Resource 2 — Article */}
            <motion.div
              onClick={(e) => handleProtectedAction(e, "/resources", "Resource Hub")}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset" }}
            >
              <div className="h-48 bg-gradient-to-br from-secondary/30 to-orange-100/60 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                <GradientActionBtn className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-secondary/90 text-white backdrop-blur-sm border-white/20 border">Guide</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">Article • 4 min read</span>
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white/40">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">Surviving Finals Week</h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">Actionable strategies for time management and stress reduction.</p>
              </div>
            </motion.div>

            {/* Resource 3 — Video */}
            <motion.div
              onClick={(e) => handleProtectedAction(e, "/resources", "Resource Hub")}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass overflow-hidden group flex flex-col h-full cursor-pointer hidden lg:flex"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset" }}
            >
              <div className="h-48 bg-gradient-to-br from-orange-200/40 to-amber-100/50 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                <GradientActionBtn className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3">
                  <span className="pill-tag bg-orange-400/90 text-white backdrop-blur-sm border-white/20 border">Workshop</span>
                </span>
                <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">Video • 12 min</span>
              </div>
              <div className="p-5 flex-1 flex flex-col bg-white/40">
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
