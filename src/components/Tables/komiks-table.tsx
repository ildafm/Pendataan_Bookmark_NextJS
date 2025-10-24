import { TrashIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { getAllKomiks, getInvoiceTableData } from "./fetch";
import { DownloadIcon, PreviewIcon } from "./icons";

export async function KomikTable() {
  // const data = await getInvoiceTableData();
  const data = await getAllKomiks();

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">Nomor</TableHead>
            <TableHead className="">Actions</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Terakhir Dibaca</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-[#eee] dark:border-dark-3">
              {/* Cell Nomor */}
              <TableCell className="min-w-[155px] xl:pl-7.5">
                <h5 className="text-dark dark:text-white">{index + 1}</h5>
              </TableCell>
              {/* end Cell Nomor */}

              {/* Cell Aksi */}
               <TableCell className="">
                <div className="flex items-center gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">View Invoice</span>
                    <PreviewIcon />
                  </button>

                  <button className="hover:text-primary">
                    <span className="sr-only">Delete Invoice</span>
                    <TrashIcon />
                  </button>

                  <button className="hover:text-primary">
                    <span className="sr-only">Download Invoice</span>
                    <DownloadIcon />
                  </button>
                </div>
              </TableCell>
              {/* end Cell Aksi */}

              {/* Cell Judul */}
              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(item.date).format("MMM DD, YYYY")}
                </p>
              </TableCell>
              {/* end cell judul */}

              {/* cell jenis dan kualitas */}
              <TableCell className="">
                <h5 className="text-dark dark:text-white">{item.name}</h5>
                <p className="mt-[3px] text-body-sm font-medium">
                  ${item.price}
                </p>
              </TableCell>
              {/* end cell jenis dan kualitas */}

               {/* cell status */}
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                        item.status === "Paid",
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        item.status === "Unpaid",
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        item.status === "Pending",
                    },
                  )}
                >
                  {item.status}
                </div>
              </TableCell>
              {/* end cell status */}

              {/* cell terakhir dibaca */}
              <TableCell className="">
                <h5 className="text-dark dark:text-white">{item.name}</h5>
                <p className="mt-[3px] text-body-sm font-medium">
                  ${item.price}
                </p>
              </TableCell>
              {/* end cell terakhir dibaca */}

             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
