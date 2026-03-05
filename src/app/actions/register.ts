"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

interface RegisterResult {
    success: boolean;
    error?: string;
}

export async function register(
    name: string,
    email: string,
    password: string,
    role: "STUDENT" | "COUNSELLOR" = "STUDENT"
): Promise<RegisterResult> {
    // --- Input validation ---
    if (!name || !email || !password) {
        return { success: false, error: "All fields are required." };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters." };
    }

    try {
        // Check if the email is already registered
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: "An account with this email already exists." };
        }

        // Hash the password with bcrypt (10 rounds is a good security/performance tradeoff)
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the new user in the database
        // Note: if you see a TypeScript error on `name`, run `npx prisma generate` after setting DATABASE_URL
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (db.user as any).create({
            data: {
                name,
                email,
                passwordHash,
                role, // role is now passed from signup form
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}
