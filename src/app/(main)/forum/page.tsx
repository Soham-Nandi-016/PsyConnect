// Force dynamic rendering — this page calls auth() which reads cookies/headers
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getConversations, getPeers } from "@/app/actions/forum";
import { ForumClient } from "./ForumClient";

// Server Component — validates auth and pre-fetches data
export default async function ForumPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/forum");

    const [conversations, peers] = await Promise.all([
        getConversations(),
        getPeers(),
    ]);

    return (
        <ForumClient
            initialConversations={conversations}
            peers={peers}
            currentUserId={session.user.id}
            currentUserName={session.user.name ?? session.user.email ?? "You"}
        />
    );
}
