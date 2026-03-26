"use client";

export const dynamic = 'force-dynamic';

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Heart, Sparkles, Star, ArrowRight,
    GraduationCap, HandHeart, Quote,
    Lightbulb, Users, Shield
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────

const HOPE_CARDS = [
    {
        id: 1,
        quote: "Talking to a senior helped me ace my finals without the panic. I finally felt like someone understood the pressure.",
        author: "2nd year, Computer Science",
        emoji: "🎓",
        bg: "bg-rose-50",
        border: "border-rose-100",
        accent: "text-rose-500",
        tall: true,
    },
    {
        id: 2,
        quote: "I used to cry before every exam. After two sessions on PsyConnect, I have actual tools to calm down.",
        author: "1st year, Economics",
        emoji: "💪",
        bg: "bg-violet-50",
        border: "border-violet-100",
        accent: "text-violet-500",
        tall: false,
    },
    {
        id: 3,
        quote: "Being a mentor taught me more about myself than four years of coursework ever did.",
        author: "4th year Mentor, Psychology",
        emoji: "✨",
        bg: "bg-amber-50",
        border: "border-amber-100",
        accent: "text-amber-500",
        tall: false,
    },
    {
        id: 4,
        quote: "I thought asking for help was weakness. Now I know it's the most intelligent thing I ever did.",
        author: "3rd year, Engineering",
        emoji: "🌱",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        accent: "text-emerald-500",
        tall: true,
    },
    {
        id: 5,
        quote: "The forum is the only place I can talk about my anxiety without being judged. It changed my semester.",
        author: "2nd year, Arts & Humanities",
        emoji: "🫶",
        bg: "bg-blue-50",
        border: "border-blue-100",
        accent: "text-blue-500",
        tall: false,
    },
    {
        id: 6,
        quote: "My mentor shared resources that my professors never mentioned. I wish I'd found this in my first week.",
        author: "1st year, Business",
        emoji: "📚",
        bg: "bg-teal-50",
        border: "border-teal-100",
        accent: "text-teal-500",
        tall: false,
    },
    {
        id: 7,
        quote: "Three months later I went from academic probation to Dean's list. The support here is real.",
        author: "3rd year, Science",
        emoji: "⭐",
        bg: "bg-orange-50",
        border: "border-orange-100",
        accent: "text-orange-500",
        tall: true,
    },
    {
        id: 8,
        quote: "You don't need to be in crisis to join. Sometimes you just need someone to remind you that you belong here.",
        author: "Anonymous",
        emoji: "💙",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
        accent: "text-indigo-500",
        tall: false,
    },
];

// ─── Staggered Masonry Card ─────────────────────────────────

function HopeCard({
    card,
    index,
}: {
    card: (typeof HOPE_CARDS)[0];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className={`${card.bg} ${card.border} border rounded-3xl p-6 flex flex-col gap-4 break-inside-avoid relative overflow-hidden group hover:shadow-lg transition-shadow duration-300`}
        >
            {/* Decorative quote mark */}
            <Quote className={`w-8 h-8 ${card.accent} opacity-20 absolute top-4 right-4 group-hover:opacity-40 transition-opacity`} />

            <p className="text-gray-700 text-base leading-relaxed font-medium relative z-10">
                &ldquo;{card.quote}&rdquo;
            </p>

            <div className="flex items-center gap-2 mt-auto">
                <span className="text-xl">{card.emoji}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {card.author}
                </span>
            </div>

            {/* Row of mini stars */}
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${card.accent} fill-current opacity-60`} />
                ))}
            </div>
        </motion.div>
    );
}

// ─── Path Card (Student / Mentor) ──────────────────────────

function PathCard({
    role,
    title,
    tagline,
    bullets,
    cta,
    href,
    icon: Icon,
    gradientFrom,
    gradientTo,
    delay,
}: {
    role: string;
    title: string;
    tagline: string;
    bullets: string[];
    cta: string;
    href: string;
    icon: React.ElementType;
    gradientFrom: string;
    gradientTo: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay }}
            className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col"
        >
            {/* Gradient banner */}
            <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} px-8 py-10 flex flex-col items-center text-center`}>
                <motion.div
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                >
                    <Icon className="w-10 h-10 text-white" />
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">{role}</span>
                <h3 className="text-2xl font-extrabold text-white leading-snug">{title}</h3>
            </div>

            {/* Content body */}
            <div className="px-8 py-7 flex flex-col flex-1 gap-5">
                <p className="text-gray-500 text-base leading-relaxed">{tagline}</p>

                <ul className="space-y-3 flex-1">
                    {bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                {i + 1}
                            </span>
                            {b}
                        </li>
                    ))}
                </ul>

                <Link href={href} className="block mt-2">
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.14)" }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center gap-2 shadow-lg transition-all`}
                    >
                        {cta} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
}

