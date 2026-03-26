import { auth } from "@/auth";
import { getChatConversations } from "@/app/actions/forum";
import ChatClient from "./ChatClient";
import { redirect } from "next/navigation";

export default async function ForumPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const initialConversations = await getChatConversations();

  return (
    <ChatClient 
      initialConversations={initialConversations} 
      currentUserId={session.user.id} 
      currentUserRole={(session.user as any).role}
    />
  );
}
