import { PrismaClient, ResourceType, ResourceCategory } from "@prisma/client";

const prisma = new PrismaClient();

const resources = [
    // ── ANXIETY ────────────────────────────────────────────────
    {
        title: "Box Breathing for Panic Relief",
        description:
            "A guided 5-minute breathing exercise using the 4-4-4-4 box method to activate your parasympathetic nervous system and calm acute anxiety instantly.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.ANXIETY,
        url: "inpqXOeHIlM", // YouTube embed ID
        duration: "5 min",
        isFeatured: true,
    },
    {
        title: "5-4-3-2-1 Grounding Technique",
        description:
            "Learn the sensory grounding method used by therapists worldwide. Bring yourself back to the present moment during anxiety attacks in under 3 minutes.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.ANXIETY,
        url: "https://www.healthline.com/health/grounding-techniques",
        duration: "3 min read",
        isFeatured: false,
    },
    {
        title: "Managing Test Anxiety",
        description:
            "Science-backed strategies from Stanford researchers on reducing exam performance anxiety — from preparation rituals to breathing patterns during the test.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.ANXIETY,
        url: "https://studenthealth.stanford.edu/test-anxiety",
        duration: "6 min read",
        isFeatured: false,
    },

    // ── FOCUS ──────────────────────────────────────────────────
    {
        title: "Pomodoro Study Session — Deep Focus",
        description:
            "A 25-minute focused study session timer with ambient café sounds, followed by a gentle break reminder. Perfect for ADHD and procrastination.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.FOCUS,
        url: "https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6",
        duration: "25 min",
        isFeatured: true,
    },
    {
        title: "Managing Academic Workloads",
        description:
            "Learn to break complex projects into manageable tasks using the Eisenhower Matrix. Includes a free downloadable weekly planner template.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.FOCUS,
        url: "https://collegeinfogeek.com/eisenhower-matrix",
        duration: "8 min read",
        isFeatured: false,
    },
    {
        title: "Desk Yoga for Focus",
        description:
            "5 gentle stretches you can do at your desk to reset your mind before a study session. No mat required — proven to increase concentration by 22%.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.FOCUS,
        url: "4vTJHUDB5ak", // YouTube embed ID
        duration: "7 min",
        isFeatured: false,
    },

    // ── SLEEP ──────────────────────────────────────────────────
    {
        title: "Guided Sleep Visualization",
        description:
            "A soothing 10-minute audio walk-through with gentle narration designed to calm an overactive mind and guide you into deep restful sleep.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.SLEEP,
        url: "https://open.spotify.com/album/4kELfVaFQxWEz3bTXJFMv4",
        duration: "10 min",
        isFeatured: true,
    },
    {
        title: "Sleep Hygiene for Students",
        description:
            "The ultimate college sleep guide — optimal room temperature, screen time rules, caffeine cutoffs, and the science of sleep cycles for exam performance.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.SLEEP,
        url: "https://www.sleepfoundation.org/sleep-tips/college",
        duration: "5 min read",
        isFeatured: false,
    },
    {
        title: "Progressive Muscle Relaxation",
        description:
            "Release physical tension stored from stress using this guided PMR session. Tense and release each muscle group from toes to forehead for full-body calm.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.SLEEP,
        url: "ihO02wUzgkc", // YouTube embed ID
        duration: "12 min",
        isFeatured: false,
    },

    // ── MINDFULNESS ────────────────────────────────────────────
    {
        title: "Morning Mindfulness — 5-Minute Reset",
        description:
            "Start every day with intention. This guided meditation anchors your attention to the present moment, reducing cortisol and building emotional resilience.",
        type: ResourceType.VIDEO,
        category: ResourceCategory.MINDFULNESS,
        url: "inpqXOeHIlM", // YouTube embed ID
        duration: "5 min",
        isFeatured: true,
    },
    {
        title: "Journaling for Mental Clarity",
        description:
            "Three evidence-based journaling prompts used by cognitive behavioural therapists to reframe negative thought patterns and build self-compassion daily.",
        type: ResourceType.GUIDE,
        category: ResourceCategory.MINDFULNESS,
        url: "https://positivepsychology.com/journaling-prompts-mental-health",
        duration: "4 min read",
        isFeatured: false,
    },
    {
        title: "Body Scan Meditation",
        description:
            "A gentle 15-minute guided body scan to release tension and cultivate non-judgmental awareness of physical sensations. Ideal for stress and chronic pain.",
        type: ResourceType.AUDIO,
        category: ResourceCategory.MINDFULNESS,
        url: "https://open.spotify.com/track/6QvC9RlmVhc1MOgIjNK2GW",
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
