"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Star, ChevronRight, Filter, GraduationCap, Clock, MessageSquareText } from "lucide-react";
import { type CounsellorSummary, type Specialty } from "@/app/actions/bookings";
import { createConversation } from "@/app/actions/forum";
import { useRouter } from "next/navigation";

// ── Specialty config ──────────────────────────────────────────
const ALL_SPECIALTIES: { value: Specialty | "ALL"; label: string; color: string }[] = [
    { value: "ALL", label: "All", color: "bg-slate-100 text-slate-700" },
    { value: "ANXIETY", label: "Anxiety", color: "bg-violet-100 text-violet-700" },
    { value: "STRESS", label: "Stress", color: "bg-amber-100 text-amber-700" },
    { value: "DEPRESSION", label: "Depression", color: "bg-blue-100 text-blue-700" },
    { value: "SLEEP", label: "Sleep", color: "bg-indigo-100 text-indigo-700" },
    { value: "RELATIONSHIPS", label: "Relationships", color: "bg-rose-100 text-rose-700" },
    { value: "ACADEMIC", label: "Academic", color: "bg-emerald-100 text-emerald-700" },
    { value: "GENERAL", label: "General", color: "bg-slate-100 text-slate-600" },
];

// ── Avatar placeholder ────────────────────────────────────────
function Avatar({ name, size = 56 }: { name: string; size?: number }) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = [
        "from-violet-400 to-indigo-500",
        "from-teal-400 to-emerald-500",
        "from-rose-400 to-pink-500",
        "from-amber-400 to-orange-500",
        "from-blue-400 to-cyan-500",
        "from-purple-400 to-fuchsia-500",
    ];
    const idx = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return (
        <div
            className={`rounded-2xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-extrabold flex-shrink-0`}
            style={{ width: size, height: size, fontSize: size * 0.33 }}
        >
            {initials}
        </div>
    );
}

// ── Counsellor Card ───────────────────────────────────────────
function CounsellorCard({ c, index }: { c: CounsellorSummary; index: number }) {
    const specConfig = ALL_SPECIALTIES.find(s => s.value === c.specialty);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleMessage = () => {
        startTransition(async () => {
            const res = await createConversation(c.id);
            if (res.convoId) {
                router.push("/forum");
            } else if (res.error) {
                alert(res.error);
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            className="group glass hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
        >
            {/* Card body */}
            <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <Avatar name={c.name} size={56} />
                    <div className="flex-1 min-w-0">
                        <h3 className="heading-serif text-slate-900 text-xl leading-tight mb-1">{c.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${specConfig?.color ?? "bg-slate-100 text-slate-600"}`}>
                                {specConfig?.label ?? c.specialty}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                                <Star className="w-3 h-3 fill-amber-400" /> {c.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Years exp */}
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{c.yearsExp}+ years of experience</span>
                </div>

                {/* Bio snippet */}
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {c.bio}
                </p>

                {/* Top feedback */}
                {c.topFeedback && (
                    <div className="bg-primary/5 rounded-2xl px-4 py-3 mb-4 border border-primary/10">
                        <p className="text-primary/80 text-xs font-medium italic line-clamp-2">
                            &ldquo;{c.topFeedback}&rdquo;
                        </p>
                    </div>
                )}

                <div className="mt-auto space-y-2">
                    <Link href={`/therapy/${c.id}`} className="block">
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 text-sm font-bold py-3 rounded-full hover:bg-slate-200 transition-all"
                        >
                            View Profile <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                    
                    <motion.button
                        disabled={isPending}
                        onClick={handleMessage}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#6b8f66] text-white text-sm font-bold py-3.5 rounded-full hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(138,154,134,0.35)] disabled:opacity-50"
                    >
                        {isPending ? "Connecting..." : "Message Mentor"} <MessageSquareText className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

// ── Main Grid Component ───────────────────────────────────────
interface Props { initialCounsellors: CounsellorSummary[]; }

export function CounsellorGrid({ initialCounsellors }: Props) {
    const [query, setQuery] = useState("");
    const [activeSpecialty, setActiveSpecialty] = useState<Specialty | "ALL">("ALL");

    // Client-side filter (data is already fetched server-side)
    const filtered = initialCounsellors.filter(c => {
        const matchSpec = activeSpecialty === "ALL" || c.specialty === activeSpecialty;
        const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.bio.toLowerCase().includes(query.toLowerCase());
        return matchSpec && matchQ;
    });

    return (
        <div>
            {/* Search + Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or focus area..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
                </div>
            </div>

            {/* Specialty chips */}
            <div className="flex flex-wrap gap-2 mb-8">
                {ALL_SPECIALTIES.map(s => (
                    <button
                        key={s.value}
                        onClick={() => setActiveSpecialty(s.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${activeSpecialty === s.value
                            ? "bg-gradient-to-r from-primary to-[#6b8f66] text-white border-transparent shadow-[0_4px_12px_rgba(138,154,134,0.3)]"
                            : `${s.color} border-transparent hover:border-current bg-white/60 backdrop-blur-sm`
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Result count */}
            <p className="text-xs text-slate-400 font-medium mb-5">
                Showing <span className="font-bold text-slate-700">{filtered.length}</span> specialist{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                    <motion.div
                        key="grid"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((c, i) => (
                            <CounsellorCard key={c.id} c={c} index={i} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-semibold">No specialists found</p>
                        <p className="text-slate-400 text-sm mt-1">Try a different filter or search term</p>
                        <button
                            onClick={() => { setQuery(""); setActiveSpecialty("ALL"); }}
                            className="mt-4 text-primary text-sm font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
