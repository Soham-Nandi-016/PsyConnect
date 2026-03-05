"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Activity, ArrowRight, User } from "lucide-react";

export default function StudentDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
            {/* Header Profile Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground">Hello, Alex!</h1>
                        <p className="text-foreground/70 font-medium">Student Dashboard • 2nd Year</p>
                    </div>
                </div>
                <button className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2 w-fit">
                    Edit Profile <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mood Check-In Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-3xl border border-white/50 shadow-md col-span-1 lg:col-span-2"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="text-secondary w-6 h-6" />
                            <h2 className="text-xl font-bold text-foreground">Mood Check-In</h2>
                        </div>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Today</span>
                    </div>
                    <p className="text-foreground/70 mb-6 font-medium">How are you feeling right now?</p>
                    <div className="flex justify-between gap-2 max-w-md">
                        {['😭', '😟', '😐', '🙂', '🤩'].map((emoji, i) => (
                            <button key={i} className="text-4xl hover:scale-125 transition-transform origin-bottom hover:-translate-y-2">
                                {emoji}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Next Appointment Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-lg shadow-primary/30 flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Calendar className="w-24 h-24" /></div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Upcoming Session</h2>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-6">
                            <h3 className="font-bold text-lg">Dr. Emily Chen</h3>
                            <p className="text-primary-foreground/80 text-sm font-medium mb-2">Campus Counsellor</p>
                            <div className="flex items-center gap-2 text-sm font-bold bg-white text-primary px-3 py-1.5 rounded-lg w-fit">
                                <Calendar className="w-4 h-4" /> Tomorrow, 10:00 AM
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Analytics/Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-3xl border border-white/50 shadow-md col-span-1 lg:col-span-3"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-primary w-6 h-6" />
                        <h2 className="text-xl font-bold text-foreground">Your Wellness Journey</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/60 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
                            <span className="text-4xl font-black text-secondary mb-1">12</span>
                            <span className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Moods Logged</span>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
                            <span className="text-4xl font-black text-primary mb-1">5</span>
                            <span className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Resources Read</span>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
                            <span className="text-4xl font-black text-foreground mb-1">2</span>
                            <span className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">Sessions</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
