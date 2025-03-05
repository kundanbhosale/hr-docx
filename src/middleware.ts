import { NextResponse } from "next/server";

export function middleware(req) {
  // const headers = new Headers(request.headers);
  // headers.set("x-current-path", request.nextUrl.pathname);
  const { nextUrl, headers } = req;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("x-current-path", nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return response;
}

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: [
    // Always run for API routes
    "/(api|trpc|app)(.*)",

    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
