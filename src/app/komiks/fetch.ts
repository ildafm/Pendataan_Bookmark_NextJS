"server-only";

import { cookies } from "next/headers";

export async function fetchKomiks() {
  const cookieStore = await cookies(); // RequestCookies
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch komik");

  return (await res.json()).data;
}

export async function fetchKomikById(id: string) {
  const cookieStore = await cookies(); // RequestCookies
  const token = cookieStore.get("token")?.value;

  // console.log("🔹 TOKEN DITEMUKAN:", token ? "ADA" : "TIDAK ADA");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/komik/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  // console.log("🔹 STATUS RESPONSE:", res.status);

  if (!res.ok) throw new Error(`Gagal fetch komik (${res.status})`);

  return (await res.json()).data;
}
