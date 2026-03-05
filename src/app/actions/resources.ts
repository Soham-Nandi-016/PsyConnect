"use server";

import { db } from "@/lib/db";

export type ResourceItem = {
    id: string;
    title: string;
    description: string | null;
    type: "VIDEO" | "AUDIO" | "GUIDE";
    category: "ANXIETY" | "FOCUS" | "SLEEP" | "MINDFULNESS" | "GENERAL";
    url: string;
    thumbnailUrl: string | null;
    duration: string | null;
    isFeatured: boolean;
    createdAt: Date;
};

export async function getResources(): Promise<ResourceItem[]> {
    const resources = await db.resource.findMany({
        orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });

    return resources as ResourceItem[];
}
