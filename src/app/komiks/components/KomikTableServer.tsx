import { cookies } from "next/headers";
import KomikTableClient from "./KomikTableClient";

export const dynamic = "force-dynamic";

export async function KomikTableServer() {
  const cookieStore = cookies();
  console.log("cookie: ", cookieStore);

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Anda belum login.</div>;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Gagal fetch komik:", await res.text());
    return <div>Gagal memuat data komik.</div>;
  }

  const result = await res.json();
  const komikList = result.data || [];

  return <KomikTableClient data={komikList} />;
}
