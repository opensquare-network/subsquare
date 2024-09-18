import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useAssetHubApi } from "next-common/context/assetHub";
import BalanceWithFiat from "./balanceWithFiat";
import { usePrice } from "./usePrice";
import { AvailableItem, ToBeAwardedItem } from ".";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

function useAllSpends() {
  const api = useContextApi();
  const { value: spends, loading } = useCall(
    api?.query?.fellowshipTreasury?.spends?.entries,
    [],
  );

  const value = (spends || [])
    .map(([key, value]) => {
      const {
        args: [id],
      } = key;
      const unwrappedValue = value.unwrap();
      return { id, value: unwrappedValue };
    })
    .filter(Boolean);

  return { value, loading };
}

function RequestingItem({ allSpends, price, isLoading }) {
  const requesting = allSpends.reduce(
    (prev, spend) => prev + spend.value.amount.toBigInt(),
    0n,
  );

  return (
    <SummaryItem title="Requesting">
      <LoadableContent isLoading={isLoading}>
        <BalanceWithFiat balance={requesting.toString()} fiatPrice={price} />
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryProposalsItem({ allSpends, isLoading }) {
  const total = allSpends.length;
  return (
    <SummaryItem title="Treasury Proposals">
      <LoadableContent isLoading={isLoading}>
        <div className="flex gap-[4px]">
          <span className="text-textPrimary">0</span>
          <span className="text-textDisabled">/</span>
          <span className="text-textTertiary">{total}</span>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

export default function FellowshipTreasurySummary() {
  const price = usePrice();
  const api = useAssetHubApi();
  const free = useTreasuryFree(api);
  const { value: allSpends, loading: isAllSpendsLoading } = useAllSpends();

  return (
    <SummaryLayout>
      <AvailableItem free={free} price={price} />
      <RequestingItem
        allSpends={allSpends}
        price={price}
        isLoading={isAllSpendsLoading}
      />
      <ToBeAwardedItem price={price} />
      <TreasuryProposalsItem
        allSpends={allSpends}
        isLoading={isAllSpendsLoading}
      />
    </SummaryLayout>
  );
}
