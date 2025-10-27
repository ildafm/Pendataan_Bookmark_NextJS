import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

const collectionName = "komiks";

export async function GET(request: Request) {
  try {
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;

    let query = adminDb
      .collection(collectionName)
      .where("email", "==", email)
      .orderBy("updated_at", "desc"); // ✅ urutkan berdasarkan updated_at terbaru

    // (Opsional) batasi jumlah data
    // query = query.limit(50);

    const snapshot = await query.get();

    const komiks = snapshot.docs.map((doc) => {
      const d = doc.data();

      // Konversi timestamp → millis
      const toMillis = (ts: any) => {
        if (!ts) return null;
        if (typeof ts.toMillis === "function") return ts.toMillis();
        if (typeof ts.seconds === "number")
          return ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1_000_000);
        return ts;
      };

      return {
        id: doc.id,
        ...d,
        created_at: toMillis(d.created_at),
        updated_at: toMillis(d.updated_at),
      };
    });

    return NextResponse.json({ success: true, data: komiks });
  } catch (error: any) {
    console.error("GET /api/komik error:", error);

    // 🔍 Tangani error index Firestore dengan lebih ramah
    if (error?.code === 9 || error?.message?.includes("requires an index")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Firestore membutuhkan composite index untuk query ini. " +
            "Silakan buka link di error log console untuk membuat index-nya.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
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
    console.error("POST /api/komik error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
