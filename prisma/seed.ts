import { PrismaClient, ResourceType, ResourceCategory, Specialty, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const resources = [
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

const counsellors = [
    {
        name: "Dr. Priya Sharma",
        specialty: Specialty.ANXIETY,
        bio: "Dr. Priya Sharma is a licensed clinical psychologist with 12 years of experience helping students manage anxiety, panic disorders, and academic burnout. She uses an integrative approach combining Cognitive Behavioural Therapy (CBT) and mindfulness-based techniques.",
        qualifications: JSON.stringify(["Ph.D Clinical Psychology — NIMHANS Bangalore", "CBT Certified Practitioner — Beck Institute", "Mindfulness-Based Stress Reduction (MBSR) Facilitator", "Licensed by RCI India"]),
        philosophy: "I believe anxiety is a signal, not a sentence. My goal is to help you decode what your mind is telling you and build practical tools to respond — not react.",
        videoUrl: "dQw4w9WgXcQ",
        rating: 4.9,
        yearsExp: 12,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 1, startHour: 9, endHour: 13 },   // Mon
            { dayOfWeek: 3, startHour: 14, endHour: 18 },  // Wed
            { dayOfWeek: 5, startHour: 9, endHour: 12 },   // Fri
        ],
        testimonials: [
            { studentName: "Ananya R.", text: "Dr. Priya completely changed how I handle exam stress. She's incredibly warm and practical. Best decision of my college life.", rating: 5 },
            { studentName: "Kunal M.", text: "I was sceptical about therapy but after 4 sessions, I actually look forward to talking to her. Makes complex feelings feel manageable.", rating: 5 },
            { studentName: "Shreya P.", text: "Very professional. She doesn't just listen — she gives you homework that actually works!", rating: 5 },
        ],
    },
    {
        name: "Mr. Arjun Iyer",
        specialty: Specialty.STRESS,
        bio: "Arjun Iyer is a counsellor specialising in academic and performance stress, time management burnout, and student identity crises. With a background in sports psychology, he brings a unique 'mental fitness' perspective to wellbeing.",
        qualifications: JSON.stringify(["M.Sc Counselling Psychology — Manipal University", "Certified Sports Psychologist — ISSP", "Stress Management Trainer — iNLP", "Peer Support Facilitator"]),
        philosophy: "Stress is not the enemy — unmanaged stress is. I help students build a personalised stress toolkit so they can perform under pressure without burning out.",
        videoUrl: null,
        rating: 4.7,
        yearsExp: 6,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 2, startHour: 10, endHour: 14 },  // Tue
            { dayOfWeek: 4, startHour: 15, endHour: 18 },  // Thu
            { dayOfWeek: 6, startHour: 9, endHour: 12 },   // Sat
        ],
        testimonials: [
            { studentName: "Dev K.", text: "Arjun helped me structure my week so I wasn't constantly firefighting. Game changer for my productivity.", rating: 5 },
            { studentName: "Meera J.", text: "He takes a very practical approach which I loved. No fluff, just results.", rating: 4 },
        ],
    },
    {
        name: "Ms. Fatima Zaidi",
        specialty: Specialty.DEPRESSION,
        bio: "Fatima Zaidi is a counselling psychologist who specialises in depression, grief, and identity issues in young adults. She creates a deeply safe space where students can explore difficult emotions without judgment.",
        qualifications: JSON.stringify(["M.A Applied Psychology — JNU Delhi", "Trauma-Informed Care Certified — NICABM", "Grief Counselling Certificate — ADEC", "Dialectical Behaviour Therapy (DBT) Trained"]),
        philosophy: "Depression often speaks in silence. I help students find their voice again — one honest conversation at a time.",
        videoUrl: null,
        rating: 4.8,
        yearsExp: 9,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 1, startHour: 14, endHour: 18 },  // Mon
            { dayOfWeek: 3, startHour: 9, endHour: 13 },   // Wed
            { dayOfWeek: 4, startHour: 10, endHour: 14 },  // Thu
        ],
        testimonials: [
            { studentName: "Ritika S.", text: "Fatima is the most empathetic person I have ever met. She never rushes you and makes you feel genuinely heard.", rating: 5 },
            { studentName: "Amar T.", text: "I went through a really dark phase and her sessions were the light at the end of the tunnel. Thank you.", rating: 5 },
            { studentName: "Pooja V.", text: "She uses DBT techniques that are very structured and really helped me stop self-destructive thought cycles.", rating: 5 },
        ],
    },
    {
        name: "Dr. Rohan Nair",
        specialty: Specialty.SLEEP,
        bio: "Dr. Rohan Nair is a sleep health specialist and counsellor with deep expertise in sleep disorders, circadian rhythm disruption, and the mental health impact of chronic sleep deprivation — a common struggle for students.",
        qualifications: JSON.stringify(["M.D Psychiatry — AIIMS New Delhi", "Sleep Medicine Certificate — AASM", "CBT for Insomnia (CBT-I) Certified", "Registered Mental Health Counsellor"]),
        philosophy: "Sleep is not a luxury — it is a biological necessity. We can't talk about mental health without talking about sleep. I help you reclaim your nights so your days can thrive.",
        videoUrl: null,
        rating: 4.6,
        yearsExp: 8,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 2, startHour: 9, endHour: 12 },   // Tue
            { dayOfWeek: 5, startHour: 13, endHour: 17 },  // Fri
        ],
        testimonials: [
            { studentName: "Ishaan R.", text: "My insomnia was destroying my grades. Dr. Rohan's CBT-I programme fixed my sleep within 6 weeks. Cannot recommend more.", rating: 5 },
            { studentName: "Tanvi G.", text: "Very knowledgeable. He explained the science of sleep in a way that made me want to actually fix my habits.", rating: 4 },
        ],
    },
    {
        name: "Ms. Kavya Menon",
        specialty: Specialty.RELATIONSHIPS,
        bio: "Kavya Menon is a relationship and social wellbeing counsellor. She helps students navigate friendship breakdowns, romantic relationships, family tensions, and the loneliness that can come with leaving home for college.",
        qualifications: JSON.stringify(["M.Sc Counselling — Christ University Bangalore", "Emotionally Focused Therapy (EFT) Practitioner", "Family Systems Therapy Training", "Certified Relationship Coach — ICF"]),
        philosophy: "We are relational beings, and relationships are where we get hurt — but also where we heal. I create a space to untangle the complexity of connection.",
        videoUrl: null,
        rating: 4.9,
        yearsExp: 7,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 1, startHour: 10, endHour: 14 },  // Mon
            { dayOfWeek: 3, startHour: 15, endHour: 18 },  // Wed
            { dayOfWeek: 5, startHour: 10, endHour: 13 },  // Fri
        ],
        testimonials: [
            { studentName: "Nisha A.", text: "I came in struggling with a friendship breakdown that hurt as much as a breakup. Kavya helped me process it without judgment.", rating: 5 },
            { studentName: "Varun P.", text: "She helped me understand my family dynamics in a way nobody ever had. Life-changing perspective.", rating: 5 },
        ],
    },
    {
        name: "Mr. Siddharth Bose",
        specialty: Specialty.ACADEMIC,
        bio: "Siddharth Bose is an academic performance coach and counsellor who helps students overcome procrastination, imposter syndrome, perfectionism, and the fear of failure that blocks real potential.",
        qualifications: JSON.stringify(["M.A Educational Psychology — Delhi University", "Positive Psychology Practitioner — CAPP", "ADHD Coaching Certified — ICF", "Academic Resilience Researcher"]),
        philosophy: "The biggest block to academic success is rarely intelligence — it's almost always psychological. I help dismantle the invisible walls that keep brilliant students stuck.",
        videoUrl: null,
        rating: 4.7,
        yearsExp: 5,
        avatarUrl: null,
        availability: [
            { dayOfWeek: 2, startHour: 9, endHour: 13 },   // Tue
            { dayOfWeek: 4, startHour: 9, endHour: 13 },   // Thu
            { dayOfWeek: 6, startHour: 10, endHour: 13 },  // Sat
        ],
        testimonials: [
            { studentName: "Riya K.", text: "Siddharth identified my perfectionism as the root cause of my procrastination. Now I actually submit assignments on time!", rating: 5 },
            { studentName: "Aditya L.", text: "He's like a life coach but with a psychology degree. Incredibly practical and no-nonsense.", rating: 4 },
            { studentName: "Preethi M.", text: "My imposter syndrome used to cripple me before presentations. After 5 sessions it barely registers.", rating: 5 },
        ],
    },
];

