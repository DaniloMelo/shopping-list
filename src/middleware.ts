import { NextRequest, NextResponse } from "next/server";
import TokenService from "./lib/TokenService";

const tokenService = new TokenService();

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("sessionToken")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await tokenService.verify(sessionToken);

    const response = NextResponse.next();
    response.headers.set("x-user-data", sessionToken);

    return response;
  } catch (error) {
    console.error("Error in middleware: ", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/"],
};
