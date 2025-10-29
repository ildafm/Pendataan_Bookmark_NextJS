"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from "@/components/ui-elements/alert";
import { Button } from "@/components/ui-elements/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export default function SingleEditKomikForm({
  item,
  jenisKomikList,
  handleCloseEditForm,
}: {
  item: any;
  jenisKomikList: any[];
  handleCloseEditForm: any;
}) {
  useEffect(() => {
    console.log("Form ID:", form.id);
    console.log("Fetch URL:", `/api/komik/${form.id}`);
  }, [item]);

  const isMobile = useIsMobile();

  // Ubah data dari server menjadi format yang Select butuhkan
  const jenisKomik = (jenisKomikList || []).map((jenis: any) => ({
    label: jenis.jenis, // ganti sesuai field Firestore kamu (misal: jenis.nama)
    value: jenis.id, // atau kode unik jenis komik
  }));

  const matchedJenis = jenisKomik.find(
    (j) => j.label.toLowerCase() === item.jenis_komik_ref?.toLowerCase(),
  );

  // State untuk form
  const [form, setForm] = useState({
    id: item.id,
    judul: item.judul,
    judul_alt: item.judul_alt,
    link_bookmark: item.link_bookmark,
    link_cover: item.link_cover,
    chapter_terakhir: item.chapter_terakhir,
    jenis_komik: matchedJenis?.value || jenisKomik[0]?.value,
    status_komik: item.status_komik,
    kualitas_komik: item.kualitas_komik,
    deskripsi: item.deskripsi,
  });
  // Handle perubahan input
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🚀 Handle submit form
  const handleSubmit = async () => {
    // 🔍 Validasi input wajib
    const requiredFields = {
      judul: "Judul Komik",
      link_bookmark: "Link Bookmark",
      link_cover: "Link Cover",
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!form[key].trim()) {
        setAlert({
          variant: "warning",
          title: "Attention Needed",
          description: `Kolom ${label} wajib diisi sebelum menyimpan perubahan.`,
        });
        return;
      }
    }

    try {
      // 🔐 Ambil token dari cookie (sama seperti add form)
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setAlert({
          variant: "warning",
          title: "Token Tidak Ditemukan",
          description:
            "Token login tidak ditemukan. Silakan login ulang untuk melanjutkan.",
        });
        return;
      }

      // 🛠️ Kirim request ke API edit/update
      const res = await fetch(`/api/komik/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        setAlert({
          variant: "success",
          title: "Berhasil!",
          description: "Data komik berhasil diperbarui di Database.",
        });
        handleCloseEditForm(); // Tutup form setelah sukses
      } else {
        setAlert({
          variant: "error",
          title: "Gagal!",
          description:
            result.message || "Terjadi kesalahan saat memperbarui data.",
        });
      }
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Kesalahan Server",
        description: "Tidak dapat mengirim data ke server. Coba lagi nanti.",
      });
    }
  };

  // alert handle -----------------------------------------------------
  const [alert, setAlert] = useState<{
    variant: any;
    title: string;
    description: string;
  } | null>(null);
  const [visible, setVisible] = useState(false);

  // hilangkan alert setelah beberapa detik
  useEffect(() => {
    if (alert) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500); // mulai fade-out
      const removeTimer = setTimeout(() => setAlert(null), 4000); // hapus dari DOM
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [alert]);
  // end alert handle -----------------------------------------------------

  return (
    <ShowcaseSection title="Tambah data komik" className="space-y-5.5 !p-6.5">
      <h5 className="font-bold text-dark dark:text-white">* Wajib diisi</h5>

      {/* Alert */}
      {alert && (
        <div
          className={`fixed right-6 top-20 z-50 transition-all duration-500 ${
            visible ? "-translate-x-0 opacity-100" : "translate-x-2 opacity-0"
          }`}
        >
          <Alert
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
          />
        </div>
      )}
      {/* end Alert */}

      {/* Judul, Judul Alternatif */}
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <InputGroup
          className="flex-1"
          label="Judul Komik*"
          placeholder="Input Judul Komik | max: 255 karakter"
          type="text"
          value={form.judul}
          maxChar={255}
          handleChange={(e: any) => handleChange("judul", e.target.value)}
        />
        <InputGroup
          className="flex-1"
          label="Judul Alternatif"
          placeholder="Input Judul Alternatif | max: 300 karakter"
          type="text"
          value={form.judul_alt}
          maxChar={300}
          handleChange={(e: any) => handleChange("judul_alt", e.target.value)}
        />
      </div>

      {/* Link, Cover, Chapter */}
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <InputGroup
          className="flex-1"
          label="Link Bookmark*"
          placeholder="https://... | max: 255 karakter"
          type="text"
          value={form.link_bookmark}
          maxChar={255}
          handleChange={(e: any) =>
            handleChange("link_bookmark", e.target.value)
          }
        />
        <InputGroup
          className="flex-1"
          label="Link Cover*"
          placeholder="https://... | max: 255 karakter"
          type="text"
          value={form.link_cover}
          maxChar={255}
          handleChange={(e: any) => handleChange("link_cover", e.target.value)}
        />
        <InputGroup
          className="flex-1"
          label="Chapter Terakhir"
          placeholder="ex: 17.2 | max:10 karakter"
          type="text"
          value={form.chapter_terakhir}
          maxChar={10}
          handleChange={(e: any) =>
            handleChange("chapter_terakhir", e.target.value)
          }
        />
      </div>
      {/* Jenis, Status, Kualitas */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Select
          label="Jenis Komik*"
          items={jenisKomik}
          defaultValue={form.jenis_komik}
          // value={form.jenis_komik}
          onChange={(e) => handleChange("jenis_komik", e.target.value)}
          className="flex-1"
        />

        <Select
          label="Status Komik*"
          items={[
            { label: "Belum dibaca", value: "BD" },
            { label: "Sedang dibaca", value: "SD" },
            { label: "Menunggu update", value: "MU" },
            { label: "Berhenti dibaca", value: "BeD" },
            { label: "Komik tamat", value: "KT" },
            { label: "Drop dari sumber", value: "DDS" },
          ]}
          defaultValue={form.status_komik}
          onChange={(e) => handleChange("status_komik", e.target.value)}
          className="flex-1"
        />

        <Select
          label="Kualitas Komik*"
          items={[
            { label: "Belum Dinilai", value: "0" },
            { label: "Sangat Bagus", value: "5" },
            { label: "Bagus", value: "4" },
            { label: "Lumayan", value: "3" },
            { label: "Tidak Bagus", value: "2" },
            { label: "Ampas", value: "1" },
          ]}
          defaultValue={form.kualitas_komik}
          // value={form.kualitas_komik}
          onChange={(e) => handleChange("kualitas_komik", e.target.value)}
          className="flex-1"
        />
      </div>
      {/* Deskripsi */}
      <InputGroup
        label="Deskripsi"
        placeholder="opsional | max:300 Karakter"
        type="text"
        value={form.deskripsi}
        handleChange={(e: any) => handleChange("deskripsi", e.target.value)}
      />
      {/* Tombol */}
      <div>
        <Button
          label="Simpan"
          variant={"primary"}
          shape={"full"}
          size={"small"}
          className="mr-4 w-[100px]"
          onClick={() => handleSubmit()}
        />
        <Button
          label="Batal"
          variant={"dark"}
          shape={"full"}
          size={"small"}
          className="w-[100px]"
          onClick={() => handleCloseEditForm()}
        />
      </div>
    </ShowcaseSection>
  );
}
