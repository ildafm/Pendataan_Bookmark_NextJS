"server-only";

import { headers } from "next/headers";

const KOMIK_API_PATH = `${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`;

export async function fetchKomiks() {
  // Ambil cookie dari request user
  const cookie = (await headers()).get("cookie") ?? "";

  const res = await fetch(KOMIK_API_PATH, {
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal fetch komik");
  }

  const json = await res.json();
  return json.data;
}

export async function fetchKomikById(id: string) {
  const res = await fetch(`${KOMIK_API_PATH}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Gagal fetch komik (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}
