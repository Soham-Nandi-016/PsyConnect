import { Suspense } from "react";
import { getCounsellors } from "@/app/actions/bookings";
import { CounsellorGrid } from "@/components/therapy/CounsellorGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Find Your Therapist | PsyConnect" };

export default async function TherapyBrowsePage() {
    const counsellors = await getCounsellors();

    return (
        <div className="min-h-screen pb-10">
            {/* Page header */}
            <div className="bg-gradient-to-r from-primary to-[#6b8f66] text-white max-w-7xl mx-auto rounded-3xl shadow-[0_4px_24px_rgba(138,154,134,0.3)] border border-white/20 mt-6 sm:mx-6 lg:mx-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        Therapist Discovery Hub
                    </span>
                    <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
                        Find Your Ideal Support
                    </h1>
                    <p className="text-indigo-100 text-base max-w-xl mx-auto">
                        Verified counsellors who specialise in student wellbeing. Browse, filter, and book a session that fits your schedule.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Suspense fallback={<BrowseSkeleton />}>
                    <CounsellorGrid initialCounsellors={counsellors} />
                </Suspense>
            </div>
        </div>
    );
}

function BrowseSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4" />
                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-3 bg-slate-200 rounded" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                        <div className="h-3 bg-slate-200 rounded w-4/6" />
                    </div>
                    <div className="h-10 bg-slate-200 rounded-full" />
                </div>
            ))}
        </div>
    );
}
