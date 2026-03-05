import { NextResponse } from 'next/server';

export async function GET() {
    // Normally this would be: await prisma.forumTopic.findMany({ include: { author: true } })
    // Using mock data for now since the DB isn't connected yet

    const mockTopics = [
        {
            id: '1',
            authorId: 'user1',
            title: 'Feeling overwhelmed with finals approaching...',
            content: "Does anyone else feel like they're just completely frozen? I have so much to do but I can't start.",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 45,
            author: {
                id: 'user1',
                name: 'Anonymous',
                role: 'STUDENT'
            }
        },
        {
            id: '2',
            authorId: 'user2',
            title: 'A quick tip for anxiety attacks',
            content: 'The 5-4-3-2-1 grounding method really saved me today. Look around and name 5 things you can see, 4 you can feel...',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes: 128,
            author: {
                id: 'user2',
                name: 'Student2024',
                role: 'STUDENT'
            }
        },
        {
            id: '3',
            authorId: 'user3',
            title: 'How to tell my roommate I need space?',
            content: 'I love my roommate but they never leave the room and I just need some alone time to recharge. Any advice?',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            likes: 22,
            author: {
                id: 'user3',
                name: 'Anonymous',
                role: 'STUDENT'
            }
        }
    ];

    return NextResponse.json(mockTopics);
}
