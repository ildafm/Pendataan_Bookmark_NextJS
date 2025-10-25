"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from "@/assets/icons";
import { DownloadIcon, PreviewIcon } from "../../../components/Tables/icons";
import { cn } from "@/lib/utils";
import { getStatusKomik } from "@/utils/komikHandler";

export default function KomikTableClient({ data }: { data: any[] }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // jumlah data per halaman

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  // scroll ke atas tiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div>
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>Nomor</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terakhir Dibaca</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-x-3.5">
                    <button className="hover:text-primary"><PreviewIcon /></button>
                    <button className="hover:text-primary"><TrashIcon /></button>
                    <button className="hover:text-primary"><DownloadIcon /></button>
                  </div>
                </TableCell>
                <TableCell>{item.judul}</TableCell>
                <TableCell>{item.jenis_komik_ref}</TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#219653]": item.status_komik === "SD",
                        "bg-[#D34053]/[0.08] text-[#D34053]": item.status_komik === "BeD",
                        "bg-[#FFA70B]/[0.08] text-[#FFA70B]": item.status_komik === "MU",
                      },
                    )}
                  >
                    {getStatusKomik(item.status_komik)}
                  </div>
                </TableCell>
                <TableCell>{item.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination control */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Halaman {page} dari {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
