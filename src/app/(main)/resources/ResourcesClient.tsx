"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, BookOpen, Music, X,
    Star, BookMarked, Wind, Moon, Brain, Sparkles
} from "lucide-react";
import type { ResourceItem } from "@/app/actions/resources";

// ─── Types & Constants ─────────────────────────────────────

type Category = "All" | "ANXIETY" | "FOCUS" | "SLEEP" | "MINDFULNESS" | "GENERAL";

const CATEGORIES: { key: Category; label: string; icon: React.ElementType; color: string }[] = [
    { key: "All", label: "All", icon: Sparkles, color: "from-slate-500 to-slate-700" },
    { key: "GENERAL", label: "Academic", icon: BookOpen, color: "from-amber-400 to-orange-600" },
    { key: "ANXIETY", label: "Anxiety", icon: Wind, color: "from-rose-400 to-pink-600" },
    { key: "FOCUS", label: "Focus", icon: Brain, color: "from-blue-400 to-indigo-600" },
    { key: "SLEEP", label: "Sleep", icon: Moon, color: "from-violet-400 to-purple-600" },
    { key: "MINDFULNESS", label: "Mindfulness", icon: BookMarked, color: "from-emerald-400 to-teal-600" },
];

const TYPE_META: Record<string, { label: string; color: string }> = {
    VIDEO: { label: "Video", color: "text-rose-400" },
    AUDIO: { label: "Audio", color: "text-violet-400" },
    GUIDE: { label: "Guide", color: "text-blue-400" },
};

const CAT_STYLES: Record<string, { bg: string; text: string; gradFrom: string; gradTo: string; pillBg: string }> = {
    ANXIETY: { bg: "bg-rose-50", text: "text-rose-600", gradFrom: "from-rose-200/60", gradTo: "to-pink-100/50", pillBg: "bg-rose-500/90" },
    FOCUS: { bg: "bg-blue-50", text: "text-blue-600", gradFrom: "from-blue-200/60", gradTo: "to-indigo-100/50", pillBg: "bg-blue-500/90" },
    SLEEP: { bg: "bg-violet-50", text: "text-violet-600", gradFrom: "from-violet-200/60", gradTo: "to-purple-100/50", pillBg: "bg-violet-500/90" },
    MINDFULNESS: { bg: "bg-emerald-50", text: "text-emerald-600", gradFrom: "from-emerald-200/60", gradTo: "to-teal-100/50", pillBg: "bg-emerald-500/90" },
    GENERAL: { bg: "bg-slate-50", text: "text-slate-600", gradFrom: "from-slate-200/60", gradTo: "to-gray-100/50", pillBg: "bg-slate-500/90" },
};

// Extract YouTube ID from URL or return if it's already an 11-char ID
function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : (/^[a-zA-Z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null);
}

// ─── Custom Gradient Play Button ───────────────────────────
function GradientPlayBtn({ className = "" }: { className?: string }) {
    return (
        <div
            className={`flex items-center justify-center rounded-full bg-gradient-to-br from-white/35 to-white/10 backdrop-blur-md border border-white/40 shadow-[0_6px_24px_rgba(0,0,0,0.22)] ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="white" className="w-[42%] h-[42%] ml-[8%] drop-shadow-lg">
                <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
        </div>
    );
}

// ─── Video Modal ───────────────────────────────────────────
function VideoModal({ resource, onClose }: { resource: ResourceItem; onClose: () => void }) {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="bg-gray-950 rounded-3xl overflow-hidden shadow-modal w-full max-w-3xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Video Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                        <p className="text-white font-bold text-base">{resource.title}</p>
                        <p className="text-white/40 text-xs mt-0.5">{resource.duration}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Embed Area */}
                <div className="aspect-video w-full bg-black">
                    {resource.type === "VIDEO" ? (
                        <iframe
                            className="w-full h-full"
                            src={resource.url}
                            title={resource.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
                            <BookOpen className="w-16 h-16 text-white/30" />
                            <p className="text-white/60 text-sm max-w-md leading-relaxed">{resource.description}</p>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gradient-to-r from-primary to-[#6b8f66] text-white rounded-full font-semibold text-sm hover:opacity-90 transition shadow-[0_4px_14px_rgba(138,154,134,0.35)]"
                            >
                                Open Resource ↗
                            </a>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Resource Card ──────────────────────────────────────────
function ResourceCard({
    resource,
    onClick,
    index,
}: {
    resource: ResourceItem;
    onClick: () => void;
    index: number;
}) {
    const typeMeta = TYPE_META[resource.type] ?? TYPE_META.GUIDE;
    const catStyle = CAT_STYLES[resource.category] ?? CAT_STYLES.GENERAL;
    
    // Zero-logic: Direct Mapping
    const thumbnail = resource.thumbnailUrl;

    const isVideo = resource.type === "VIDEO";
    const isAudio = resource.type === "AUDIO";
    const showPlayBtn = isVideo || isAudio;

    return (
        <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            layout
            onClick={onClick}
            className="glass overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group flex flex-col cursor-pointer"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset" }}
        >
            {/* Thumbnail / Cover */}
            <div className="h-48 relative overflow-hidden flex-shrink-0 rounded-t-3xl bg-slate-100">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={resource.title}
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${catStyle.gradFrom} ${catStyle.gradTo}`}>
                        {!showPlayBtn && (
                            <BookOpen className={`w-14 h-14 ${catStyle.text} opacity-40 group-hover:scale-110 transition-transform duration-300`} />
                        )}
                        {isAudio && (
                            <Music className={`w-14 h-14 ${catStyle.text} opacity-40 group-hover:scale-110 transition-transform duration-300`} />
                        )}
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                {/* Type badge top-left */}
                <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/15">
                    <span className={`text-white text-[11px] font-bold`}>{typeMeta.label}</span>
                </div>

                {/* Featured badge top-right */}
                {resource.isFeatured && (
                    <div className="absolute top-3 right-3 bg-amber-400/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 border border-amber-300/30 shadow-sm">
                        <Star className="w-3 h-3 text-white fill-white" />
                        <span className="text-white text-[10px] font-bold tracking-wide">FEATURED</span>
                    </div>
                )}

                {/* Duration bottom-right */}
                {resource.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm font-medium border border-white/10">
                        {resource.duration}
                    </span>
                )}

                {/* Custom gradient play button — always visible for video/audio */}
                {showPlayBtn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <GradientPlayBtn className="w-16 h-16 group-hover:scale-110 transition-transform duration-250" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-2.5">
                {/* Category pill tag */}
                <span className={`pill-tag ${catStyle.pillBg} text-white w-fit`}>
                    {resource.category}
                </span>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {resource.title}
                </h3>
                <p className="text-sm text-foreground/55 line-clamp-2 mt-auto leading-relaxed">
                    {resource.description}
                </p>
            </div>
        </motion.div>
    );
}

