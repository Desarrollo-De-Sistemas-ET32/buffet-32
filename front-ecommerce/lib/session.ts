"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    throw new Error("SESSION_SECRET is not defined in environment variables");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, userRole: string = "user") {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ userId, userRole, expiresAt });
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Allow non-secure in development
        expires: expiresAt,
        path: "/", // Ensure cookie is available across all routes
        sameSite: "strict", // Prevent CSRF
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

type SessionPayload = {
    userId: string;
    userRole: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    if (!session) {
        console.log("No session cookie found.");
        return null;
    }

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        // Check if token is expired
        if (new Date(payload.expiresAt as string) < new Date()) {
            console.log("Session token has expired.");
            return null;
        }
        return payload;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Failed to verify session:", error.name, error.message);
        } else {
            console.error("Failed to verify session:", error);
        }
        return null;
    }
}



export async function checkSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;
    console.log("Session cookie:", cookie); // Debug log

    if (!cookie) {
        return { isAuthenticated: false, userId: null, userRole: null };
    }

    const session = await decrypt(cookie);
    console.log("Decrypted session:", session); // Debug log

    if (session?.userId) {
        return {
            isAuthenticated: true,
            userId: session.userId,
            userRole: session.userRole || "user",
        };
    }

    return { isAuthenticated: false, userId: null, userRole: null };
}