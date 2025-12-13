"server-only";

import { headers } from "next/headers";

export async function fetchKomiks() {
  // Ambil cookie dari request user
  const cookie = (await headers()).get("cookie") ?? "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`, {
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/komik/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Gagal fetch komik (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

// import { cookies } from "next/headers";

// export async function fetchKomiks() {
//   const cookieStore = await cookies(); // RequestCookies
//   const token = cookieStore.get("token")?.value;

//   const res = await fetch("/api/komik", {
//     headers: { Authorization: `Bearer ${token}` },
//     cache: "no-store",
//   });
//   if (!res.ok) throw new Error("Gagal fetch komik");

//   return (await res.json()).data;
// }
