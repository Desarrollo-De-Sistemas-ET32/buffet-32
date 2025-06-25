import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definir las rutas públicas
const publicRoutes = ["/", "/api/public", "/sign-in", "/sign-up"];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals y archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Incluir todas las rutas API
    "/api/(.*)",
  ],
}; 