import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  try {
    // 🔒 Verifikasi JWT secara manual di Edge Runtime
    const decoded = await verifyFirebaseToken(token);

    console.log("✅ Middleware verified:", decoded.email);

    const res = NextResponse.next();
    res.headers.set("x-user-email", decoded.email || "");

    return res;
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
}

async function verifyFirebaseToken(token: string) {
  const JWKS_URL = `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`;

  const { default: fetch } = await import("node-fetch");
  const res = await fetch(JWKS_URL);
  const jwks = await res.json();

  const { importJWK } = await import("jose");

  for (const key of jwks.keys) {
    const jwk = await importJWK(key, "RS256");
    try {
      const { payload } = await jwtVerify(token, jwk, {
        issuer: ISSUER,
        audience: FIREBASE_PROJECT_ID,
      });
      return payload as any;
    } catch {}
  }

  throw new Error("Invalid Firebase token");
}

export const config = {
  matcher: ["/komik/:path*", "/komiks/:path*"],
};
