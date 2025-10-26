import { headers } from "next/headers";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import KomikTableClient from "./KomikTableClient";

export const dynamic = "force-dynamic";

export async function KomikTableServer() {
  const headersList = await headers();
  const email = headersList.get("x-user-email");

  if (!email) {
    return <div>Anda belum login.</div>;
  }

  const snapshotKomik = await adminDb
    .collection("komiks")
    .where("email", "==", email)
    .get();

  const snapshotJenisKomik = await adminDb
    .collection("jenis_komiks")
    .get();

  const jenisMap = {};
  snapshotJenisKomik.docs.forEach(doc => {
    jenisMap[doc.id] = doc.data(); // bisa juga pilih hanya field 'jenis' jika mau
  });

  // console.log(jenisMap);

  const komikList = snapshotKomik.docs.map((doc) => {
    const data = doc.data();
    const jenisId = data.jenis_komik_ref?._path?.segments[1] ?? null;

    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toMillis?.() ?? null,
      updated_at: data.updated_at?.toMillis?.() ?? null,
      jenis_komik_ref: jenisId ? jenisMap[jenisId]?.jenis ?? null : null, // optional convert
    };
  });

  return <KomikTableClient data={komikList} />;
}