async function main() {
    console.log("🔥 Initiating Master Database Wipe...");
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    
    // 1. DELETE MANY in correct relation order
    await db.testimonial.deleteMany();
    await db.therapistAvailability.deleteMany();
    await db.therapyBooking.deleteMany();
    await db.counsellor.deleteMany();
    await db.moodLog.deleteMany();
    await db.message.deleteMany();
    await db.conversation.deleteMany();
    await db.forumTopic.deleteMany();
    await db.resource.deleteMany();
    await db.session.deleteMany();
    await db.account.deleteMany();
    await db.user.deleteMany();
    
    console.log("✅ Database tables cleared successfully.");

    // 2. CREATE TEST USER
    console.log("👤 Creating test user...");
    const testUser = await db.user.create({
        data: {
            id: "cmn7ahlyn0003znhd98x1dvdi", // User's specific ID
            email: "test@example.com",
            name: "Test Student",
            passwordHash: hashedPassword,
            role: Role.STUDENT,
        }
    });
    
    const peerUser = await db.user.create({
        data: {
            email: "peer@example.com",
            name: "Emma Watson", 
            passwordHash: hashedPassword,
            role: Role.STUDENT,
        }
    });

    const peerUser2 = await db.user.create({
        data: {
            email: "peer2@example.com",
            name: "Rahul Verma", 
            passwordHash: hashedPassword,
            role: Role.STUDENT,
        }
    });

    // 3. RESTORE COUNSELLORS
    console.log("👨‍⚕️ Seeding counsellors and their user accounts...");
    for (const c of counsellors) {
        const { availability, testimonials, ...data } = c;
        
        // Create a User account for the counsellor so they can log in
        const email = c.name === "Dr. Priya Sharma" 
            ? "priya@example.com" 
            : c.name.toLowerCase().replace(/\s/g, ".") + "@psyconnect.com";

        const counsellorUser = await db.user.create({
            data: {
                email,
                name: c.name,
                passwordHash: hashedPassword,
                role: Role.COUNSELLOR,
            }
        });

        await db.counsellor.create({
            data: {
                ...data,
                userId: counsellorUser.id,
                availability: { createMany: { data: availability } },
                testimonials: { createMany: { data: testimonials } },
            },
        });
    }

    // 4. RESTORE RESOURCES
    console.log("📚 Seeding resources...");
    for (const resource of resources) {
        await db.resource.create({ data: resource });
    }

    // 5. SEED THE COMMUNITY (Forum Topics)
    console.log("🗣️ Seeding community forum...");
    const topics = [
        { title: "Managing mid-term burnout?", content: "I'm feeling so exhausted. How do you guys bounce back after 3 exams in a week? I can't even look at my books anymore.", authorId: testUser.id, likes: 12 },
        { title: "Best places on campus to cry? 😂", content: "Honestly, midterms hit hard. Library 3rd floor is my go-to. Where do you guys let it out?", authorId: peerUser.id, likes: 45 },
        { title: "Has anyone tried Dr. Priya?", content: "I'm thinking of booking a session with her for exam anxiety. Is she approachable?", authorId: peerUser2.id, likes: 8 },
        { title: "Apps for tracking habits?", content: "Anyone got good recommendations for habit trackers? I keep forgetting to drink water while studying.", authorId: testUser.id, likes: 5 },
        { title: "Roommate issues... avoiding conflict", content: "My roommate stays up till 3 AM playing games and I have 8 AM classes. How do I bring this up without starting a war?", authorId: peerUser.id, likes: 23 },
        { title: "Imposter syndrome is real today", content: "Got my first CS grade back and it's brutally low. Feel like I don't belong in this major at all.", authorId: peerUser2.id, likes: 56 },
        { title: "Sleep schedule is completely ruined", content: "It's 4 AM right now. Anyone else just physiologically incapable of sleeping before 2 AM?", authorId: testUser.id, likes: 89 },
        { title: "Good coffee spots near campus?", content: "I need to get out of my dorm to study. The silence is making me crazy.", authorId: peerUser.id, likes: 14 },
        { title: "Anxiety before checking grades", content: "My heart literally pounds when I open the portal. How do I stop tying my self-worth to a letter?", authorId: peerUser2.id, likes: 34 },
        { title: "Anyone else feeling lonely on weekends?", content: "Everyone seems to have friend groups to go out with, except me. Is it just me?", authorId: testUser.id, likes: 78 },
        { title: "How to stop procrastinating?", content: "I have an essay due tomorrow and I'm scrolling through this forum instead of writing it. Pls send help.", authorId: peerUser.id, likes: 110 },
        { title: "Tips for long-distance relationships?", content: "My partner goes to a different college and the time difference + schedule clash is getting hard.", authorId: peerUser2.id, likes: 21 },
        { title: "Therapy makes a difference!", content: "Just wanted to post some positivity. Started seeing a counsellor last month and I finally feel like myself again. Take the step guys!", authorId: testUser.id, likes: 143 },
        { title: "Financial stress is overwhelming", content: "Working 2 part-time jobs just to afford rent. My grades are slipping. Just needed to vent.", authorId: peerUser.id, likes: 67 },
        { title: "I finally slept 8 hours!", content: "Nothing special, just celebrating a small win. The Yoga Nidra resource actually worked for me.", authorId: peerUser2.id, likes: 52 },
    ];

    for (const t of topics) {
        await db.forumTopic.create({ data: t });
    }

    // 6. SEED DEMO REAL-TIME CHAT
    console.log("💬 Seeding demo chat for Dr. Priya...");
    const priya = await db.counsellor.findFirst({ where: { name: "Dr. Priya Sharma" } });
    if (priya) {
        // Conversation 1
        await db.conversation.create({
            data: {
                studentId: testUser.id,
                counsellorId: priya.id,
                status: "ACCEPTED",
                messages: {
                    create: [
                        { senderStudentId: testUser.id, content: "Hi Dr. Priya, I'm really struggling with focusing for my exams next week. Do you have any quick techniques?" },
                        { senderCounsellorId: priya.id, content: "Hello! It's completely normal to feel overwhelmed right now. Have you tried the Pomodoro technique combined with the Box Breathing resource from our Toolkit?" },
                        { senderStudentId: testUser.id, content: "I'll try that tonight, thank you so much. I'll let you know how it goes." },
                    ]
                }
            }
        });

        // Conversation 2 (Sample)
        await db.conversation.create({
            data: {
                studentId: peerUser.id,
                counsellorId: priya.id,
                status: "ACCEPTED",
                messages: {
                    create: [
                        { senderStudentId: peerUser.id, content: "Dr. Priya, I wanted to thank you for the session yesterday. I feel much lighter." },
                        { senderCounsellorId: priya.id, content: "You're very welcome, Emma. Remember to practice those grounding exercises we discussed." },
                    ]
                }
            }
        });

        // Conversation 3 (Sample)
        await db.conversation.create({
            data: {
                studentId: peerUser2.id,
                counsellorId: priya.id,
                status: "PENDING",
                messages: {
                    create: [
                        { senderStudentId: peerUser2.id, content: "Hello Dr. Priya, I'd like to talk about my social anxiety if you're available." },
                    ]
                }
            }
        });
    }

    console.log("🎉 Master Seed complete! The platform is Review-Ready.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
