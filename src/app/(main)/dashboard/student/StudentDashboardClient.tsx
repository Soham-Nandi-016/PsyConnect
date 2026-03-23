"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    BrainCircuit, TrendingUp, Sparkles, Calendar,
    Activity, PenLine, Clock, Star, CheckCircle2,
    X, ArrowRight, MessageSquare, User, BookOpen,
    HeartPulse, ChevronRight, ChevronLeft, Loader2,
    Moon, Dumbbell, Brain, AlertCircle
} from "lucide-react";
import { logMood, bookSession } from "@/app/actions/dashboard";
import { predictAndSave, type WellnessInput } from "@/app/actions/ai-predict";

// ─── Types ──────────────────────────────────────────────────
interface MoodLog { moodScore: number; stressScore: number | null; createdAt: Date; }
interface UpcomingBooking { id: string; appointmentTime: Date; status: string; notes: string | null; counsellor: { name: string | null; email: string }; }
interface Counsellor { id: string; name: string | null; email: string; }

interface Props {
    userName: string;
    userRole: string;
    moodLogs: MoodLog[];
    upcomingBooking: UpcomingBooking | null;
    counsellors: Counsellor[];
    todayPrompt: string;
}

// ─── Helpers ────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function fmtDay(d: Date) { return DAYS[new Date(d).getDay()]; }

function stressMeta(score: number) {
    if (score < 35) return { bar: "from-emerald-400 to-teal-500", text: "text-emerald-500", ring: "#10b981", label: "Low", bg: "bg-emerald-50" };
    if (score < 65) return { bar: "from-amber-400 to-orange-400", text: "text-amber-500", ring: "#f59e0b", label: "Moderate", bg: "bg-amber-50" };
    return { bar: "from-red-400 to-rose-500", text: "text-red-500", ring: "#ef4444", label: "High", bg: "bg-red-50" };
}

const SPECIALTIES = ["Anxiety & Stress", "Academic Pressure", "Relationships & Social Anxiety", "Sleep & Burnout", "Depression Support"];

// ─── Circular SVG Gauge ─────────────────────────────────────
function Gauge({ value, label, ringColor, size = 100 }: { value: number; label: string; ringColor: string; size?: number }) {
    const R = 38, C = 2 * Math.PI * R;
    const offset = ((100 - value) / 100) * C;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
                    <circle cx="45" cy="45" r={R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <motion.circle
                        cx="45" cy="45" r={R}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        initial={{ strokeDashoffset: C }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-800">{value}%</span>
                </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 text-center leading-tight">{label}</p>
        </div>
    );
}

// ─── Mini SVG Line Chart ─────────────────────────────────────
function MiniChart({ logs }: { logs: MoodLog[] }) {
    if (!logs.length) return (
        <div className="flex flex-col items-center justify-center h-36 gap-2 text-slate-400">
            <TrendingUp className="w-8 h-8 opacity-30" />
            <p className="text-sm">Log your mood to see trends</p>
        </div>
    );

    const W = 400, H = 100, P = 16;
    const scores = logs.map(l => l.moodScore);
    const min = Math.min(...scores) - 0.5;
    const max = Math.max(...scores) + 0.5;
    const toX = (i: number) => P + (i / Math.max(logs.length - 1, 1)) * (W - P * 2);
    const toY = (v: number) => H - P - ((v - min) / (max - min)) * (H - P * 2);
    const pts = logs.map((l, i) => `${toX(i)},${toY(l.moodScore)}`).join(" ");
    const area = [`${toX(0)},${H}`, ...logs.map((l, i) => `${toX(i)},${toY(l.moodScore)}`), `${toX(logs.length - 1)},${H}`].join(" ");

    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                <polygon points={area} fill="url(#areaGrad)" />
                <polyline points={pts} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {logs.map((l, i) => (
                    <circle key={i} cx={toX(i)} cy={toY(l.moodScore)} r="4.5" fill="white" stroke="#8b5cf6" strokeWidth="2" />
                ))}
            </svg>
            <div className="flex justify-between px-4 mt-1">
                {logs.map((l, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-medium">{fmtDay(l.createdAt)}</span>
                ))}
            </div>
        </div>
    );
}

