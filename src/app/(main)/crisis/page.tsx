"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone, MessageCircle, Globe, AlertTriangle,
    ChevronDown, ChevronUp, Heart, Shield, ArrowRight, Users
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────

const INDIA_HELPLINES = [
    {
        name: "iCall",
        number: "9152987821",
        hours: "Mon–Sat, 8am–10pm",
        description: "Psychosocial helpline by TISS — counselling for students and youth.",
        type: "call" as const,
        color: "bg-blue-600",
    },
    {
        name: "Vandrevala Foundation",
        number: "1860-2662-345",
        hours: "24/7",
        description: "Free mental health support in English and Hindi. Trained counsellors available around the clock.",
        type: "call" as const,
        color: "bg-indigo-600",
    },
    {
        name: "AASRA",
        number: "9820466627",
        hours: "24/7",
        description: "Emotional support and suicide prevention helpline for those in despair.",
        type: "call" as const,
        color: "bg-violet-600",
    },
    {
        name: "Snehi",
        number: "044-24640050",
        hours: "24/7",
        description: "Telephone counselling for people dealing with depression and emotional distress.",
        type: "call" as const,
        color: "bg-rose-600",
    },
    {
        name: "Fortis Stress Helpline",
        number: "8376804102",
        hours: "24/7",
        description: "Provides distress support from trained professionals across India.",
        type: "call" as const,
        color: "bg-orange-600",
    },
];

