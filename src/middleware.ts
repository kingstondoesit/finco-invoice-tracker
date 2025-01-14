import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(request: NextRequest) {
    console.log(request.nextUrl.pathname);
}, {
    isReturnToCurrentPage: true,
}
);

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - auth (authentication routes)
        * - robots.txt (robots.txt file)
        * - images (image directory)
        * - login (login page)
        * - home page (represented with $ after beginning /)
        * - dashboard page
        */
        '/((?!api|_next/static|_next/image|favicon.ico|auth|robots.txt|images|login|$).*)', 
        ]
};
