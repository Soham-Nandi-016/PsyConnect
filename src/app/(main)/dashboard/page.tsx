// /dashboard — Server Component that redirects user to their role-specific dashboard
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/dashboard");
    }

    const role = (session.user as { role?: string }).role;

    if (role === "COUNSELLOR" || role === "ADMIN") {
        redirect("/dashboard/senior");
    }

    // STUDENT or any unrecognised role → student dashboard
    redirect("/dashboard/student");
}
