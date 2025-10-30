import { cookies } from "next/headers";

export async function fetchJenisKomik() {
  const cookieStore = await cookies(); // RequestCookies
  const token = cookieStore.get("token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jenis_komik`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Gagal fetch jenis komik");
  return (await res.json()).data;
}
