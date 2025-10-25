import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const email = headersList.get("x-user-email");

  if (!email) return NextResponse.json([], { status: 401 });

  const snapshot = await adminDb
    .collection("komiks")
    .where("email", "==", email)
    .get();

  const komikList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(komikList);
}
