import { PrismaClient, ResourceType, ResourceCategory } from "@prisma/client";

const prisma = new PrismaClient();

const resources = [
    // ── ACADEMIC ANALYTICS & PRODUCTIVITY (Category: GENERAL) ──
    {
        title: "How to Build a Second Brain",
        description: "Organize your academic life and syllabus using digital tools to track assignments and optimize retention.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.GENERAL,
        url: "https://www.youtube.com/embed/xv6jHlBWLio?rel=0",
        thumbnailUrl: "https://i.ytimg.com/vi/xv6jHlBWLio/hqdefault.jpg?v=2",
        duration: "12 min",
        isFeatured: true,
    },
    {
        title: "Data-Driven Study Habits",
        description: "A comprehensive guide on tracking your focus hours and test scores to identify optimal study times.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.GENERAL,
        url: "https://collegeinfogeek.com/track-study-time/",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&v=2",
        duration: "6 min read",
        isFeatured: false,
    },
    {
        title: "Binaural Beats for Deep Analysis",
        description: "Gamma frequency binaural beats designed to enhance cognitive processing during data analysis or essay writing.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.GENERAL,
        url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&v=2",
        duration: "45 min",
        isFeatured: false,
    },

    // ── FOCUS ──────────────────────────────────────────────────
    {
        title: "Study Focus Music | Rain Sounds",
        description: "Gentle rain and lo-fi beats to keep you grounded and focused while battling exam season distractions.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.FOCUS,
        url: "https://www.youtube.com/embed/jfKfPfyJRdk?rel=0",
        thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg?v=2",
        duration: "60 min",
        isFeatured: true,
    },
    {
        title: "Overcoming Chronic Procrastination",
        description: "Psychology Today's actionable guide on breaking the habit of delayed gratification and initiating tasks.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.FOCUS,
        url: "https://www.psychologytoday.com/us/basics/procrastination",
        thumbnailUrl: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=600&v=2",
        duration: "8 min read",
        isFeatured: false,
    },
    {
        title: "Pomodoro Ambient Timer",
        description: "A 25-minute audio track that fades out naturally to signal your break. Perfect for structured focus.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.FOCUS,
        url: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO1V8vPZ",
        thumbnailUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600&v=2",
        duration: "25 min",
        isFeatured: false,
    },

    // ── SLEEP ──────────────────────────────────────────────────
    {
        title: "Guided Yoga Nidra for Sleep",
        description: "A deeply relaxing non-sleep deep rest (NSDR) protocol to calm your nervous system before bed.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.SLEEP,
        url: "https://www.youtube.com/embed/P6V_vD72ZpU?rel=0",
        thumbnailUrl: "https://i.ytimg.com/vi/P6V_vD72ZpU/hqdefault.jpg?v=2",
        duration: "20 min",
        isFeatured: true,
    },
    {
        title: "The Ultimate Sleep Hygiene Guide",
        description: "HelpGuide's definitive checklist for adjusting your environment and habits to cure collegiate insomnia.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.SLEEP,
        url: "https://www.helpguide.org/articles/sleep/getting-better-sleep.htm",
        thumbnailUrl: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?q=80&w=600&v=2",
        duration: "10 min read",
        isFeatured: false,
    },
    {
        title: "Deep Sleep Nature Soundscape",
        description: "Continuous forest night sounds recorded in 432Hz to promote deep delta-wave sleep cycles.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.SLEEP,
        url: "https://open.spotify.com/album/4kELfVaFQxWEz3bTXJFMv4",
        thumbnailUrl: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=600&v=2",
        duration: "8 Hours",
        isFeatured: false,
    },

    // ── MINDFULNESS ────────────────────────────────────────────
    {
        title: "Guided Box Breathing",
        description: "Follow the visual box to master the 4-4-4-4 breathing technique, instantly lowering acute stress or panic.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.MINDFULNESS,
        url: "https://www.youtube.com/embed/tEmt1Znux58?rel=0",
        thumbnailUrl: "https://i.ytimg.com/vi/tEmt1Znux58/hqdefault.jpg?v=2",
        duration: "5 min",
        isFeatured: true,
    },
    {
        title: "Benefits of Daily Mindfulness",
        description: "An evidence-based article detailing how 10 minutes of daily mindfulness actually changes gray matter in your brain.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.MINDFULNESS,
        url: "https://www.helpguide.org/articles/mental-health/benefits-of-mindfulness.htm",
        thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&v=2",
        duration: "5 min read",
        isFeatured: false,
    },
    {
        title: "Morning Body Scan Meditation",
        description: "A gentle guided audio meant to ground you in your physical body before you start a stressful academic day.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.MINDFULNESS,
        url: "https://open.spotify.com/track/6QvC9RlmVhc1MOgIjNK2GW",
        thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&v=2",
        duration: "15 min",
        isFeatured: false,
    },
];

async function main() {
    console.log("🌱 Seeding resources...");

    // Clear existing resources to prevent duplicates
    await prisma.resource.deleteMany();

    for (const resource of resources) {
        await prisma.resource.create({ data: resource });
    }

    console.log(`✅ Seeded ${resources.length} resources successfully.`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
