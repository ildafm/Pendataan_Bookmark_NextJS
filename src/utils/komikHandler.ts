export function countByStatus(komiks: any[], status: string) {
  return komiks.filter((k) => k.status_komik === status).length;
}

// utils/komikHandler.ts
export function countByKualitas(komiks: any[], kualitas: string | string[]) {
  if (Array.isArray(kualitas)) {
    return komiks.filter((k) => kualitas.includes(k.kualitas_komik)).length;
  }
  return komiks.filter((k) => k.kualitas_komik === kualitas).length;
}
