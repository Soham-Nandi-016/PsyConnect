import { notFound } from "next/navigation";
import { getCounsellorById } from "@/app/actions/bookings";
import { TherapistProfile } from "@/components/therapy/TherapistProfile";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const c = await getCounsellorById(id);
    return { title: c ? `${c.name} | PsyConnect` : "Therapist Not Found" };
}

export default async function TherapistPage({ params }: Props) {
    const { id } = await params;
    const counsellor = await getCounsellorById(id);
    if (!counsellor) notFound();
    return <TherapistProfile counsellor={counsellor} />;
}
