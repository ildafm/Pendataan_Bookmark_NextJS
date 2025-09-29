import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { total_komiks, sedang_dibaca, menunggu_update, komik_bagus } = await getOverviewData();
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Komik"
        data={{
          ...total_komiks,
          value: compactFormat(total_komiks.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Sedang Dibaca"
        data={{
          ...sedang_dibaca,
          value: compactFormat(sedang_dibaca.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Menunggu Update"
        data={{
          ...menunggu_update,
          value: compactFormat(menunggu_update.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Komik Bagus"
        data={{
          ...komik_bagus,
          value: compactFormat(komik_bagus.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
