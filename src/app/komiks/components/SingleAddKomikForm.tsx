"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export default function SingleAddKomikForm({
  jenisKomikList,
  setIsOpenAddKomikForm,
  setAlert,
  setKomiks,
}: {
  jenisKomikList: any[];
  setIsOpenAddKomikForm: any;
  setAlert: any;
  setKomiks: any;
}) {
  const isMobile = useIsMobile();

  // Ubah data dari server menjadi format yang Select butuhkan
  const jenisKomik = (jenisKomikList || []).map((jenis: any) => ({
    label: jenis.jenis, // ganti sesuai field Firestore kamu (misal: jenis.nama)
    value: jenis.id, // atau kode unik jenis komik
  }));

  // State untuk form
  const [form, setForm] = useState({
    judul: "",
    judul_alt: "",
    link_bookmark: "",
    link_cover: "",
    chapter_terakhir: "",
    jenis_komik: jenisKomik[0]?.value,
    status_komik: "BD",
    kualitas_komik: "0",
    deskripsi: "",
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
          description: `Kolom ${label} wajib diisi sebelum menyimpan data.`,
        });
        return;
      }
    }

    try {
      // const token = document.cookie
      //   .split("; ")
      //   .find((row) => row.startsWith("token="))
      //   ?.split("=")[1];

      // if (!token) {
      //   setAlert({
      //     variant: "warning",
      //     title: "Token Tidak Ditemukan",
      //     description:
      //       "Token login tidak ditemukan. Silakan login ulang untuk melanjutkan.",
      //   });
      //   return;
      // }

      const res = await fetch("/api/komik", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        setAlert({
          variant: "success",
          title: "Berhasil!",
          description: "Data komik berhasil disimpan ke Database.",
        });

        const selectedJenis = jenisKomikList.find(
          (j) => j.id === form.jenis_komik,
        );

        const newKomik = {
          id: result.id,
          judul: form.judul,
          judul_alt: form.judul_alt,
          link_bookmark: form.link_bookmark,
          link_cover: form.link_cover,
          chapter_terakhir: form.chapter_terakhir,
          status_komik: form.status_komik,
          kualitas_komik: form.kualitas_komik,
          deskripsi: form.deskripsi,
          jenis_komik_ref: selectedJenis?.jenis || "", // ambil nama jenis, bukan ID
          created_at: Date.now(),
          updated_at: Date.now(),
        };

        if (newKomik) {
          setKomiks((prev: any) => [newKomik, ...prev]);
          setIsOpenAddKomikForm(false);
        }
      } else {
        setAlert({
          variant: "error",
          title: "Gagal!",
          description:
            result.message || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (err: any) {
      console.error("Kesalahan Server: ", err);

      setAlert({
        variant: "error",
        title: "Kesalahan Server",
        description: "Tidak dapat mengirim data ke server. Coba lagi nanti.",
      });
    }
  };

  return (
    <ShowcaseSection title="Tambah data komik" className="space-y-5.5 !p-6.5">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-dark dark:text-white">* Wajib diisi</h5>

        <Button
          label="X"
          variant={"outlineDark"}
          title="Batal"
          shape={"full"}
          size={"small"}
          className="mb-2 text-sm sm:mb-0"
          onClick={() => setIsOpenAddKomikForm(false)}
        />
      </div>

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
          title={"Simpan Data"}
          shape={"full"}
          size={"small"}
          className="mr-4 w-[100px]"
          onClick={() => handleSubmit()}
        />
        <Button
          label="Batal"
          variant={"dark"}
          title={"Batal"}
          shape={"full"}
          size={"small"}
          className="w-[100px]"
          onClick={() => setIsOpenAddKomikForm(false)}
        />
      </div>
    </ShowcaseSection>
  );
}
