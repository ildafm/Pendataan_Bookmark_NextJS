import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

const collectionName = "jenis_komiks"

export async function GET(request: Request) {
  try {
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;

    const snapshot = await adminDb
      .collection(collectionName)
      .get();

    const komiks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: komiks });
  } catch (error: any) {
    console.error("GET /api/jenis_komik error:", error);
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

    const docRef = await adminDb.collection(collectionName).add({
      ...data,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("POST /api/jenis_komik error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
