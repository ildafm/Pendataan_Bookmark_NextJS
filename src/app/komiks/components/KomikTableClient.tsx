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
import { GlobeIcon, SearchIcon, TrashIcon } from "@/assets/icons";
import { DownloadIcon, PreviewIcon } from "../../../components/Tables/icons";
import { cn } from "@/lib/utils";
import {
  formatMillisToDate,
  formatMillisToDaysAgo,
  getKualitasKomik,
  getStatusKomik,
} from "@/utils/komikHandler";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/FormElements/select";
import { useIsMobile } from "@/hooks/use-mobile";

export default function KomikTableClient({ data }: { data: any[] }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(5); // jumlah data per halaman - default: 5
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  console.log(isMobile);

  // const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  // filter by search
  const filteredData = data.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis_komik_ref.toLowerCase().includes(search.toLowerCase()) ||
      getStatusKomik(item.status_komik)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      getKualitasKomik(item.kualitas_komik)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  let displayedData = filteredData.slice(0, rowsPerPage);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;

  displayedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

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
            onChange={(e) => setRowPerPage(Number(e.target.value))}
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
              <TableHead>Nomor</TableHead>
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
                  <div className="flex items-center gap-x-3.5">
                    <button className="hover:text-primary">
                      <PreviewIcon />
                    </button>
                    <button className="hover:text-primary">
                      <TrashIcon />
                    </button>
                    <button className="hover:text-primary">
                      <DownloadIcon />
                    </button>
                  </div>
                </TableCell>
                <TableCell>{item.judul}</TableCell>
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
                        "bg-[#219653]/[0.08] text-[#219653]":
                          item.status_komik === "SD",
                        "bg-[#D34053]/[0.08] text-[#D34053]":
                          item.status_komik === "BeD",
                        "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                          item.status_komik === "MU",
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
                    {formatMillisToDaysAgo(item.updated_at)}
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
            Showing {page} to {rowsPerPage} of {data.length} entries
          </span>

          <div className="flex items-center">
            <Button
              label="Prev"
              variant="dark"
              shape="full"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
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
              disabled={page === totalPages}
              className="text-sm disabled:opacity-50"
            />
          </div>
          {/* End Pagination control */}
        </div>
      </div>
    </div>
  );
}
