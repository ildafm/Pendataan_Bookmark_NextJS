import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { verifyAuthToken } from "@/lib/verifyToken";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const decoded = await verifyAuthToken(request);
    const doc = await adminDb.collection("komiks").doc(params.id).get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");
    if (doc.data()?.email !== decoded.email)
      throw new Error("Tidak punya akses ke data ini");

    return NextResponse.json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // ✅ unwrap promise dari params
  console.log("🔥 PUT called for:", id);

  try {
    // ✅ Verifikasi token & ambil email user
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;

    // Ambil data body
    const data = await request.json();

    // 🔗 Buat reference ke jenis_komiks berdasarkan ID yang dikirim
    const jenisKomikRef = adminDb
      .collection("jenis_komiks")
      .doc(data.jenis_komik);

    // 🔍 Ambil dokumen komik berdasarkan ID
    const ref = adminDb.collection("komiks").doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");

    // 🛡️ Cegah update jika bukan pemilik data
    if (doc.data()?.email !== email)
      throw new Error("Tidak punya akses ke data ini");

    // 🧩 Update field ke Firestore
    await ref.update({
      judul: data.judul,
      judul_alt: data.judul_alt,
      link_bookmark: data.link_bookmark,
      link_cover: data.link_cover,
      chapter_terakhir: data.chapter_terakhir,
      status_komik: data.status_komik,
      kualitas_komik: data.kualitas_komik,
      deskripsi: data.deskripsi,
      jenis_komik_ref: jenisKomikRef, // ✅ relasi ke jenis_komiks
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("🔥 ERROR PUT:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // ✅ unwrap params (Next.js App Router)

  try {
    // ✅ Verifikasi token & ambil email user
    const decoded = await verifyAuthToken(request);
    const email = decoded.email;

    // 🔍 Ambil dokumen dari Firestore
    const ref = adminDb.collection("komiks").doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Dokumen tidak ditemukan");

    // 🛡️ Cegah delete jika bukan pemilik data
    if (doc.data()?.email !== email)
      throw new Error("Tidak punya akses ke data ini");

    // 🗑️ Hapus dokumen
    await ref.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 },
    );
  }
}
