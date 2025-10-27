// types/komik.ts
export interface Komik {
  id?: string; // id Firestore doc
  judul: string;
  jenis_komik_ref: string;
  status_komik: string;
  kualitas_komik: string;
  createdAt?: string;
  updatedAt?: string;
}
