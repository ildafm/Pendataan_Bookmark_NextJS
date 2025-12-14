"server-only";
import { headers } from "next/headers";

export async function fetchJenisKomik() {
  // Ambil cookie dari request user
  const cookie = (await headers()).get("cookie") ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jenis_komik`,
    {
      headers: {
        cookie,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Gagal fetch jenis komik");
  }

  const json = await res.json();
  return json.data;
}
