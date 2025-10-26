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

export function formatMillisToDate(millis: number): string {
  const date = new Date(millis);

  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear())

  return `${day} ${month} ${year}`;
}

export function formatMillisToDaysAgo(millis: number): string {
  const now = Date.now();
  const diff = now - millis;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (years < 5) return `${years} year${years > 1 ? "s" : ""} ago`;

  return "a very long time ago";
}