export const dynamic = "force-dynamic";

import { getResources } from "@/app/actions/resources";
import { ResourcesClient } from "./ResourcesClient";

// Server Component — pre-fetches all resources from MySQL
export default async function ResourcesPage() {
    const resources = await getResources();

    return <ResourcesClient resources={resources} />;
}
