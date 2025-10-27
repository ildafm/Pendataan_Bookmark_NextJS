export async function fetchKomiksServer(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/komik`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch komik");
  return (await res.json()).data;
}
