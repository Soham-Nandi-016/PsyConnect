import { Users } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-accent mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">PsyConnect</span>
                </div>
                <div className="text-sm text-foreground/60 font-medium text-center md:text-left">
                    &copy; {new Date().getFullYear()} PsyConnect. All rights reserved.
                </div>
                <div className="flex gap-5 text-sm font-semibold">
                    <Link href="/privacy" className="text-foreground/70 hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-foreground/70 hover:text-primary transition-colors">
                        Terms of Service
                    </Link>
                    <Link
                        href="/crisis"
                        className="text-red-600 hover:text-red-700 transition-colors font-bold flex items-center gap-1"
                    >
                        🆘 Crisis Hotline
                    </Link>
                </div>
            </div>
        </footer>
    );
}
