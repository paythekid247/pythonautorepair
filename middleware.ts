import { NextRequest, NextResponse } from "next/server";

const USER = "admin";
const PASS = "PythonAuto1"; // change this

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const encoded = authHeader.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Python Auto Repair"',
    },
  });
}

export const config = {
  matcher: ["/((?!api).*)"],
};
