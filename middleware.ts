import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
    "/dashboard",
    "/dashboard/student",
    "/dashboard/senior",
    "/forum",
    "/resources",
];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

// Role-restricted sub-routes
const STUDENT_ONLY = ["/dashboard/student"];
const SENIOR_ONLY = ["/dashboard/senior"];

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const path = nextUrl.pathname;
    const isLoggedIn = !!session?.user;
    const role = isLoggedIn ? (session?.user as { role?: string })?.role ?? "STUDENT" : null;

    const isProtected = PROTECTED_ROUTES.some((r) => path === r || path.startsWith(r + "/"));
    const isAuthRoute = AUTH_ROUTES.some((r) => path.startsWith(r));

    // ── Unauthenticated → redirect to sign-in ──────────────
    if (!isLoggedIn && isProtected) {
        const dest = new URL("/auth/signin", nextUrl);
        dest.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(dest);
    }

    // ── Authenticated on auth pages → go to dashboard ──────
    if (isLoggedIn && isAuthRoute) {
        const dest =
            role === "COUNSELLOR" || role === "ADMIN"
                ? "/dashboard/senior"
                : "/dashboard/student";
        return NextResponse.redirect(new URL(dest, nextUrl));
    }

    // ── Cross-role guards ────────────────────────────────────
    if (isLoggedIn && SENIOR_ONLY.some((r) => path.startsWith(r))) {
        if (role !== "COUNSELLOR" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
        }
    }

    if (isLoggedIn && STUDENT_ONLY.some((r) => path.startsWith(r))) {
        if (role === "COUNSELLOR" || role === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/senior", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|fonts).*)"],
};
