export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
    // Normally this would be: await prisma.resource.findMany()
    // Using mock data for now since the DB isn't connected yet

    const mockResources = [
        {
            id: '1',
            title: 'Box Breathing for Panic',
            description: 'A quick guided session to help regulate your nervous system.',
            type: 'AUDIO',
            url: '#',
            thumbnailUrl: null,
        },
        {
            id: '2',
            title: 'Surviving Finals Week',
            description: 'Actionable strategies for time management and stress reduction.',
            type: 'GUIDE',
            url: '#',
            thumbnailUrl: null,
        },
        {
            id: '3',
            title: 'Yoga for Focus',
            description: 'Gentle stretches to be done right at your desk before a big exam.',
            type: 'VIDEO',
            url: '#',
            thumbnailUrl: null,
        },
    ];

    return NextResponse.json(mockResources);
}
