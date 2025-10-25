import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";
import { KomikTable } from "./komiks-table";

export const metadata: Metadata = {
  title: "Semua Komik",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Semua Komik" />

      <div className="space-y-10">
        {/* <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense> */}

        <KomikTable />
      </div>
    </>
  );
};

export default TablesPage;
