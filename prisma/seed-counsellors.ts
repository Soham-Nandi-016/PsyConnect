/**
 * Seed script — 6 realistic counsellor profiles with availability & testimonials
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-counsellors.ts
 */
import { PrismaClient, Specialty } from "@prisma/client";

const db = new PrismaClient();

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
    console.log("🌱  Seeding counsellors...");

    // Clear existing data
    await db.testimonial.deleteMany();
    await db.therapistAvailability.deleteMany();
    await db.therapyBooking.deleteMany();
    await db.counsellor.deleteMany();

    for (const c of counsellors) {
        const { availability, testimonials, ...data } = c;
        const counsellor = await db.counsellor.create({
            data: {
                ...data,
                availability: { createMany: { data: availability } },
                testimonials: { createMany: { data: testimonials } },
            },
        });
        console.log(`  ✅  Created: ${counsellor.name} (${counsellor.specialty})`);
    }

    console.log("\n🎉  Seeding complete!");
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => db.$disconnect());
