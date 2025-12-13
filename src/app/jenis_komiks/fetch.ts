"server-only";

export async function fetchJenisKomik() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jenis_komik`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Gagal fetch jenis komik");
  }

  const json = await res.json();
  return json.data;
}
