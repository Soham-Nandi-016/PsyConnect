import { Users } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white/40 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8 border-t border-white/40 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-tr from-primary/20 to-secondary/20 p-1.5 rounded-xl border border-white/50">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-foreground">
                        Psy<span className="text-primary">Connect</span>
                    </span>
                </div>
                <div className="text-sm text-foreground/50 font-medium text-center md:text-left">
                    &copy; {new Date().getFullYear()} PsyConnect. Your safe campus wellness space.
                </div>
                <div className="flex gap-5 text-sm font-semibold">
                    <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">
                        Terms of Service
                    </Link>
                    <Link
                        href="/crisis"
                        className="text-red-500 hover:text-red-600 transition-colors font-bold flex items-center gap-1"
                    >
                        🆘 Crisis Hotline
                    </Link>
                </div>
            </div>
        </footer>
    );
}
