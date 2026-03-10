"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Star, Clock, GraduationCap, Quote,
    ChevronLeft, ChevronRight, Play, CheckCircle2,
    Calendar, FileText, Loader2, XCircle
} from "lucide-react";
import { type CounsellorFull } from "@/app/actions/bookings";
import { bookTherapist, getBookedSlots } from "@/app/actions/bookings";

// ── Helpers ───────────────────────────────────────────────────
const SPECIALTY_COLORS: Record<string, string> = {
    ANXIETY: "from-violet-500 to-indigo-600",
    STRESS: "from-amber-500 to-orange-500",
    DEPRESSION: "from-blue-500 to-cyan-600",
    SLEEP: "from-indigo-500 to-slate-600",
    RELATIONSHIPS: "from-rose-500 to-pink-600",
    ACADEMIC: "from-emerald-500 to-teal-600",
    GENERAL: "from-slate-500 to-slate-600",
};
const SPECIALTY_LABELS: Record<string, string> = {
    ANXIETY: "Anxiety", STRESS: "Stress", DEPRESSION: "Depression",
    SLEEP: "Sleep", RELATIONSHIPS: "Relationships", ACADEMIC: "Academic", GENERAL: "General",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Avatar({ name, size = 72 }: { name: string; size?: number }) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["from-violet-400 to-indigo-500", "from-teal-400 to-emerald-500", "from-rose-400 to-pink-500", "from-amber-400 to-orange-500", "from-blue-400 to-cyan-500", "from-purple-400 to-fuchsia-500"];
    const idx = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return (
        <div className={`rounded-3xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-extrabold flex-shrink-0`}
            style={{ width: size, height: size, fontSize: size * 0.3 }}>
            {initials}
        </div>
    );
}

// ── Testimonials Carousel ────────────────────────────────────
function TestimonialsCarousel({ testimonials }: { testimonials: { studentName: string; text: string; rating: number }[] }) {
    const [idx, setIdx] = useState(0);
    if (!testimonials.length) return null;
    const t = testimonials[idx];
    return (
        <div className="bg-indigo-50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Quote className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Student Testimonials</span>
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{t.studentName}</p>
                            <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />)}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => setIdx(i => (i + 1) % testimonials.length)}
                                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                        {testimonials.map((_, i) => <div key={i} className={`h-1 rounded-full flex-1 transition-all ${i === idx ? "bg-indigo-500" : "bg-indigo-200"}`} />)}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ── Time slot generator ───────────────────────────────────────
function generateSlots(startHour: number, endHour: number, date: Date, bookedTimes: Date[]): Date[] {
    const slots: Date[] = [];
    const bookedMs = new Set(bookedTimes.map(t => t.getTime()));
    let h = startHour;
    let m = 0;
    while (h < endHour || (h === endHour && m === 0)) {
        const slot = new Date(date);
        slot.setHours(h, m, 0, 0);
        if (!bookedMs.has(slot.getTime()) && slot > new Date()) slots.push(slot);
        m += 45;
        if (m >= 60) { h += 1; m -= 60; }
    }
    return slots;
}

