import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAuthToken(request);
    const doc = await adminDb.collection("komiks").doc(params.id).get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");
    if (doc.data()?.email !== decoded.email)
      throw new Error("Tidak punya akses ke data ini");

    return NextResponse.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAuthToken(request);
    const data = await request.json();

    const ref = adminDb.collection("komiks").doc(params.id);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");
    if (doc.data()?.email !== decoded.email)
      throw new Error("Tidak punya akses ke data ini");

    await ref.update({ ...data, updated_at: new Date() });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAuthToken(request);
    const ref = adminDb.collection("komiks").doc(params.id);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");
    if (doc.data()?.email !== decoded.email)
      throw new Error("Tidak punya akses ke data ini");

    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
