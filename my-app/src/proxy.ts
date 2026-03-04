import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const { pathname } = request.nextUrl;

    // 1. Allow the request to continue if:
    // - A session exists
    // - OR the user is already on the landing page ("/")
    // - OR the user is trying to hit an auth route
    if (session || pathname === "/" || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }
    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if(!session) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',

  ],
};