export async function fetchJenisKomik(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jenis_komik`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch jenis komik");
  return (await res.json()).data;
}
