// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	const pathname = req.nextUrl.pathname;

	const isPublic = publicRoutes.includes(pathname);
	const isAuthPage = pathname === "/login" || pathname === "/register";

	if (!token && !isPublic) {
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
	// matcher: ["/((?!_next|favicon.ico).*)"],
};
