// src/app/api/auth/session/route.ts
export const runtime = "nodejs";

import { adminAuth } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    const decoded = await adminAuth.verifyIdToken(idToken);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 hari / max 14 hari
    });

    const res = NextResponse.json({ uid: decoded.uid });

    res.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("SESSION ERROR:", error);
    return NextResponse.json(
      { error: "Session creation failed" },
      { status: 401 },
    );
  }
}
