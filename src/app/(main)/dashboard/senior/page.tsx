"use client";

import { motion } from "framer-motion";
import {
    Users, MessageSquare, Clock, CheckCircle2,
    Star, TrendingUp, ArrowRight, User, Bell, BookOpen
} from "lucide-react";
import Link from "next/link";

// ── Mock data — replace with DB queries when backend is ready ──

const PENDING_REQUESTS = [
    { id: "1", name: "Priya M.", year: "1st Year", topic: "Exam anxiety & time management", time: "2h ago" },
    { id: "2", name: "Rohan K.", year: "2nd Year", topic: "Struggling with group projects", time: "5h ago" },
    { id: "3", name: "Ananya S.", year: "1st Year", topic: "Feeling overwhelmed — hostel life", time: "1d ago" },
];

const ACTIVE_MENTEES = [
    { id: "1", name: "Aditya Verma", year: "2nd Year", sessions: 4, lastActive: "Today", mood: "🙂", progress: 72 },
    { id: "2", name: "Shruti Nair", year: "1st Year", sessions: 2, lastActive: "Yesterday", mood: "😐", progress: 45 },
    { id: "3", name: "Karan Mehta", year: "3rd Year", sessions: 7, lastActive: "2d ago", mood: "🤩", progress: 88 },
];

const STATS = [
    { label: "Active Mentees", value: "3", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Sessions This Month", value: "11", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg. Response Time", value: "< 2h", icon: Clock, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Mentor Rating", value: "4.9★", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
];

export default function SeniorDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-secondary/20">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground">Mentor Overview</h1>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">Active</span>
                        </div>
                        <p className="text-foreground/70 font-medium">Senior Mentor Dashboard • PsyConnect</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <button className="bg-secondary/10 text-secondary font-bold px-4 py-2 rounded-xl hover:bg-secondary/20 transition-colors flex items-center gap-2">
                        Edit Profile <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                        >
                            <div className={`${stat.bg} p-3 rounded-xl flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                                <p className="text-xs font-semibold text-gray-400 leading-tight">{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Main Grid: Sidebar + Content ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Pending Requests Sidebar ── */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <h2 className="font-bold text-gray-900">Pending Requests</h2>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {PENDING_REQUESTS.length} new
                        </span>
                    </div>

                    <div className="flex-1 divide-y divide-gray-50">
                        {PENDING_REQUESTS.map((req) => (
                            <div key={req.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {req.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="font-semibold text-gray-900 text-sm">{req.name}</p>
                                            <span className="text-xs text-gray-400 flex-shrink-0">{req.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-1">{req.year}</p>
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{req.topic}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 text-xs font-semibold bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                                        Accept
                                    </button>
                                    <button className="flex-1 text-xs font-semibold bg-gray-100 text-gray-600 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100">
                        <button className="w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                            View all requests →
                        </button>
                    </div>
                </motion.div>

                {/* ── Active Mentees ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="font-bold text-gray-900">Active Mentees</h2>
                        </div>
                        <span className="text-xs font-semibold text-gray-400">{ACTIVE_MENTEES.length} students</span>
                    </div>

                    <div className="flex-1 divide-y divide-gray-50">
                        {ACTIVE_MENTEES.map((mentee, i) => (
                            <motion.div
                                key={mentee.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
                            >
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-bold flex-shrink-0 text-base">
                                    {mentee.name.split(" ").map((n) => n[0]).join("")}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-semibold text-gray-900 text-sm">{mentee.name}</p>
                                        <span className="text-lg">{mentee.mood}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{mentee.year} · {mentee.sessions} sessions</p>

                                    {/* Progress bar */}
                                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden w-36">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
                                            style={{ width: `${mentee.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Wellness: {mentee.progress}%</p>
                                </div>

                                {/* Last active + Chat button */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="text-xs text-gray-400">{mentee.lastActive}</span>
                                    <Link href="/forum">
                                        <motion.button
                                            whileHover={{ scale: 1.06 }}
                                            whileTap={{ scale: 0.94 }}
                                            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Chat
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Resources & Insights Row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Mentor Tips */}
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/10">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-gray-900">Mentor Toolkit</h3>
                        </div>
                        <ul className="space-y-2">
                            {[
                                "How to handle a disclosure of self-harm",
                                "Active listening techniques for anxiety",
                                "Setting healthy mentoring boundaries",
                            ].map((tip) => (
                                <li key={tip} className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                        <Link href="/resources" className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 hover:underline">
                            View all resources <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Impact Summary */}
                    <div className="glass rounded-3xl p-6 border border-white/50 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-secondary" />
                            <h3 className="font-bold text-gray-900">Your Impact This Month</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            {[
                                { n: "11", label: "Sessions held" },
                                { n: "3", label: "Students helped" },
                                { n: "98%", label: "Satisfaction" },
                            ].map(({ n, label }) => (
                                <div key={label} className="bg-white/60 rounded-2xl p-3">
                                    <p className="text-2xl font-extrabold text-primary">{n}</p>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
