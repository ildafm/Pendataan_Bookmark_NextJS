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

export function getStatusKomik(status: string) {
  switch (status) {
    case "BD":
      return "Belum Dibaca";
    case "SD":
      return "Sedang Dibaca";
    case "MU":
      return "Menunggu Update";
    case "KT":
      return "Komik Tamat";
    case "BeD":
      return "Berhenti Dibaca";
    case "DDS":
      return "Drop Dari Sumber";
    default:
      return "Kesalahan Membaca Status";
  }
}

// Fungsi ini digunakan untuk mengonversi kode kualitas komik menjadi teks deskriptif yang menunjukkan penilaian terhadap komik.
export function getKualitasKomik(kualitas: string) {
  switch (kualitas) {
    case "0":
      return "Belum Dinilai";
    case "1":
      return "Ampas";
    case "2":
      return "Tidak Bagus";
    case "3":
      return "Lumayan";
    case "4":
      return "Bagus";
    case "5":
      return "Sangat Bagus";
    default:
      return "Kesalahan Membaca Kualitas";
  }
}
