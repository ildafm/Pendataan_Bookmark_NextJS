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

export function formatMillisToDaysAgo(millis: number, isMobile: boolean = false): string {
  const now = Date.now();
  const diff = now - millis;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const short = isMobile;

  const thresholds = [
    { value: seconds, limit: 60, short: "just now", long: "just now" },
    { value: minutes, limit: 60, short: `${minutes}min ago`, long: `${minutes} minute${minutes > 1 ? "s" : ""} ago` },
    { value: hours,   limit: 24, short: `${hours}h ago`, long: `${hours} hour${hours > 1 ? "s" : ""} ago` },
    { value: days,    limit: 30, short: `${days}d ago`, long: `${days} day${days > 1 ? "s" : ""} ago` },
    { value: months,  limit: 12, short: `${months}m ago`, long: `${months} month${months > 1 ? "s" : ""} ago` },
    { value: years,   limit: 5,  short: `${years}y ago`, long: `${years} year${years > 1 ? "s" : ""} ago` },
  ];

  for (const { value, limit, short: s, long: l } of thresholds) {
    if (value < limit) return short ? s : l;
  }

  return short ? "long time" : "a very long time ago";
}