// ─── Booking Modal ───────────────────────────────────────────
function BookingModal({ counsellors, onClose }: { counsellors: Counsellor[]; onClose: () => void }) {
    const [selectedId, setSelectedId] = useState(counsellors[0]?.id ?? "");
    const [dateStr, setDateStr] = useState("");
    const [notes, setNotes] = useState("");
    const [isPending, startTransition] = useTransition();
    const [done, setDone] = useState(false);

    const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
    const minStr = minDate.toISOString().slice(0, 16);

    const handleBook = () => {
        if (!selectedId || !dateStr) return;
        startTransition(async () => {
            await bookSession(selectedId, new Date(dateStr), notes);
            setDone(true);
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div initial={{ scale: 0.9, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/50 relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                {done ? (
                    <div className="text-center py-6">
                        <CheckCircle2 className="w-14 h-14 text-teal-500 mx-auto mb-3" />
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Session Booked!</h3>
                        <p className="text-slate-500 text-sm mb-5">Your request is submitted. You'll get a confirmation soon.</p>
                        <button onClick={onClose} className="bg-gradient-to-r from-primary to-[#6b8f66] text-white px-6 py-2.5 rounded-full font-bold shadow-[0_4px_14px_rgba(138,154,134,0.35)]">Done</button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Book a Session</h3>
                        <p className="text-slate-400 text-sm mb-5">Choose a mentor and your preferred time.</p>

                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Mentor</label>
                        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                            {counsellors.length === 0
                                ? <p className="text-sm text-slate-400">No counsellors available.</p>
                                : counsellors.map(c => (
                                    <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedId === c.id ? "border-primary bg-primary/5" : "border-slate-100"}`}>
                                        <input type="radio" name="c" value={c.id} checked={selectedId === c.id} onChange={() => setSelectedId(c.id)} className="hidden" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-bold text-sm">
                                            {(c.name ?? c.email)[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm">{c.name ?? "Mentor"}</p>
                                            <p className="text-xs text-slate-400 truncate">{c.email}</p>
                                        </div>
                                        {selectedId === c.id && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                                    </label>
                                ))
                            }
                        </div>

                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date & Time</label>
                        <input type="datetime-local" min={minStr} value={dateStr} onChange={e => setDateStr(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40" />

                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Notes <span className="font-normal text-slate-400 normal-case">(optional)</span></label>
                        <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="What would you like to discuss?"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 mb-5" />

                        <button onClick={handleBook} disabled={!selectedId || !dateStr || isPending}
                            className="w-full bg-gradient-to-r from-primary to-[#6b8f66] text-white py-3.5 rounded-full font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(138,154,134,0.35)] transition-all">
                            {isPending ? "Booking..." : <><CheckCircle2 className="w-4 h-4" /> Confirm Booking</>}
                        </button>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Slider helper ───────────────────────────────────────────
function Slider({ label, value, min, max, step = 1, unit = "", onChange }: {
    label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="font-bold text-indigo-600">{value}{unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{min}{unit}</span><span>{max}{unit}</span>
            </div>
        </div>
    );
}

// ─── 4-Step Wellness Journey Modal ───────────────────────────
type AgeGroup = "18-20" | "21-23" | "24-26" | "27+";

function WellnessJourneyModal({
    onClose, onComplete, moodTrend7D
}: {
    onClose: () => void;
    onComplete: (stressScore: number, label: string, aiDown: boolean) => void;
    moodTrend7D: number;
}) {
    const TOTAL_STEPS = 4;
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeProgress, setAnalyzeProgress] = useState(0);
    const [validationError, setValidationError] = useState("");
    const [isPending, startTransition] = useTransition();

    // Form state
    const [moodScore, setMoodScore] = useState<number | null>(null); // null forces user to pick
    const [journalEntry, setJournalEntry] = useState("");
    const [sleepDuration, setSleepDuration] = useState(7);
    const [sleepLatency, setSleepLatency] = useState(15);
    const [studyLoad, setStudyLoad] = useState(6);
    const [socialInteraction, setSocialInteraction] = useState(6);
    const [financialStress, setFinancialStress] = useState(4);
    const [physicalActivity, setPhysicalActivity] = useState(30);
    const [screenTime, setScreenTime] = useState(5);
    const [ageGroup, setAgeGroup] = useState<AgeGroup>("21-23");

    const MOOD_EMOJIS = [
        { e: "😭", s: 1, l: "Terrible" },
        { e: "😟", s: 3, l: "Down" },
        { e: "😐", s: 5, l: "Okay" },
        { e: "🙂", s: 7, l: "Good" },
        { e: "🤩", s: 9, l: "Amazing" },
    ];

    const stepTitles = ["Mood & Journal", "Sleep Metrics", "Academic & Life", "Habits"];
    const stepIcons = [Activity, Moon, Brain, Dumbbell];
    const stepIconColors = ["text-violet-500", "text-blue-500", "text-amber-500", "text-emerald-500"];

    // Validate required fields for current step
    const validate = (s: number): string => {
        if (s === 1 && moodScore === null) return "Please select how you're feeling before continuing.";
        return "";
    };

    // User Debugging Logger
    console.log("Current State:", { moodScore, sleepDuration, sleepLatency, journalEntry });

    const handleNext = () => {
        const err = validate(step);
        if (err) { setValidationError(err); return; }
        setValidationError("");
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setValidationError("");
        setStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        setIsAnalyzing(true);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 18;
            if (p >= 95) { clearInterval(interval); p = 95; }
            setAnalyzeProgress(Math.round(p));
        }, 200);

        const input: WellnessInput = {
            moodScore: moodScore ?? 5,
            journalEntry, sleepDuration, sleepLatency,
            studyLoad, socialInteraction, financialStress,
            physicalActivity, screenTime, ageGroup,
            moodTrend7D,
        };

        startTransition(async () => {
            const result = await predictAndSave(input);
            clearInterval(interval);
            setAnalyzeProgress(100);
            setTimeout(() => {
                onComplete(
                    result.success && result.stressScore !== undefined ? result.stressScore : 50,
                    result.label ?? "Moderate",
                    !result.success || result.error === "AI_DOWN"
                );
            }, 700);
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && !isAnalyzing && onClose()}
        >
            <motion.div initial={{ scale: 0.92, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/60 relative overflow-hidden flex flex-col"
                style={{ maxHeight: "90vh" }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5 border-b border-slate-100 flex-shrink-0 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-extrabold text-slate-900 text-lg">Wellness Journey</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}</p>
                        </div>
                        {!isAnalyzing && (
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {/* Numbered step circles with connector lines */}
                    <div className="flex items-center">
                        {stepTitles.map((title, i) => {
                            const StepIcon = stepIcons[i];
                            const isDone = i + 1 < step;
                            const isActive = i + 1 === step;
                            return (
                                <div key={i} className="flex items-center flex-1 min-w-0">
                                    <div className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all duration-300 ${isActive ? "scale-110" : ""}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isDone ? "bg-primary border-primary text-white"
                                            : isActive ? "bg-white border-primary text-primary shadow-md shadow-primary/20"
                                                : "bg-white border-slate-200 text-slate-300"
                                            }`}>
                                            {isDone
                                                ? <CheckCircle2 className="w-4 h-4" />
                                                : <StepIcon className={`w-3.5 h-3.5 ${isActive ? stepIconColors[i] : ""}`} />
                                            }
                                        </div>
                                        <span className={`text-[9px] font-semibold hidden sm:block truncate max-w-[56px] text-center leading-none ${isActive ? "text-primary" : isDone ? "text-primary/60" : "text-slate-300"
                                            }`}>{title.split(" ")[0]}</span>
                                    </div>
                                    {i < TOTAL_STEPS - 1 && (
                                        <div className={`h-0.5 flex-1 mx-1.5 rounded-full transition-all duration-500 ${isDone ? "bg-primary" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="px-6 py-6">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {isAnalyzing ? (
                                /* ── Analyzing Screen ── */
                                <motion.div key="analyzing"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-8"
                                >
                                    <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                                        <BrainCircuit className="w-10 h-10 text-primary" />
                                    </motion.div>
                                    <h3 className="text-lg font-extrabold text-slate-800 mb-1">Analyzing your patterns...</h3>
                                    <p className="text-slate-400 text-sm mb-6">Our AI is processing your wellness data.</p>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                                        <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                            animate={{ width: `${analyzeProgress}%` }} transition={{ duration: 0.3 }} />
                                    </div>
                                    <p className="text-xs text-slate-400">{analyzeProgress}% complete</p>
                                </motion.div>
                            ) : step === 1 ? (
                                /* ── Step 1: Mood & Journal ── */
                                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                                    <p className="text-sm font-semibold text-slate-600 mb-4">How are you feeling right now?</p>
                                    <div className="flex justify-between mb-5 bg-slate-50 rounded-2xl p-3">
                                        {MOOD_EMOJIS.map(({ e, s, l }) => (
                                            <button key={s} type="button" onClick={() => { setMoodScore(s); setValidationError(""); }}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl flex-1 transition-all duration-200 border-2 ${moodScore === s ? "bg-indigo-50 border-indigo-600 shadow-md scale-105" : "bg-white border-transparent hover:border-slate-200"
                                                    }`}>
                                                <span className="text-3xl leading-none">{e}</span>
                                                <span className={`text-[10px] font-bold ${moodScore === s ? "text-primary" : "text-slate-400"}`}>{l}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Journal Entry <span className="font-normal text-slate-400 normal-case">(optional — used for AI sentiment)</span></label>
                                    <textarea rows={4} value={journalEntry} onChange={e => setJournalEntry(e.target.value)}
                                        placeholder="How has your day been? What's on your mind? Any recent wins or worries?"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />

                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mt-4 mb-2">Age Group</label>
                                    <div className="flex gap-2">
                                        {(["18-20", "21-23", "24-26", "27+"] as AgeGroup[]).map(ag => (
                                            <button key={ag} onClick={() => setAgeGroup(ag)}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${ageGroup === ag ? "border-primary bg-primary/10 text-primary" : "border-slate-100 text-slate-500"
                                                    }`}>{ag}</button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : step === 2 ? (
                                /* ── Step 2: Sleep Metrics ── */
                                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="space-y-6">
                                    <p className="text-sm font-semibold text-slate-600 -mb-2">Tell us about last night's sleep.</p>
                                    <Slider label="Sleep Duration" value={sleepDuration} min={0} max={12} step={0.5} unit="h" onChange={setSleepDuration} />
                                    <Slider label="Time to Fall Asleep" value={sleepLatency} min={0} max={90} unit=" min" onChange={setSleepLatency} />
                                    <div className="flex flex-col gap-2">
                                        <div className={`rounded-2xl px-4 py-3 text-xs font-semibold ${sleepDuration >= 7 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                            {sleepDuration >= 7
                                                ? `✅ ${sleepDuration}h is great! Adults need 7–9 hours.`
                                                : `⚠️ ${sleepDuration}h is below recommended. Sleep deprivation raises stress significantly.`}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-3 text-xs font-semibold ${sleepLatency <= 20 ? "bg-emerald-50 text-emerald-600" : sleepLatency > 45 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                            {sleepLatency <= 20
                                                ? `✅ ${sleepLatency} mins is a healthy fall-sleep time.`
                                                : sleepLatency > 45
                                                ? `🚨 ${sleepLatency} mins might indicate insomnia. This often correlates with high anxiety.`
                                                : `⚠️ ${sleepLatency} mins is slightly elevated. A wind-down routine could help.`}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : step === 3 ? (
                                /* ── Step 3: Academic & Life ── */
                                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="space-y-6">
                                    <p className="text-sm font-semibold text-slate-600 -mb-2">How is life outside the bedroom?</p>
                                    <Slider label="Study / Work Load" value={studyLoad} min={1} max={10} onChange={setStudyLoad} />
                                    <Slider label="Social Interaction Quality" value={socialInteraction} min={1} max={10} onChange={setSocialInteraction} />
                                    <Slider label="Financial Stress" value={financialStress} min={1} max={10} onChange={setFinancialStress} />
                                </motion.div>
                            ) : (
                                /* ── Step 4: Habits ── */
                                <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="space-y-6">
                                    <p className="text-sm font-semibold text-slate-600 -mb-2">Almost done — your daily habits.</p>
                                    <Slider label="Physical Activity" value={physicalActivity} min={0} max={180} unit=" min" onChange={setPhysicalActivity} />
                                    <Slider label="Screen Time" value={screenTime} min={0} max={16} step={0.5} unit="h" onChange={setScreenTime} />
                                    <div className={`rounded-2xl px-4 py-3 text-xs font-semibold ${physicalActivity >= 30 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        }`}>
                                        {physicalActivity >= 30
                                            ? "✅ Great! Regular exercise is one of the best stress reducers."
                                            : "⚠️ Even 10–15 min of walking a day can significantly lower stress."}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Validation error banner */}
                        <AnimatePresence>
                            {validationError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                    className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5 rounded-xl"
                                >
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {validationError}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Stable footer — OUTSIDE AnimatePresence, always clickable ── */}
                {!isAnalyzing && (
                    <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white/80 rounded-b-3xl">
                        <button
                            type="button"
                            onClick={step > 1 ? handleBack : onClose}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {step === 1 ? "Cancel" : "Back"}
                        </button>

                        <span className="text-[11px] font-bold text-slate-300">{step} / {TOTAL_STEPS}</span>

                        {step < TOTAL_STEPS ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#6b8f66] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_14px_rgba(138,154,134,0.30)]"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_4px_16px_rgba(138,154,134,0.35)]"
                            >
                                {isPending
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                                    : <><BrainCircuit className="w-4 h-4" /> Analyze My Wellness</>
                                }
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─── Result Card shown after AI analysis ─────────────────────
function AIResultCard({ stressScore, label, aiDown, onDismiss }: {
    stressScore: number; label: string; aiDown: boolean; onDismiss: () => void;
}) {
    const sm = stressMeta(stressScore);
    return (
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 border ${sm.bg} flex flex-col gap-2`}>
            {aiDown && (
                <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Our AI is resting. Score estimated — please try again in a moment.
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">AI Stress Score</p>
                    <p className={`text-3xl font-extrabold ${sm.text}`}>{stressScore}<span className="text-base font-semibold">%</span></p>
                    <p className={`text-xs font-bold ${sm.text}`}>{label} Stress</p>
                </div>
                <CheckCircle2 className={`w-8 h-8 ${sm.text} opacity-60`} />
            </div>
            <button onClick={onDismiss} className="text-xs font-semibold text-slate-400 hover:text-slate-600 text-right">
                Dismiss ×
            </button>
        </motion.div>
    );
}

// ─── Main Client Component ──────────────────────────────────
export function StudentDashboardClient({ userName, userRole, moodLogs, upcomingBooking, counsellors, todayPrompt }: Props) {
    const [reflection, setReflection] = useState("");
    const [showBooking, setShowBooking] = useState(false);
    const [showWellness, setShowWellness] = useState(false);
    const [aiResult, setAiResult] = useState<{ score: number; label: string; aiDown: boolean } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, startTransition] = useTransition();

    // ── Derived wellness values — live-updateable ──
    const latestLog = moodLogs.length ? moodLogs[moodLogs.length - 1] : null;
    const baseStress = latestLog?.stressScore ?? 42;
    const baseMoodScore = latestLog?.moodScore ?? null;

    // Live stress overrides the DB value after AI scan
    const latestStress = aiResult?.score ?? baseStress;
    const moodPercent = baseMoodScore ? Math.round((baseMoodScore / 10) * 100) : 50;
    const sm = stressMeta(latestStress);

    // Mood trend: average of all logs
    const moodTrend7D = moodLogs.length
        ? parseFloat((moodLogs.reduce((acc, l) => acc + l.moodScore, 0) / moodLogs.length).toFixed(1))
        : 5;

    const recommendedCounsellor = counsellors[0];
    const recommendedSpecialty = latestStress >= 65 ? SPECIALTIES[0] : latestStress >= 40 ? SPECIALTIES[1] : SPECIALTIES[4];
    const firstName = userName.split(" ")[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const handleWellnessComplete = (score: number, label: string, aiDown: boolean) => {
        setShowWellness(false);
        setAiResult({ score, label, aiDown });
    };

    return (
        <>
            <AnimatePresence>
                {showBooking && <BookingModal counsellors={counsellors} onClose={() => setShowBooking(false)} />}
                {showWellness && (
                    <WellnessJourneyModal
                        onClose={() => setShowWellness(false)}
                        onComplete={handleWellnessComplete}
                        moodTrend7D={moodTrend7D}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

                {/* ── Page Header ── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{greeting} 👋</p>
                            <h1 className="heading-serif text-2xl sm:text-3xl text-foreground leading-tight">Hello, {firstName}!</h1>
                            <p className="text-slate-400 text-xs font-medium">{userRole === "COUNSELLOR" ? "Counsellor" : "Student"} • PsyConnect</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/resources">
                            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white/60 backdrop-blur-sm border border-white/50 px-4 py-2 rounded-full hover:bg-white/80 transition-all shadow-sm">
                                <BookOpen className="w-4 h-4" /> Resources
                            </button>
                        </Link>
                        <Link href="/forum">
                            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white/60 backdrop-blur-sm border border-white/50 px-4 py-2 rounded-full hover:bg-white/80 transition-all shadow-sm">
                                <MessageSquare className="w-4 h-4" /> Forum
                            </button>
                        </Link>
                        <button onClick={() => setShowBooking(true)}
                            className="flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-[#6b8f66] px-5 py-2 rounded-full hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(138,154,134,0.35)]">
                            <Calendar className="w-4 h-4" /> Book Session
                        </button>
                    </div>
                </motion.div>

                {/* ── Two-Column Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ═══════════════════════════════════════════════════════
                        MAIN COLUMN (Left 2/3) — Analytics & Insights
                    ════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* ── Mood & Stress Analysis Card ── */}
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                            className="glass p-6"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <BrainCircuit className="w-5 h-5 text-violet-500" />
                                <h2 className="text-base font-bold text-slate-800">Mood & Stress Analysis</h2>
                                <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${sm.bg} ${sm.text}`}>
                                    {sm.label} Stress
                                </span>
                            </div>

                            {/* Gauges row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <Gauge value={latestStress} label="Stress Level" ringColor={sm.ring} />
                                <Gauge value={moodPercent} label="Mood Score" ringColor="#8b5cf6" />
                                <div className="col-span-2 flex flex-col justify-center gap-3">
                                    {/* Stress bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Stress</span>
                                            <span className={`font-bold ${sm.text}`}>{latestStress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${latestStress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full bg-gradient-to-r ${sm.bar}`} />
                                        </div>
                                    </div>
                                    {/* Mood bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Mood</span>
                                            <span className="font-bold text-violet-500">{moodPercent}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${moodPercent}%` }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500" />
                                        </div>
                                    </div>
                                    {latestLog && (
                                        <p className="text-[10px] text-slate-400">
                                            Last logged: {new Date(latestLog.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* AI Insight pill */}
                            <div className={`rounded-2xl px-4 py-3 ${sm.bg} border border-opacity-20`}>
                                <p className={`text-xs font-semibold ${sm.text}`}>
                                    {latestStress < 35
                                        ? "✅ You're doing well! Your stress levels are manageable. Keep the momentum going."
                                        : latestStress < 65
                                            ? "⚠️ Moderate stress detected. Consider a short break, breathing exercise, or reaching out to a peer."
                                            : "🚨 High stress levels detected. Please consider booking a session with a counsellor or visiting our Crisis page."}
                                </p>
                            </div>
                        </motion.div>

                        {/* ── 7-Day Mood Trend Chart ── */}
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                            className="glass p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <h2 className="text-base font-bold text-slate-800">7-Day Mood Trend</h2>
                                <span className="ml-auto text-[10px] text-slate-400 font-medium">
                                    {moodLogs.length} / 7 entries
                                </span>
                            </div>
                            <MiniChart logs={moodLogs} />
                            <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" /> Mood (1–10)</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white border border-violet-400 inline-block" /> Data point</span>
                            </div>
                        </motion.div>


                        {/* ── Smart Match — Therapist Discovery ── */}
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-lg shadow-indigo-200 p-6 text-white"
                        >
                            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-4 h-4 text-indigo-200" />
                                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">AI Smart Match</span>
                                    </div>
                                    <h3 className="font-extrabold text-lg leading-tight mb-1">Find Your Ideal Support</h3>
                                    <p className="text-indigo-100 text-xs leading-relaxed">
                                        Based on your{" "}
                                        <span className={`font-bold ${sm.label === "High" ? "text-red-300" : sm.label === "Moderate" ? "text-amber-300" : "text-emerald-300"}`}>
                                            {sm.label.toLowerCase()} stress analysis ({latestStress}%)
                                        </span>
                                        {", "}we&apos;ve identified 3 specialists who fit your profile.
                                    </p>
                                </div>
                                <Link href="/therapy/browse" className="flex-shrink-0">
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-2 bg-white text-indigo-700 text-sm font-extrabold px-5 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-md">
                                        Explore Matches <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        SIDEBAR (Right 1/3) — Quick Actions
                    ════════════════════════════════════════════════════════ */}
                    <div className="flex flex-col gap-5">

                        {/* ── Mood Check-In / AI Wellness ── */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                            className="glass p-5"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-secondary" />
                                <h3 className="font-bold text-slate-800 text-sm">Wellness Check-In</h3>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold ml-auto">AI-Powered</span>
                            </div>
                            <p className="text-slate-400 text-xs mb-4">Complete a 4-step journey to get your AI stress score.</p>

                            <AnimatePresence mode="wait">
                                {aiResult ? (
                                    <AIResultCard
                                        key="result"
                                        stressScore={aiResult.score}
                                        label={aiResult.label}
                                        aiDown={aiResult.aiDown}
                                        onDismiss={() => setAiResult(null)}
                                    />
                                ) : (
                                    <motion.button key="cta"
                                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setShowWellness(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-full shadow-[0_6px_20px_rgba(138,154,134,0.35),inset_0_1px_0_rgba(255,255,255,0.20)] hover:opacity-90 hover:shadow-[0_8px_28px_rgba(138,154,134,0.45)] transition-all">
                                        <BrainCircuit className="w-4 h-4" />
                                        Start Wellness Journey
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* ── Upcoming Session ── */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 }}
                            className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-3xl shadow-lg shadow-primary/30 p-5 relative overflow-hidden"
                        >
                            <div className="absolute -top-4 -right-4 opacity-10">
                                <Calendar className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <Calendar className="w-4 h-4" />
                                <h3 className="font-bold text-sm">Upcoming Session</h3>
                            </div>
                            {upcomingBooking ? (
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 relative z-10">
                                    <p className="font-bold">{upcomingBooking.counsellor.name ?? "Your Mentor"}</p>
                                    <p className="text-white/70 text-xs mb-2">Campus Counsellor</p>
                                    <div className="flex items-center gap-1.5 text-xs font-bold bg-white text-primary px-3 py-1.5 rounded-lg w-fit">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(upcomingBooking.appointmentTime).toLocaleDateString("en-IN", {
                                            weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10 text-center py-2">
                                    <Clock className="w-7 h-7 text-white/40 mx-auto mb-2" />
                                    <p className="text-white/60 text-xs mb-3">No upcoming sessions</p>
                                    <button onClick={() => setShowBooking(true)}
                                        className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-teal-700 transition-all shadow-[0_3px_12px_rgba(13,148,136,0.30)]">
                                        Book now →
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* ── Counsellor Connect ── */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
                            className="glass p-5"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-slate-800 text-sm">Available Mentors</h3>
                            </div>
                            <div className="space-y-2">
                                {counsellors.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-3">No mentors available</p>
                                ) : counsellors.slice(0, 3).map(c => (
                                    <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                            {(c.name ?? c.email)[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-xs truncate">{c.name ?? "Mentor"}</p>
                                            <p className="text-[10px] text-emerald-500 font-medium">● Online</p>
                                        </div>
                                        <Link href="/forum">
                                            <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors border border-primary/15">
                                                Chat
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <Link href="/forum" className="block mt-3">
                                <button className="w-full text-xs font-bold text-white bg-gradient-to-r from-primary to-[#6b8f66] py-2.5 rounded-full hover:opacity-90 transition-all shadow-[0_3px_12px_rgba(138,154,134,0.30)] flex items-center justify-center gap-1.5">
                                    <ArrowRight className="w-3.5 h-3.5" /> Open Forum
                                </button>
                            </Link>
                        </motion.div>

                        {/* ── Daily Reflection ── */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
                            className="bg-gradient-to-br from-violet-50 to-indigo-50 backdrop-blur-xl rounded-3xl border border-violet-100 shadow-md overflow-hidden"
                        >
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-violet-100">
                                <PenLine className="w-4 h-4 text-violet-500" />
                                <h3 className="font-bold text-slate-800 text-sm">Daily Reflection</h3>
                                <HeartPulse className="w-3.5 h-3.5 text-violet-400 ml-auto" />
                            </div>
                            <div className="p-5">
                                <p className="text-slate-700 text-xs font-semibold leading-relaxed mb-3">
                                    &ldquo;{todayPrompt}&rdquo;
                                </p>
                                <textarea rows={3} value={reflection} onChange={e => setReflection(e.target.value)}
                                    placeholder="Write your thoughts here..."
                                    className="w-full bg-white/70 border border-violet-100 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all" />
                                <p className="text-[10px] text-slate-300 mt-1.5">Private to this session only.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