const INTERNATIONAL_HELPLINES: Record<string, { name: string; number: string; website?: string }[]> = {
    "United States": [
        { name: "988 Suicide & Crisis Lifeline", number: "988", website: "https://988lifeline.org" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", website: "https://www.crisistextline.org" },
    ],
    "United Kingdom": [
        { name: "Samaritans", number: "116 123", website: "https://www.samaritans.org" },
        { name: "CALM", number: "0800 58 58 58", website: "https://www.thecalmzone.net" },
    ],
    "Australia": [
        { name: "Lifeline", number: "13 11 14", website: "https://www.lifeline.org.au" },
        { name: "Beyond Blue", number: "1300 22 4636", website: "https://www.beyondblue.org.au" },
    ],
    "Canada": [
        { name: "Crisis Services Canada", number: "1-833-456-4566", website: "https://www.crisisservicescanada.ca" },
    ],
    "International": [
        { name: "International Association for Suicide Prevention", number: "N/A", website: "https://www.iasp.info/resources/Crisis_Centres" },
        { name: "Befrienders Worldwide", number: "N/A", website: "https://www.befrienders.org" },
    ],
};

const EMERGENCY_STEPS = [
    {
        step: "01",
        title: "Reach Out Now",
        description: "Call one of the helplines above or go to your nearest hospital emergency department. You don't need to be in immediate danger — if you're struggling, you deserve support.",
        icon: Phone,
        color: "from-red-500 to-rose-600",
    },
    {
        step: "02",
        title: "Stay with Someone",
        description: "If you feel unsafe, don't be alone. Call a trusted friend, family member, or go to a public space. Tell someone how you're feeling — saying it out loud is a form of safety.",
        icon: Users,
        color: "from-orange-500 to-amber-500",
    },
    {
        step: "03",
        title: "Remove Means",
        description: "If possible, put distance between yourself and anything that could cause harm. Give medications to a trusted person, leave an unsafe location, or ask someone to stay with you.",
        icon: Shield,
        color: "from-emerald-500 to-teal-500",
    },
];

// ─── Components ────────────────────────────────────────────

function HelplineCard({ helpline }: { helpline: typeof INDIA_HELPLINES[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col gap-4 border border-red-100"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">{helpline.name}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{helpline.hours}</p>
                </div>
                <span className={`${helpline.color} text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0`}>
                    {helpline.type === "call" ? "CALL" : "TEXT"}
                </span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">{helpline.description}</p>

            <a
                href={`tel:${helpline.number.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-between bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-3.5 px-4 rounded-xl transition-colors group"
                aria-label={`Call ${helpline.name} at ${helpline.number}`}
            >
                <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 fill-red-600 text-red-600" />
                    <span className="text-lg tracking-tight">{helpline.number}</span>
                </div>
                <span className="text-sm font-semibold text-red-500 group-hover:translate-x-1 transition-transform">
                    Call now →
                </span>
            </a>
        </motion.div>
    );
}

function InternationalAccordion() {
    const [openRegion, setOpenRegion] = useState<string | null>(null);
    const regions = Object.keys(INTERNATIONAL_HELPLINES);

    return (
        <div className="space-y-2">
            {regions.map((region) => (
                <div key={region} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setOpenRegion(openRegion === region ? null : region)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                        aria-expanded={openRegion === region}
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{region}</span>
                        </div>
                        {openRegion === region ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                    </button>

                    <AnimatePresence>
                        {openRegion === region && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="px-5 pb-4 space-y-3 border-t border-gray-100">
                                    {INTERNATIONAL_HELPLINES[region].map((line) => (
                                        <div key={line.name} className="flex items-start justify-between gap-3 pt-3">
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{line.name}</p>
                                                <p className="text-gray-500 text-sm font-medium mt-0.5">{line.number}</p>
                                            </div>
                                            {line.website && (
                                                <a
                                                    href={line.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-semibold text-primary hover:underline flex-shrink-0"
                                                >
                                                    Visit ↗
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────

export default function CrisisPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Minimal Header ── */}
            <header className="bg-red-700 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white">
                        <Users className="w-5 h-5" />
                        <span className="font-bold text-base">PsyConnect</span>
                    </Link>
                    <span className="text-red-200 text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Crisis Support
                    </span>
                </div>
            </header>

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-red-700 via-red-600 to-rose-700 text-white pt-12 pb-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5"
                    >
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
                    >
                        You Are Not Alone
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-red-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
                    >
                        If you are in crisis, please reach out right now.
                        Trained counsellors are available 24/7 — speaking up is the bravest thing you can do.
                    </motion.p>

                    {/* Emergency CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <a
                            href="tel:9152987821"
                            className="flex items-center justify-center gap-2 bg-white text-red-700 font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl hover:bg-red-50 active:scale-95 transition-all"
                        >
                            <Phone className="w-6 h-6 fill-red-600 text-red-600" />
                            Call iCall: 9152987821
                        </a>
                        <a
                            href="tel:18602662345"
                            className="flex items-center justify-center gap-2 bg-red-800/60 border border-white/30 text-white font-bold text-base px-7 py-4 rounded-2xl hover:bg-red-800/80 active:scale-95 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            Vandrevala: 1860-2662-345
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                {/* ── 3-Step Emergency Guide ── */}
                <section>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">What to Do Right Now</h2>
                    <p className="text-gray-500 mb-8">Follow these three steps if you or someone you know is in immediate crisis.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {EMERGENCY_STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col gap-4"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-300 mb-1">STEP {step.step}</p>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── India Helplines Grid ── */}
                <section>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">India Helplines</h2>
                    <p className="text-gray-500 mb-8">All helplines below are free and confidential. Available 24/7 unless noted.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {INDIA_HELPLINES.map((line) => (
                            <HelplineCard key={line.name} helpline={line} />
                        ))}
                    </div>
                </section>

                {/* ── International Accordion ── */}
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <h2 className="text-2xl font-extrabold text-gray-900">International Support</h2>
                    </div>
                    <p className="text-gray-500 mb-8">Select your region to find local crisis resources.</p>
                    <InternationalAccordion />
                </section>

                {/* ── Chat on Platform ── */}
                <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 border border-primary/20">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">Peer Support on PsyConnect</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connect with a trained peer mentor or counsellor through our platform. Not a crisis service, but sometimes just talking helps.
                        </p>
                    </div>
                    <Link
                        href="/forum"
                        className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-primary/90 transition-all whitespace-nowrap flex-shrink-0"
                    >
                        Open Chat <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                {/* ── Disclaimer ── */}
                <div className="bg-gray-100 rounded-2xl px-6 py-5 text-sm text-gray-500 leading-relaxed">
                    <strong className="text-gray-700">Disclaimer:</strong> PsyConnect is not a crisis intervention service. The helpline numbers listed are operated by independent organisations. In a life-threatening emergency, always call your local emergency number (112 in India, 911 in the US) or go to the nearest hospital emergency room immediately.
                </div>
            </div>
        </div>
    );
}
