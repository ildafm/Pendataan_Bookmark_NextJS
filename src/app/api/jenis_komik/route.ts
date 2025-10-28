import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

const collectionName = "jenis_komiks";

export async function GET(request: Request) {
  try {
    const decoded = await verifyAuthToken(request);

    const snapshot = await adminDb
      .collection(collectionName)
      .orderBy("created_at", "asc")
      .get();

    const jenis_komiks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: jenis_komiks });
  } catch (error: any) {
    console.error("GET /api/jenis_komik error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
