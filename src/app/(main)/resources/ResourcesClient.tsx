"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, PlayCircle, BookOpen, Music, X,
    Star, BookMarked, Wind, Moon, Brain, Sparkles
} from "lucide-react";
import type { ResourceItem } from "@/app/actions/resources";

// ─── Types & Constants ─────────────────────────────────────

type Category = "All" | "ANXIETY" | "FOCUS" | "SLEEP" | "MINDFULNESS";

const CATEGORIES: { key: Category; label: string; icon: React.ElementType; color: string }[] = [
    { key: "All", label: "All", icon: Sparkles, color: "from-gray-500 to-gray-700" },
    { key: "ANXIETY", label: "Anxiety", icon: Wind, color: "from-rose-400 to-pink-600" },
    { key: "FOCUS", label: "Focus", icon: Brain, color: "from-blue-400 to-indigo-600" },
    { key: "SLEEP", label: "Sleep", icon: Moon, color: "from-violet-400 to-purple-600" },
    { key: "MINDFULNESS", label: "Mindfulness", icon: BookMarked, color: "from-emerald-400 to-teal-600" },
];

const TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    VIDEO: { icon: PlayCircle, label: "Video", color: "text-rose-500" },
    AUDIO: { icon: Music, label: "Audio", color: "text-violet-500" },
    GUIDE: { icon: BookOpen, label: "Guide", color: "text-blue-500" },
};

const CAT_STYLES: Record<string, { bg: string; text: string; pill: string }> = {
    ANXIETY: { bg: "bg-rose-100", text: "text-rose-700", pill: "bg-rose-500" },
    FOCUS: { bg: "bg-blue-100", text: "text-blue-700", pill: "bg-blue-500" },
    SLEEP: { bg: "bg-violet-100", text: "text-violet-700", pill: "bg-violet-500" },
    MINDFULNESS: { bg: "bg-emerald-100", text: "text-emerald-700", pill: "bg-emerald-500" },
    GENERAL: { bg: "bg-gray-100", text: "text-gray-700", pill: "bg-gray-500" },
};

// Check if URL is a YouTube embed ID (11-char alphanumeric) vs external link
function isYouTubeId(url: string): boolean {
    return /^[a-zA-Z0-9_-]{11}$/.test(url.trim());
}

// ─── Video Modal ───────────────────────────────────────────
function VideoModal({ resource, onClose }: { resource: ResourceItem; onClose: () => void }) {
    const isYT = isYouTubeId(resource.url);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="bg-gray-950 rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Video Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div>
                        <p className="text-white font-bold text-base">{resource.title}</p>
                        <p className="text-white/50 text-xs mt-0.5">{resource.duration}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Embed Area */}
                <div className="aspect-video w-full bg-black">
                    {isYT ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${resource.url}?autoplay=1&rel=0`}
                            title={resource.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        // External link — show description + open button
                        <div className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center">
                            <BookOpen className="w-16 h-16 text-white/30" />
                            <p className="text-white/70 text-sm max-w-md leading-relaxed">{resource.description}</p>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
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
    const TypeIcon = typeMeta.icon;
    const isYT = resource.type === "VIDEO" && isYouTubeId(resource.url);
    const thumbnail = isYT
        ? `https://img.youtube.com/vi/${resource.url}/hqdefault.jpg`
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            layout
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer border border-gray-100"
        >
            {/* Thumbnail / Cover */}
            <div className="h-48 relative overflow-hidden flex-shrink-0">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${catStyle.bg}`}>
                        <TypeIcon className={`w-16 h-16 ${catStyle.text} opacity-50 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5">
                    <TypeIcon className={`w-3.5 h-3.5 ${typeMeta.color}`} />
                    <span className="text-white text-xs font-semibold">{typeMeta.label}</span>
                </div>

                {/* Featured badge */}
                {resource.isFeatured && (
                    <div className="absolute top-3 right-3 bg-amber-400/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-white fill-white" />
                        <span className="text-white text-[10px] font-bold">Featured</span>
                    </div>
                )}

                {/* Duration */}
                {resource.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                        {resource.duration}
                    </span>
                )}

                {/* Play overlay for videos */}
                {resource.type === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${catStyle.text}`}>
                    {resource.category.charAt(0) + resource.category.slice(1).toLowerCase()}
                </span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {resource.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto leading-relaxed">
                    {resource.description}
                </p>
            </div>
        </motion.div>
    );
}

// ─── Main ResourcesClient ───────────────────────────────────
export function ResourcesClient({ resources }: { resources: ResourceItem[] }) {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-foreground mb-2">Resource Hub</h1>
                <p className="text-foreground/70 font-medium text-lg">
                    Curated materials to help you navigate college life.
                </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                        type="text"
                        id="resource-search"
                        placeholder="Search guides, audio, videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${isActive
                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                                {isActive && activeCategory !== "All" && (
                                    <span className="bg-white/30 text-white text-xs rounded-full px-1.5 ml-1 font-bold">
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
                <p className="text-sm text-gray-500 -mt-2">
                    Showing <span className="font-semibold text-gray-800">{filtered.length}</span> result
                    {filtered.length !== 1 && "s"}
                    {searchQuery && <> for "<span className="font-semibold">{searchQuery}</span>"</>}
                </p>
            )}

            {/* Grid / Empty State */}
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                            <Search className="w-9 h-9 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No resources found</h3>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Try a different keyword or category. New content is added regularly.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                            className="mt-5 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                        >
                            Clear filters
                        </button>
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
                                onClick={() => setActiveResource(resource)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

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
