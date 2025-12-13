// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
// const ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

// async function refreshFirebaseToken(refreshToken: string) {
//   const response = await fetch(
//     `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
//     },
//   );
//   const data = await response.json();

//   if (!response.ok) throw new Error("Failed to refresh token");

//   return data.id_token as string;
// }

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   if (!token && !refreshToken) {
//     return NextResponse.redirect(new URL("/auth/sign-in", req.url));
//   }

//   try {
//     const decoded = await verifyFirebaseToken(token!);
//     console.log("✅ Token valid:", decoded.email);
//     const res = NextResponse.next();
//     res.headers.set("x-user-email", decoded.email || "");
//     return res;
//   } catch (err) {
//     // kalau token expired, coba refresh
//     if (refreshToken) {
//       try {
//         const newIdToken = await refreshFirebaseToken(refreshToken);

//         const newRes = NextResponse.next();
//         newRes.cookies.set("token", newIdToken, {
//           httpOnly: true,
//           maxAge: 60 * 60 * 24 * 30, // 30 hari
//         });
//         return newRes;
//       } catch {
//         console.error("❌ Refresh token invalid, redirect to login");
//       }
//     }

//     return NextResponse.redirect(new URL("/auth/sign-in", req.url));
//   }
// }

// async function verifyFirebaseToken(token: string) {
//   const JWKS_URL = `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`;

//   const { default: fetch } = await import("node-fetch");
//   const res = await fetch(JWKS_URL);
//   const jwks = await res.json();

//   const { importJWK } = await import("jose");

//   for (const key of jwks.keys) {
//     const jwk = await importJWK(key, "RS256");
//     try {
//       const { payload } = await jwtVerify(token, jwk, {
//         issuer: ISSUER,
//         audience: FIREBASE_PROJECT_ID,
//       });
//       return payload as any;
//     } catch {}
//   }

//   throw new Error("Invalid Firebase token");
// }

// export const config = {
//   matcher: [
//     // Jalankan middleware di semua halaman,
//     // kecuali halaman login, file statis, favicon, dan API routes
//     "/((?!_next/static|_next/image|favicon.ico|auth/sign-in|api).*)",
//   ],
// };

// import { adminAuth } from "./lib/firebase/firebaseAdmin";

// export async function middleware(req: any) {
//   const session = req.cookies.get("session")?.value;
//   if (!session) return Response.redirect(new URL("/auth/sign-in", req.url));

//   try {
//     await adminAuth.verifySessionCookie(session, true);
//     return Response.next();
//   } catch {
//     return Response.redirect(new URL("/auth/sign-in", req.url));
//   }
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasSession = req.cookies.has("session");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
}
