import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt", // Use JWT for credentials provider (not database sessions)
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin", // Redirect auth errors back to sign-in page
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Find user by email
                const user = await db.user.findUnique({
                    where: { email },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

                if (!isPasswordValid) {
                    return null;
                }

                // Note: user.name may show a TS error until `npx prisma generate` is run
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const u = user as any;
                return {
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                };
            },
        }),
    ],
    callbacks: {
        // Attach role and id to the JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }
            return token;
        },
        // Expose role and id on the session object
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
});
