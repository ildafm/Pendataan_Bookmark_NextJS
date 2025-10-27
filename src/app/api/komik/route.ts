import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

export async function GET(request: Request) {
  try {
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;

    const snapshot = await adminDb
      .collection("komiks")
      .where("email", "==", email)
      .get();

    const komiks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: komiks });
  } catch (error: any) {
    console.error("GET /api/komik error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;
    const data = await request.json();

    const docRef = await adminDb.collection("komiks").add({
      ...data,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("POST /api/komik error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
