import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useAssetHubApi } from "next-common/context/assetHub";
import BalanceWithFiat from "./balanceWithFiat";
import { usePrice } from "./usePrice";
import { AvailableItem, ToBeAwardedItem } from ".";

function RequestingItem({ price }) {
  return (
    <SummaryItem title="Requesting">
      <LoadableContent isLoading={false}>
        <BalanceWithFiat balance={0} fiatPrice={price} />
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryProposalsItem() {
  return (
    <SummaryItem title="Treasury Proposals">
      <LoadableContent isLoading={false}>
        <div className="flex gap-[4px]">
          <span className="text-textPrimary">0</span>
          <span className="text-textDisabled">/</span>
          <span className="text-textTertiary">33</span>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

export default function FellowshipTreasurySummary() {
  const price = usePrice();
  const api = useAssetHubApi();
  const free = useTreasuryFree(api);

  return (
    <SummaryLayout>
      <AvailableItem free={free} price={price} />
      <RequestingItem price={price} />
      <ToBeAwardedItem price={price} />
      <TreasuryProposalsItem />
    </SummaryLayout>
  );
}
