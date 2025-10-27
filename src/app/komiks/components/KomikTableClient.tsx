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
import ModalEditKomik from "./ModalEditKomik";

export default function KomikTableClient({ data }: { data: any[] }) {
  const isMobile = useIsMobile();

  // start display data -----------------------------------------------
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(5); // jumlah data per halaman - default: 5
  const [search, setSearch] = useState("");

  const totalEntries = data.length;
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalEntries);

  // const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  // filter by search
  // filter by multi-keyword search
  const filteredData = data.filter((item) => {
    // pecah input menjadi array kata (hapus spasi ganda)
    const keywords = search.toLowerCase().trim().split(/\s+/);

    // gabungkan semua kolom jadi satu string agar lebih simpel untuk dicari
    const combined = `
    ${item.judul}
    ${item.jenis_komik_ref}
    ${getStatusKomik(item.status_komik)}
    ${getKualitasKomik(item.kualitas_komik)}
  `.toLowerCase();

    // pastikan SEMUA kata ada di teks gabungan
    return keywords.every((kw) => combined.includes(kw));
  });

  let displayedData = filteredData.slice(0, rowsPerPage);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;

  displayedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  // end display data -------------------------------------------------

  // start modal manage -------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item: any) => {
    // console.log("open modal");

    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // console.log("close modal");

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // end modal manage ----------------------------------------------------

  // scroll ke atas tiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div>
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        {/* RowPerPage and Search Column */}
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

          {/* search bar */}
          <div className="relative w-34 max-w-[300px] self-end md:w-full">
            <input
              type="search"
              placeholder="Search"
              className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
          </div>
          {/* end search bar */}
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
              <TableHead>Terakhir Dibaca</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-center gap-x-3.5 gap-y-3.5 md:flex-row">
                    <button className="hover:text-primary">
                      <PreviewIcon />
                    </button>
                    <button
                      className="hover:text-primary"
                      onClick={() => handleOpenModal(item)}
                    >
                      <PencilSquareIcon />
                    </button>
                    <button className="hover:text-primary">
                      <TrashIcon />
                    </button>
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
                <TableCell>
                  <h5 className="text-dark dark:text-white">
                    {formatMillisToDate(item.updated_at)}
                  </h5>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {formatMillisToDaysAgo(item.updated_at, isMobile)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* end table data */}

        {/* Pagination control */}
        <div className="mt-4 flex flex-col items-center md:flex-row md:justify-between">
          <span>
            Showing {start} to {end} of {totalEntries} entries
          </span>

          <div className="flex items-center">
            <Button
              label="Prev"
              variant="dark"
              shape="full"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabledButton={page === 1}
              className="text-sm disabled:opacity-50"
            />
            <span className="mx-4 text-sm text-gray-600">
              {isMobile
                ? `${page}/${totalPages}`
                : `Page ${page} from ${totalPages}`}
            </span>
            <Button
              label="Next"
              variant="dark"
              shape="full"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabledButton={page === totalPages}
              className="text-sm disabled:opacity-50"
            />
          </div>
          {/* End Pagination control */}

          {/* modal control */}

          {isModalOpen && selectedItem && (
            <ModalEditKomik item={selectedItem} onClose={handleCloseModal} />
          )}
          {/* end modal control */}
        </div>
      </div>
    </div>
  );
}
