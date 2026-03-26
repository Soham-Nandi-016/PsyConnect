"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, MessageSquare, Clock, CheckCircle2,
    Star, TrendingUp, ArrowRight, User, Bell, BookOpen,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getMentorDashboardData, acceptBooking } from "@/app/actions/mentor";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/Providers/SocketProvider";

export default function SeniorDashboardPage() {
    const { data: session, status } = useSession();
    const { socket, onlineUsers } = useSocket();
    const router = useRouter();
    const [isPendingAccept, startTransition] = useTransition();

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const res = await getMentorDashboardData();
        if (res) {
            setData(res);
            if (socket && res.counsellorId) {
                socket.emit("join-room", `mentor_${res.counsellorId}`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("new-booking", () => {
                fetchData();
            });
            return () => {
                socket.off("new-booking");
            };
        }
    }, [socket]);

    const handleAccept = async (bookingId: string) => {
        startTransition(async () => {
            const res = await acceptBooking(bookingId);
            if (res.success) {
                // Refresh data and redirect to chat
                await fetchData();
                router.push(`/forum?id=${res.conversationId}`);
            }
        });
    };

    const Skeleton = ({ className }: { className?: string }) => (
        <div className={`animate-pulse bg-gray-100 rounded-2xl ${className}`} />
    );

    if (status === "loading" || (isLoading && !data)) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-24 h-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="w-48 h-8" />
                            <Skeleton className="w-64 h-4" />
                        </div>
                    </div>
                </div>

                {/* Stats Row Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/80 rounded-3xl border border-white p-6 flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-12 h-6" />
                                <Skeleton className="w-20 h-3" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Requests Sidebar Skeleton */}
                    <div className="lg:col-span-1 bg-white/60 rounded-[2.5rem] border border-white overflow-hidden p-6 space-y-6">
                        <Skeleton className="w-32 h-6 mb-4" />
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-3/4 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Mentees List Skeleton */}
                    <div className="lg:col-span-2 bg-white/60 rounded-[2.5rem] border border-white overflow-hidden p-8 space-y-8">
                        <Skeleton className="w-48 h-6 mb-4" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-6">
                                <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="w-1/3 h-5" />
                                    <Skeleton className="w-full h-2 rounded-full" />
                                </div>
                                <Skeleton className="w-24 h-10 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!session || (session.user as any).role !== "COUNSELLOR") {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Unauthorized</h2>
                <p>Please log in as a mentor to view this page.</p>
            </div>
        );
    }

    const PENDING_REQUESTS = data?.pendingRequests || [];
    const ACTIVE_MENTEES = data?.activeMentees || [];
    const STATS_DATA = data?.stats || { activeMentees: 0, sessionsThisMonth: 0, rating: 5.0 };

    const STATS = [
        { label: "Active Mentees", value: STATS_DATA.activeMentees.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
        { label: "Sessions (30d)", value: STATS_DATA.sessionsThisMonth.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Avg. Response Time", value: "< 2h", icon: Clock, color: "text-violet-600", bg: "bg-violet-50" },
        { label: "Mentor Rating", value: `${STATS_DATA.rating.toFixed(1)}★`, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-secondary to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-secondary/20 border-4 border-white overflow-hidden">
                        {session.user?.image ? (
                           <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <User className="w-12 h-12" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome, {session.user?.name?.split(" ")[0]}</h1>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-200">Mentor</span>
                        </div>
                        <p className="text-foreground/50 font-medium">Your guidance makes a difference today.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-3 rounded-2xl bg-white border border-black/5 shadow-sm hover:bg-gray-50 transition-all">
                        <Bell className="w-5 h-5 text-foreground/60" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </button>
                    <button className="bg-secondary text-white font-bold px-6 py-3 rounded-2xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
                        Profile Settings <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {STATS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all"
                        >
                            <div className={`${stat.bg} p-3.5 rounded-2xl flex-shrink-0`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-black text-gray-900 leading-none mb-1">{stat.value}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Main Grid: Sidebar + Content ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Pending Requests Sidebar ── */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-white/40">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                            <h2 className="font-bold text-gray-900 text-lg">New Requests</h2>
                        </div>
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-100">
                             {PENDING_REQUESTS.length} Pending
                        </span>
                    </div>

                    <div className="flex-1 divide-y divide-black/5 max-h-[500px] overflow-y-auto">
                        {PENDING_REQUESTS.length > 0 ? PENDING_REQUESTS.map((req: any) => (
                            <div key={req.id} className="px-6 py-5 hover:bg-white transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black text-lg flex-shrink-0 border border-white shadow-sm overflow-hidden">
                                        {req.student.image ? (
                                            <img src={req.student.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            req.student.name?.[0] || "?"
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <p className="font-bold text-gray-900 text-[15px]">{req.student.name}</p>
                                            <span className="text-[10px] text-gray-400 font-medium">New</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">Student</span>
                                            <span className="text-[10px] text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed italic bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/30">
                                            "{req.studentNotes || "Requesting mentorship session"}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button 
                                        disabled={isPendingAccept}
                                        onClick={() => handleAccept(req.id)}
                                        className="flex-1 text-xs font-black bg-primary text-white py-2.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isPendingAccept ? <Loader2 className="w-3 h-3 animate-spin" /> : "Accept Request"}
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center">
                                <p className="text-sm text-gray-400 font-medium">No pending requests at the moment.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Active Mentees ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-white/40">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="font-bold text-gray-900 text-lg tracking-tight">Recently Active Students</h2>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{ACTIVE_MENTEES.length} Mentees</span>
                    </div>

                    <div className="flex-1 divide-y divide-black/5">
                        {ACTIVE_MENTEES.length > 0 ? ACTIVE_MENTEES.map((mentee: any, i: number) => (
                            <motion.div
                                key={mentee.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="px-8 py-6 flex items-center gap-6 hover:bg-white/80 transition-all group"
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black flex-shrink-0 text-xl border-2 border-white shadow-md overflow-hidden">
                                        {mentee.student.image ? (
                                            <img src={mentee.student.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            mentee.student.name?.[0] || "?"
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {onlineUsers.has(mentee.student.id) && (
                                            <motion.div 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm z-10" 
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-extrabold text-gray-900 text-lg">{mentee.student.name}</p>
                                        {onlineUsers.has(mentee.student.id) && (
                                            <span className="text-[9px] bg-emerald-50 text-emerald-600 font-black px-1.5 py-0.5 rounded-md border border-emerald-100 uppercase tracking-tighter">Online</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">
                                        Last: {mentee.messages[0]?.content || "No messages yet"}
                                    </p>

                                    {/* Mood Progress bar */}
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-40 border border-black/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000"
                                                style={{ width: `75%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">75%</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(mentee.updatedAt).toLocaleDateString()}</span>
                                    <Link href={`/forum?id=${mentee.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 bg-white text-primary text-[11px] font-black px-5 py-2.5 rounded-xl shadow-sm border border-black/5 hover:border-primary/20 hover:text-primary transition-all"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Open Chat
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">No active mentees yet. Accept a request to get started.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Resources & Insights Row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Mentor Tips */}
                    <div className="bg-gradient-to-br from-[#f8faf7] to-[#f4f7f2] rounded-[2.5rem] p-8 border border-[#e8efe6] shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-lg">Knowledge Toolkit</h3>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Handling Academic Disclosure of Burnout",
                                "Active Listening in Digital Spaces",
                                "Maintaining Mentor-Student Boundaries",
                            ].map((tip) => (
                                <li key={tip} className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-white group hover:border-primary/20 transition-all cursor-default">
                                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{tip}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-black text-primary px-2 py-1 hover:gap-3 transition-all">
                            Explore Resources <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Impact Summary */}
                    <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-lg">Monthly Engagement</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {[
                                    { n: STATS_DATA.sessionsThisMonth, label: "Messages" },
                                    { n: STATS_DATA.activeMentees, label: "Mentees" },
                                    { n: "100%", label: "Impact" },
                                ].map(({ n, label }) => (
                                    <div key={label} className="bg-white/80 rounded-3xl p-5 border border-white shadow-sm">
                                        <p className="text-3xl font-black text-primary mb-1">{n}</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 bg-black/5 p-6 rounded-3xl border border-white/5">
                            <p className="text-sm font-bold text-foreground/70 text-center leading-relaxed">
                                "You've successfully addressed <span className="text-primary">{STATS_DATA.sessionsThisMonth}</span> concerns this month. Keep up the amazing work!"
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
