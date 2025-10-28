"server only";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import { cookies } from "next/headers";
import KomikTableClient from "./components/KomikTableClient";
import SingleAddKomikForm from "./components/SingleAddKomikForm";

export const metadata: Metadata = {
  title: "Semua Komik",
};

const KomikPage = async () => {
  const cookieStore = await cookies(); // RequestCookies
  const token = cookieStore.get("token")?.value;

  if (!token) return <div>Anda belum login.</div>;

  // Jalankan kedua fetch secara paralel agar lebih cepat (bukan sequential)
  const [komikRes, jenisKomikRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jenis_komik`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  // Validasi response
  if (!komikRes.ok) {
    console.error("❌ Gagal fetch komik:", await komikRes.text());
    return <div>Gagal memuat data komik.</div>;
  }
  if (!jenisKomikRes.ok) {
    console.error("❌ Gagal fetch jenis komik:", await jenisKomikRes.text());
    return <div>Gagal memuat data jenis komik.</div>;
  }

  // Parse JSON
  const [komikResult, jenisKomikResult] = await Promise.all([
    komikRes.json(),
    jenisKomikRes.json(),
  ]);

  const komikList = komikResult.data || [];
  const jenisKomikList = jenisKomikResult.data || [];

  // Buat map untuk jenis komik agar lookup cepat
  const jenisMap = Object.fromEntries(
    jenisKomikList.map((j: any) => [j.id, j.jenis]),
  );

  // Gabungkan data komik dengan hanya field `jenis`
  const mergedKomikList = komikList.map((komik: any) => {
    let jenisId: string | null = null;

    if (komik.jenis_komik_ref) {
      // Ambil ID referensi dari berbagai bentuk
      if (typeof komik.jenis_komik_ref === "string") {
        jenisId = komik.jenis_komik_ref;
      } else if (komik.jenis_komik_ref._path?.segments) {
        const segments = komik.jenis_komik_ref._path.segments;
        jenisId = segments[segments.length - 1]; // ambil ID terakhir
      } else if (komik.jenis_komik_ref.id) {
        jenisId = komik.jenis_komik_ref.id;
      }
    }
    return {
      ...komik,
      jenis_komik_ref: jenisMap[jenisId || ""] || null, // hanya ambil string jenis
    };
  });

  return (
    <>
      <Breadcrumb pageName="Semua Komik" />

      <div className="space-y-10">
        {/* <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense> */}

        <KomikTableClient
          data={mergedKomikList}
          jenisKomikList={jenisKomikList}
        />
      </div>
    </>
  );
};

export default KomikPage;
