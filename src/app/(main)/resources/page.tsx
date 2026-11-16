export const dynamic = "force-dynamic";

import { getResources } from "@/app/actions/resources";
import { ResourcesClient } from "./ResourcesClient";

// Server Component — pre-fetches all resources from DB
export default async function ResourcesPage() {
    let resources: Awaited<ReturnType<typeof getResources>> = [];
    try {
        resources = await getResources();
    } catch (err) {
        // DB unreachable — render empty hub rather than crashing
        console.error("[ResourcesPage] Failed to load resources:", err);
    }

    return <ResourcesClient resources={resources} />;
}
