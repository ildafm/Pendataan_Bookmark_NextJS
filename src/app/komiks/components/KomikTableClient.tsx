"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GlobeIcon,
  PencilSquareIcon,
  SearchIcon,
  TrashIcon,
} from "@/assets/icons";
import { DownloadIcon, PreviewIcon } from "../../../components/Tables/icons";
import { cn } from "@/lib/utils";
import { getKualitasKomik, getStatusKomik } from "@/utils/komikHandler";
import {
  formatMillisToDate,
  formatMillisToDaysAgo,
} from "@/utils/generalHandler";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/FormElements/select";
import { useIsMobile } from "@/hooks/use-mobile";
import SingleAddKomikForm from "./SingleAddKomikForm";
import SingleEditKomikForm from "./SingleEditKomikForm";
import { Alert } from "@/components/ui-elements/alert";
import Link from "next/link";

export default function KomikTableClient({
  data,
  jenisKomikList,
}: {
  data: any[];
  jenisKomikList: any[];
}) {
  const isMobile = useIsMobile();

  const [komiks, setKomiks] = useState<any[]>(() => data || []);

  // Hanya set komiks pertama kali saat komponen mount
  useEffect(() => {
    setKomiks(data || []);
  }, []);

  // alert manage ------------------------------------------------
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

  // end alert manage --------------------------------------------

  // start display data -----------------------------------------------
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(5); // jumlah data per halaman - default: 5
  const [search, setSearch] = useState("");

  // add more komik form change manage --------------------------------------------------
  const [isOpenAddKomikForm, setIsOpenAddKomikForm] = useState(false);
  // end add more komik form change manage ----------------------------------------------

  // filter by multi-keyword search
  const filteredData = komiks.filter((item) => {
    if (!search.trim()) return true; // jika search kosong, tetap gunakan data yang ada
    const keywords = search.toLowerCase().trim().split(/\s+/);
    const combined = `
    ${item.judul}
    ${item.jenis_komik_ref}
    ${item.chapter_terakhir}
    ${getStatusKomik(item.status_komik)}
    ${getKualitasKomik(item.kualitas_komik)}
  `.toLowerCase();
    return keywords.every((kw) => combined.includes(kw));
  });

  // end filter data by multi-keyword search

  let displayedData = filteredData.slice(0, rowsPerPage);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;

  displayedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  // end display data -------------------------------------------------

  //  start total entries display -------------------------------------------
  const totalEntries = filteredData.length;
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalEntries);
  //  end total entries display -------------------------------------------

  // start edit form manage -------------------------------------------------
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenEditForm = (item: any) => {
    setSelectedItem(item);
    setIsOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setIsOpenEditForm(false);
    setSelectedItem(null);
  };
  // end edit form manage ----------------------------------------------------

  // handle delete function -------------------------------------------
  const handleDelete = async (id: string) => {
    try {
      // 🔐 Ambil token dari cookie (sama seperti handleSubmit)
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

      // 🚀 Kirim request DELETE ke API
      const res = await fetch(`/api/komik/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setAlert({
          variant: "success",
          title: "Berhasil!",
          description: "Data komik berhasil dihapus dari Database.",
        });

        // ✅ Optimistic update: hapus item dari state tanpa read ulang
        setKomiks((prev) => prev.filter((k) => k.id !== id));
        // fetchKomiks();
      } else {
        setAlert({
          variant: "error",
          title: "Gagal!",
          description:
            result.message || "Terjadi kesalahan saat menghapus data.",
        });
      }
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Kesalahan Server",
        description: "Tidak dapat menghapus data. Coba lagi nanti.",
      });
    }
  };

  // end handle delete function ---------------------------------------

  // useEffectList ----------------------------------------------------
  // scroll ke atas tiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  // end useEffectList ----------------------------------------------------

  return (
    <>
      {/* add add komik form */}
      {isOpenAddKomikForm && (
        <SingleAddKomikForm
          jenisKomikList={jenisKomikList}
          setIsOpenAddKomikForm={setIsOpenAddKomikForm}
          setAlert={setAlert}
          setKomiks={setKomiks}
        />
      )}
      {/* end add komik form */}

      {/* add add komik form */}
      {isOpenEditForm && selectedItem && (
        <SingleEditKomikForm
          item={selectedItem}
          jenisKomikList={jenisKomikList}
          handleCloseEditForm={handleCloseEditForm}
          setAlert={setAlert}
          setKomiks={setKomiks}
        />
      )}
      {/* end add komik form */}
      {/* Table */}
      {!isOpenAddKomikForm && !isOpenEditForm && (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
          {/* RowPerPage and Search Column, add data */}
          <div className="mb-4 flex items-center justify-between">
            {/* Row per page select */}
            <Select
              label="Row per Page"
              items={[
                { label: "5", value: "5" },
                { label: "10", value: "10" },
                { label: "25", value: "25" },
                { label: "50", value: "50" },
                { label: "100", value: "100" },
              ]}
              defaultValue="5"
              prefixIcon={<GlobeIcon />}
              onChange={(e) => {
                setRowPerPage(Number(e.target.value));
                setPage(1);
              }}
            />
            {/* end row per page select */}

            {/* search bar and add data button */}
            <div className="ml-2 flex flex-col-reverse justify-between self-end sm:ml-0 sm:flex-row">
              {/* search bar */}
              <div className="relative w-36 max-w-[300px] sm:mr-2 sm:w-full">
                <input
                  type="search"
                  placeholder="Search"
                  className="flex w-full items-center gap-3.5 rounded-full border bg-gray-3 py-3 pl-[53px] pr-5 transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:outline-none dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />

                <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
              </div>
              {/* end search bar */}

              {/* add data button */}
              <Button
                label={isMobile ? "Tambah Komik" : "+"}
                title="Tambah data komik"
                variant="outlineDark"
                shape="full"
                size="small"
                onClick={() => setIsOpenAddKomikForm(true)}
                className="mb-2 text-sm sm:mb-0"
              />
              {/* end add data button */}
            </div>
          </div>
          {/* End RowPerPage and Search Column */}

          {/* table data */}
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>No</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Terakhir Dibaca</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-x-3.5 gap-y-3.5 md:flex-row">
                      {/* show detail button */}
                      <Link
                        href={`/komiks/${item.id}`}
                        className="hover:text-primary"
                      >
                        <PreviewIcon />
                      </Link>
                      {/* end show detail button */}

                      {/* Edit Button */}
                      <button
                        className="hover:text-primary"
                        onClick={() => handleOpenEditForm(item)}
                      >
                        <PencilSquareIcon />
                      </button>
                      {/* end edit button */}

                      {/* delete button */}
                      <button
                        className="hover:text-primary"
                        onClick={() => {
                          if (
                            confirm(
                              `Anda yakin ingin menghapus data: ${item.judul}?`,
                            )
                          ) {
                            handleDelete(item.id);
                          }
                        }}
                      >
                        <TrashIcon />
                      </button>
                      {/* end delete button */}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <h5 className="text-dark dark:text-white">{item.judul}</h5>
                  </TableCell>
                  <TableCell>
                    <h5 className="text-dark dark:text-white">
                      {item.jenis_komik_ref}
                    </h5>
                    <p className="mt-[3px] text-body-sm font-medium">
                      {getKualitasKomik(item.kualitas_komik)}
                    </p>
                  </TableCell>

                  {/* status */}
                  <TableCell>
                    <div
                      className={cn(
                        "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                        {
                          "bg-[#2F80ED]/[0.15] text-[#2F80ED] dark:bg-[#2F80ED]/[0.08] dark:text-[#2F80ED]":
                            item.status_komik === "SD", // Sedang Dibaca

                          "bg-[#FFA70B]/[0.15] text-[#FFA70B] dark:bg-[#FFA70B]/[0.08] dark:text-[#FFA70B]":
                            item.status_komik === "BeD", // Berhenti Dibaca

                          "bg-[#9B51E0]/[0.15] text-[#9B51E0] dark:bg-[#9B51E0]/[0.08] dark:text-[#9B51E0]":
                            item.status_komik === "MU", // Menunggu Update

                          "bg-[#27AE60]/[0.15] text-[#27AE60] dark:bg-[#27AE60]/[0.08] dark:text-[#27AE60]":
                            item.status_komik === "KT", // Komik Tamat

                          "bg-[#828282]/[0.15] text-[#4F4F4F] dark:bg-[#828282]/[0.08] dark:text-[#828282]":
                            item.status_komik === "BD", // Belum Dibaca

                          "bg-[#EB5757]/[0.15] text-[#EB5757] dark:bg-[#EB5757]/[0.08] dark:text-[#EB5757]":
                            item.status_komik === "DDS", // Drop dari Sumber
                        },
                      )}
                    >
                      {getStatusKomik(item.status_komik)}
                    </div>
                  </TableCell>
                  {/* end status */}

                  {/* chapter */}
                  <TableCell>
                    <h5 className="text-dark dark:text-white">
                      {item.chapter_terakhir}
                    </h5>
                  </TableCell>
                  {/* end chapter */}

                  {/* Terakhir dibaca */}
                  <TableCell>
                    <h5 className="text-dark dark:text-white">
                      {formatMillisToDate(item.updated_at)}
                    </h5>
                    <p className="mt-[3px] text-body-sm font-medium">
                      {formatMillisToDaysAgo(item.updated_at, isMobile)}
                    </p>
                  </TableCell>
                  {/* end Terakhir dibaca */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* end table data */}

          {/* Pagination control */}
          <div className="mt-4 flex flex-col items-center md:flex-row md:justify-between">
            <span>
              {totalEntries > 0
                ? `Showing ${start} to ${end} of ${totalEntries} entries`
                : "Showing 0 to 0 of 0 entries"}
            </span>

            <div className="flex items-center">
              <Button
                label="Prev"
                variant="dark"
                shape="full"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabledButton={page === 1 || totalEntries === 0}
                className="text-sm disabled:opacity-50"
              />
              <span className="mx-4 text-sm text-gray-600">
                {totalEntries === 0
                  ? isMobile
                    ? "0/0"
                    : "Page 0 from 0"
                  : isMobile
                    ? `${page}/${totalPages}`
                    : `Page ${page} from ${totalPages}`}
              </span>
              <Button
                label="Next"
                variant="dark"
                shape="full"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabledButton={page === totalPages || totalEntries === 0}
                className="text-sm disabled:opacity-50"
              />
            </div>
            {/* End Pagination control */}
          </div>
        </div>
      )}
      {/*end  Table */}

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
    </>
  );
}
