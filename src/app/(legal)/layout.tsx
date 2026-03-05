import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";

// Shared layout for Privacy and Terms pages — clean document style
export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Minimal legal header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">PsyConnect</span>
                    </Link>
                    <nav className="flex items-center gap-1 text-xs text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-700 font-semibold">Legal</span>
                    </nav>
                </div>
            </header>

            {children}

            {/* Legal footer */}
            <footer className="border-t border-gray-200 bg-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} PsyConnect. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/crisis" className="hover:text-red-600 text-red-500 font-semibold transition-colors">Crisis Hotline</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
