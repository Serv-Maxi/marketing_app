import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = request.nextUrl.pathname;

  // // If it's the root path (/) or exact domain without path
  // if (path === "/") {
  //   // Redirect to /home
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }

  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
