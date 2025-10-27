import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import { KomikTableServer } from "./components/KomikTableServer";

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

        <KomikTableServer />
      </div>
    </>
  );
};

export default TablesPage;