// ─── Page ──────────────────────────────────────────────────

export default function CommunityPage() {
    return (
        <div className="bg-gradient-to-b from-white via-purple-50/30 to-white min-h-screen">

            {/* ── Hero Section ── */}
            <section className="text-center px-4 pt-20 pb-16 max-w-4xl mx-auto">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    You Belong Here
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-5"
                >
                    A Community Built on{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Compassion
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Thousands of students are navigating college life together on PsyConnect.
                    Real stories, real mentors, zero judgement.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link href="/auth/signup">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-extrabold text-base shadow-xl hover:shadow-primary/40 transition-all"
                        >
                            <Heart className="w-5 h-5 fill-white" />
                            Join Now — It&apos;s Free
                        </motion.button>
                    </Link>
                    <Link href="/auth/signin">
                        <button className="px-8 py-4 rounded-full font-bold text-base text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary transition-all">
                            Sign In
                        </button>
                    </Link>
                </motion.div>

                {/* Social proof count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-8 mt-12 text-center"
                >
                    {[
                        { stat: "2,400+", label: "Students supported" },
                        { stat: "180+", label: "Peer mentors" },
                        { stat: "4.9★", label: "Community rating" },
                    ].map(({ stat, label }) => (
                        <div key={label}>
                            <p className="text-2xl font-extrabold text-gray-900">{stat}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ── Wall of Hope ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Lightbulb className="w-3.5 h-3.5" />
                        Wall of Hope
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3"
                    >
                        Stories That Remind You It Gets Better
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-xl mx-auto text-base"
                    >
                        Anonymous reflections from students who found their footing with a little help.
                    </motion.p>
                </div>

                {/* Masonry grid — 3 columns desktop, 2 tablet, 1 mobile */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                    {HOPE_CARDS.map((card, i) => (
                        <div key={card.id} className="break-inside-avoid mb-5">
                            <HopeCard card={card} index={i} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Choose Your Path ── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Users className="w-3.5 h-3.5" />
                        Choose Your Path
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3"
                    >
                        How Do You Want to Show Up?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-xl mx-auto text-base"
                    >
                        Whether you need support or you&apos;re ready to give it, there&apos;s a place for you here.
                    </motion.p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                    <PathCard
                        role="For Students"
                        title="Find a Mentor"
                        tagline="You don't have to navigate deadlines, anxiety, or campus life alone. Connect with a senior who's been exactly where you are."
                        bullets={[
                            "Get matched with a peer mentor in 24 hours",
                            "Private, anonymous conversations — always",
                            "Access curated mental health resources",
                        ]}
                        cta="Find My Mentor"
                        href="/auth/signup?role=STUDENT"
                        icon={GraduationCap}
                        gradientFrom="from-primary"
                        gradientTo="to-blue-500"
                        delay={0.1}
                    />
                    <PathCard
                        role="For Seniors & Counsellors"
                        title="Become a Mentor"
                        tagline="Your experience is your superpower. Give back to a junior who needs exactly the guidance you once searched for."
                        bullets={[
                            "Set your own availability — 1 hr/week minimum",
                            "Peer-reviewed onboarding & support training",
                            "Make a measurable impact on someone's semester",
                        ]}
                        cta="Start Mentoring"
                        href="/auth/signup?role=COUNSELLOR"
                        icon={HandHeart}
                        gradientFrom="from-secondary"
                        gradientTo="to-emerald-500"
                        delay={0.2}
                    />
                </div>
            </section>

            {/* ── Trust Strip ── */}
            <section className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: Shield, title: "100% Anonymous", desc: "Your identity is never shared with peers without your consent." },
                        { icon: Heart, title: "Non-clinical Support", desc: "Peer mentors complement, not replace, professional care." },
                        { icon: Sparkles, title: "Always Free", desc: "PsyConnect is free for every student, no subscriptions ever." },
                    ].map(({ icon: Icon, title, desc }) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="font-bold text-gray-900 text-base">{title}</p>
                            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Ready to Take the First Step?
                    </h2>
                    <p className="text-gray-500 text-lg mb-8">
                        It takes 60 seconds to sign up. No stress. No forms. Just a community waiting to welcome you.
                    </p>
                    <Link href="/auth/signup">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-full font-extrabold text-lg shadow-xl"
                        >
                            <Heart className="w-5 h-5 fill-white" />
                            Join PsyConnect
                        </motion.button>
                    </Link>
                    <p className="text-xs text-gray-400 mt-4">
                        Already a member?{" "}
                        <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </motion.div>
            </section>
        </div>
    );
}
