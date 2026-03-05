import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require the user to be authenticated
const PROTECTED_ROUTES = ["/dashboard", "/forum", "/resources"];

// Routes only accessible when NOT logged in (redirect logged-in users away)
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

// Role-restricted routes
const STUDENT_ONLY_ROUTES = ["/dashboard/student"];
const SENIOR_ONLY_ROUTES = ["/dashboard/senior"];

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const isLoggedIn = !!session;
    const role = isLoggedIn ? (session?.user as { role?: string })?.role : null;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // Redirect authenticated users away from auth pages → their dashboard
    if (isLoggedIn && isAuthRoute) {
        const dest = (role === "COUNSELLOR" || role === "ADMIN")
            ? "/dashboard/senior"
            : "/dashboard/student";
        return NextResponse.redirect(new URL(dest, nextUrl));
    }

    // Redirect unauthenticated users away from protected routes
    if (!isLoggedIn && isProtectedRoute) {
        const redirectUrl = new URL("/auth/signin", nextUrl);
        redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Cross-role guard: STUDENT trying to access /dashboard/senior
    if (isLoggedIn && SENIOR_ONLY_ROUTES.some((r) => nextUrl.pathname.startsWith(r))) {
        if (role !== "COUNSELLOR" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/student", nextUrl));
        }
    }

    // Cross-role guard: COUNSELLOR/ADMIN trying to access /dashboard/student
    if (isLoggedIn && STUDENT_ONLY_ROUTES.some((r) => nextUrl.pathname.startsWith(r))) {
        if (role === "COUNSELLOR" || role === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/senior", nextUrl));
        }
    }

    return NextResponse.next();
});

// Tell Next.js which paths to run the middleware on.
// Exclude static files, images, and the api/auth route itself.
export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|fonts).*)"],
};
