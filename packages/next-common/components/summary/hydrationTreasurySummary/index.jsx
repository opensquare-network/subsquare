import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SpendPeriod from "next-common/components/treasury/status/summarys/spendPeriod";
import {
  NextBurnItem,
  ToBeAwardedItem,
} from "next-common/components/summary/treasurySummary";
import ValueDisplay from "next-common/components/valueDisplay";
import { useContextApi } from "next-common/context/api";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";

function HydrationAvailableItem({ data, isLoading }) {
  return (
    <SummaryItem title="Total">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <ValueDisplay value={data?.total ?? 0} symbol="" prefix="$" />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

export default function HydrationTreasurySummary({ data, isLoading }) {
  const { price } = useFiatPriceSnapshot();
  const api = useContextApi();
  const { free, isLoading: isFreeLoading } = useTreasuryFree(api);

  return (
    <SummaryLayout>
      <HydrationAvailableItem data={data} isLoading={isLoading} />
      <ToBeAwardedItem price={price} />
      <NextBurnItem free={free} isLoading={isFreeLoading} />
      <SpendPeriod />
    </SummaryLayout>
  );
}
