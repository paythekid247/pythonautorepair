import { NextRequest, NextResponse } from "next/server";

function decodeBasicAuth(authHeader: string) {
  // authHeader like: "Basic base64(user:pass)"
  const encoded = authHeader.split(" ")[1] || "";
  // atob exists in Edge runtime
  const decoded = atob(encoded);
  const idx = decoded.indexOf(":");
  if (idx === -1) return { user: "", pass: "" };
  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

export function middleware(req: NextRequest) {
  const USER = process.env.BASIC_AUTH_USER || "admin";
  const PASS = process.env.BASIC_AUTH_PASS || "PythonAuto1";

  const authHeader = req.headers.get("authorization") || "";

  if (authHeader.startsWith("Basic ")) {
    const { user, pass } = decodeBasicAuth(authHeader);
    if (user === USER && pass === PASS) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Python Auto Repair"' },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)",
  ],
};