// ── Booking Engine ────────────────────────────────────────────
function BookingEngine({ counsellor }: { counsellor: CounsellorFull }) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [bookedSlots, setBookedSlots] = useState<Date[]>([]);
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<"idle" | "loading-slots" | "confirming" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isPending, startTransition] = useTransition();

    // Build calendar grid
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = Array.from({ length: startPad }, () => null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }

    // Available days of week for this counsellor
    const availableDays = new Set(counsellor.availability.map(a => a.dayOfWeek));

    const isDayAvailable = (d: Date) =>
        availableDays.has(d.getDay()) && d >= today;

    const handleDateSelect = async (d: Date) => {
        setSelectedDate(d); setSelectedSlot(null); setStatus("loading-slots");
        const slots = await getBookedSlots(counsellor.id, d);
        setBookedSlots(slots); setStatus("idle");
    };

    const handleConfirm = () => {
        if (!selectedSlot) return;
        setStatus("confirming");
        startTransition(async () => {
            const res = await bookTherapist(counsellor.id, selectedSlot, notes);
            if (res.success) { setStatus("success"); }
            else { setStatus("error"); setErrorMsg(res.error ?? "Something went wrong."); }
        });
    };

    // Compute available time slots for selected date
    const availabilityForDay = selectedDate
        ? counsellor.availability.filter(a => a.dayOfWeek === selectedDate.getDay())
        : [];
    const timeSlots = availabilityForDay.flatMap(a =>
        generateSlots(a.startHour, a.endHour, selectedDate!, bookedSlots)
    );

    return (
        <div className="glass p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="heading-serif -mt-1 font-extrabold text-slate-900 text-xl">Book a Session</h3>
                <span className="ml-auto text-xs text-slate-400 font-medium">45-min sessions</span>
            </div>

            {status === "success" ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-xl font-extrabold text-slate-900 mb-2">Appointment Confirmed!</h4>
                    <p className="text-slate-500 text-sm mb-1">
                        {selectedSlot?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <p className="text-indigo-600 font-bold text-sm mb-5">
                        {selectedSlot?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} with {counsellor.name}
                    </p>
                    <p className="text-xs text-slate-400">You&apos;ll receive a confirmation on your dashboard.</p>
                    <Link href="/dashboard/student">
                        <button className="mt-5 text-sm font-bold text-indigo-600 hover:underline">← Back to Dashboard</button>
                    </Link>
                </motion.div>
            ) : (
                <>
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-slate-800">
                            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAY_NAMES.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>)}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-5">
                        {days.map((d, i) => {
                            if (!d) return <div key={i} />;
                            const isAvail = isDayAvailable(d);
                            const isSelected = selectedDate?.toDateString() === d.toDateString();
                            return (
                                <button key={i} onClick={() => isAvail && handleDateSelect(d)} disabled={!isAvail}
                                    className={`aspect-square rounded-xl text-xs font-semibold transition-all duration-150 ${isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : isAvail ? "hover:bg-indigo-50 text-slate-700"
                                            : "text-slate-300 cursor-not-allowed"
                                        }`}>
                                    {d.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Available Slots — {selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                            </p>
                            {status === "loading-slots" ? (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[...Array(6)].map((_, i) => <div key={i} className="h-9 bg-slate-100 rounded-xl animate-pulse" />)}
                                </div>
                            ) : timeSlots.length === 0 ? (
                                <p className="text-xs text-slate-400 mb-4 py-3 text-center bg-slate-50 rounded-xl">
                                    No slots available for this date
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {timeSlots.map(slot => {
                                        const isSelected = selectedSlot?.getTime() === slot.getTime();
                                        return (
                                            <button key={slot.getTime()} onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? "bg-indigo-600 text-white shadow-sm" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                                    }`}>
                                                {slot.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Notes */}
                    {selectedSlot && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                <FileText className="w-3.5 h-3.5" /> What&apos;s on your mind?
                            </label>
                            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Brief context about what you'd like to discuss — helps the therapist prepare..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" />
                        </motion.div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                        {status === "error" && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
                                <XCircle className="w-3.5 h-3.5 flex-shrink-0" />{errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Confirm button */}
                    <motion.button
                        onClick={handleConfirm}
                        disabled={!selectedSlot || isPending || status === "confirming"}
                        whileHover={selectedSlot ? { scale: 1.02 } : {}}
                        whileTap={selectedSlot ? { scale: 0.97 } : {}}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#6b8f66] text-white font-bold py-3.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(138,154,134,0.35)]"
                    >
                        {status === "confirming"
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing Match...</>
                            : <><Calendar className="w-4 h-4" /> Confirm Appointment</>
                        }
                    </motion.button>
                    {!selectedDate && (
                        <p className="text-center text-xs text-slate-400 mt-2">← Select a highlighted date to see available slots</p>
                    )}
                </>
            )}
        </div>
    );
}

// ── Main Profile Component ────────────────────────────────────
interface Props { counsellor: CounsellorFull }

export function TherapistProfile({ counsellor }: Props) {
    const gradClass = SPECIALTY_COLORS[counsellor.specialty] ?? "from-indigo-500 to-violet-600";
    const specLabel = SPECIALTY_LABELS[counsellor.specialty] ?? counsellor.specialty;

    return (
        <div className="min-h-screen py-6">
            {/* Hero bar */}
            <div className={`bg-gradient-to-r ${gradClass} text-white max-w-7xl mx-auto rounded-3xl shadow-lg border border-white/20 sm:mx-6 lg:mx-8 mb-8`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <Link href="/therapy/browse" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to all specialists
                    </Link>
                    <div className="flex items-start gap-5">
                        <Avatar name={counsellor.name} size={80} />
                        <div>
                            <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold leading-tight">{counsellor.name}</h1>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="bg-white/25 text-xs font-bold px-3 py-1 rounded-full">{specLabel}</span>
                                <span className="flex items-center gap-1 text-sm font-bold">
                                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> {counsellor.rating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-white/80">
                                    <Clock className="w-4 h-4" /> {counsellor.yearsExp}+ years
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left column ── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Bio */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                            className="glass p-6">
                            <h2 className="font-extrabold text-slate-900 text-lg mb-3">About {counsellor.name.split(" ")[0]}</h2>
                            <p className="text-slate-600 text-sm leading-relaxed">{counsellor.bio}</p>
                        </motion.div>

                        {/* Philosophy + Video */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="glass p-6">
                            <h2 className="font-extrabold text-slate-900 text-lg mb-3">My Philosophy</h2>
                            <blockquote className="border-l-4 border-indigo-400 pl-4 text-slate-600 text-sm italic leading-relaxed mb-5">
                                &ldquo;{counsellor.philosophy}&rdquo;
                            </blockquote>
                            {counsellor.videoUrl ? (
                                <>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        <Play className="w-3.5 h-3.5 inline mr-1" />Philosophy Introduction
                                    </p>
                                    <div className="rounded-2xl overflow-hidden aspect-video bg-slate-900">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${counsellor.videoUrl}?rel=0&modestbranding=1`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={`${counsellor.name} intro video`}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl bg-slate-50 aspect-video flex flex-col items-center justify-center text-slate-400">
                                    <Play className="w-10 h-10 opacity-30 mb-2" />
                                    <p className="text-sm">Introduction video coming soon</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Qualifications */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="glass p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="w-5 h-5 text-indigo-600" />
                                <h2 className="font-extrabold text-slate-900 text-lg">Qualifications</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {counsellor.qualifications.map((q, i) => (
                                    <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.05 }}
                                        className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 text-xs font-semibold px-3.5 py-2 rounded-xl border border-indigo-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                        {q}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Testimonials */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <TestimonialsCarousel testimonials={counsellor.testimonials} />
                        </motion.div>
                    </div>

                    {/* ── Right column — Booking Engine ── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
                        <BookingEngine counsellor={counsellor} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