// ─── Skeleton Loader ────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="glass overflow-hidden rounded-3xl flex flex-col animate-pulse">
            <div className="h-48 rounded-t-3xl bg-gradient-to-br from-slate-200/60 to-slate-100/40" />
            <div className="p-5 flex flex-col gap-3">
                <div className="h-4 w-20 rounded-full bg-slate-200/80" />
                <div className="h-5 w-3/4 rounded-full bg-slate-200/70" />
                <div className="h-4 w-full rounded-full bg-slate-200/50" />
                <div className="h-4 w-2/3 rounded-full bg-slate-200/50" />
            </div>
        </div>
    );
}

// ─── Main ResourcesClient ───────────────────────────────────
export function ResourcesClient({ resources }: { resources: ResourceItem[] }) {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
    const [isLoading] = useState(false); // flip to true to preview skeletons

    const filtered = useMemo(() => {
        let result = resources;

        if (activeCategory !== "All") {
            result = result.filter((r) => r.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (r) =>
                    r.title.toLowerCase().includes(q) ||
                    r.description?.toLowerCase().includes(q) ||
                    r.category.toLowerCase().includes(q)
            );
        }

        return result;
    }, [resources, activeCategory, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="heading-serif text-4xl text-foreground mb-2">Resource Hub</h1>
                <p className="text-foreground/60 font-medium text-lg leading-relaxed">
                    Curated materials to help you navigate college life.
                </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        id="resource-search"
                        placeholder="Search guides, audio, videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-full py-3 pl-11 pr-4 text-foreground placeholder-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Category Pills */}
                <div className="flex gap-2.5 flex-wrap">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.key;
                        return (
                            <motion.button
                                key={cat.key}
                                whileHover={{ scale: 1.04, y: -1 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${isActive
                                    ? `bg-gradient-to-r ${cat.color} text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]`
                                    : "bg-white/60 backdrop-blur-sm text-foreground/60 hover:bg-white/80 border border-white/50 shadow-sm"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                                {isActive && activeCategory !== "All" && (
                                    <span className="bg-white/30 text-white text-xs rounded-full px-1.5 ml-0.5 font-bold">
                                        {filtered.length}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Results count */}
            {(searchQuery || activeCategory !== "All") && (
                <p className="text-sm text-foreground/50 -mt-2">
                    Showing <span className="font-semibold text-foreground/80">{filtered.length}</span> result
                    {filtered.length !== 1 && "s"}
                    {searchQuery && <> for &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;</>}
                </p>
            )}

            {/* Skeleton Loader */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Grid / Empty State */}
            {!isLoading && (
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-20 h-20 glass rounded-full flex items-center justify-center mb-5">
                                <Search className="w-9 h-9 text-foreground/25" />
                            </div>
                            <h3 className="heading-serif text-xl text-foreground/70 mb-2">No resources found</h3>
                            <p className="text-foreground/45 text-sm max-w-xs leading-relaxed">
                                Try a different keyword or category. New content is added regularly.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                                className="mt-6 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors border border-primary/20"
                            >
                                Clear filters
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filtered.map((resource, i) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    index={i}
                                    onClick={() => {
                                        if (resource.type === "VIDEO") {
                                            setActiveResource(resource);
                                        } else {
                                            window.open(resource.url, "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Video / Resource Modal */}
            <AnimatePresence>
                {activeResource && (
                    <VideoModal
                        resource={activeResource}
                        onClose={() => setActiveResource(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
