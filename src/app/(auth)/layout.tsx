import { Users } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* Minimal auth header — PsyConnect logo only, no main Navbar */}
            <header className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 group w-fit">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">
                            PsyConnect
                        </span>
                    </Link>
                </div>
            </header>

            {/* Auth page content centered vertically */}
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                {children}
            </div>
        </div>
    );
}
