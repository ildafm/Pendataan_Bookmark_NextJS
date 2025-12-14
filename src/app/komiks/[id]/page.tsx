import { Metadata } from "next";
import { fetchKomikById } from "../handler";

export const metadata: Metadata = {
  title: "Detail Komik",
};

interface Komik {
  id: string;
  judul: string;
  judul_alt?: string;
  link_bookmark: string;
  chapter_terakir: string;
  link_cover: string;
  jenis_komik_ref: any;
  status_komik: string;
  kualitas_komik: string;
  deskripsi?: string;
  created_at: any;
  updated_at: any;
}

export default async function KomikDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params; // 🧩 tunggu params selesai
  const { id } = resolvedParams;

  let komik: Komik | null = null;

  try {
    komik = await fetchKomikById(id);
  } catch (error) {
    console.error("Gagal mengambil data komik:", error);
  }

  if (!komik) {
    return (
      <div className="p-4 text-red-500">❌ Data komik tidak ditemukan.</div>
    );
  }

  console.log(komik);

  return <div>{komik.judul}</div>;
}
