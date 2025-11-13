import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const adminRoutes = ["/admin"];
const userRoutes = ["/profile", "/orders", "/checkout_details"];
const publicRoutes = ["/login", "/register"];

function buildRedirect(url: string, req: NextRequest, redirectTo?: string | null) {
    const target = new URL(url, req.nextUrl);
    if (redirectTo) {
        target.searchParams.set("redirect", redirectTo);
    }
    return target;
}

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const redirectTo = req.nextUrl.searchParams.get("redirect");

    const isAdminRoute = adminRoutes.some(route => path === route || path.startsWith(`${route}/`));
    const isUserRoute = userRoutes.some(route => path === route || path.startsWith(`${route}/`));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    const cookie = req.cookies.get("session")?.value;

    // No hay cookie
    if (!cookie) {
        if (isAdminRoute || isUserRoute) {
            return NextResponse.redirect(buildRedirect("/login", req, redirectTo));
        }
        return NextResponse.next();
    }

    const session = await decrypt(cookie);

    if (!session?.userId) {
        const res = NextResponse.redirect(buildRedirect("/login", req, redirectTo));
        res.cookies.set("session", "", { expires: new Date(0) });
        return res;
    }

    // Validación de rol
    if (isAdminRoute && session.userRole !== "admin") {
        return NextResponse.redirect(buildRedirect("/", req, "access_denied"));
    }
    if (isUserRoute && !["user", "admin"].includes(session.userRole as string)) {
        return NextResponse.redirect(buildRedirect("/", req, "access_denied"));
    }

    // Usuario autenticado en ruta pública
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL(redirectTo || "/", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
