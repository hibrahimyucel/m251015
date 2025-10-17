import { NextRequest, NextResponse } from "next/server";
/*
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  //"/",
  "/api/dbsql",
  "/api/clerk(.*)",
]);

*/
export function middleware(request: NextRequest) {
  const headers = request.headers;
  const origin = headers.get("origin") as string;
  /*if (allowedOrigins.includes(origin))
   */

  const response = NextResponse.next();
  response.headers.append("Access-Control-Allow-Origin", origin);
  return response;
}

/*export default middleware( ( request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  const allowedOrigins = [
    "http://localhost:3000",
    "https://dalgiclar.mmbis.com.tr",
  ];
  const headers = request.headers;
  const origin = headers.get("origin") as string;
  /*if (allowedOrigins.includes(origin))
   

  const response = NextResponse.next();
  response.headers.append("Access-Control-Allow-Origin", origin);
  return response;
});
*/
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
