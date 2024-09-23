import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useAssetHubApi } from "next-common/context/assetHub";
import BalanceWithFiat from "./balanceWithFiat";
import { AvailableItem, ToBeAwardedItem } from ".";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { ActiveReferendaProvider, useActiveReferendaContext, } from "next-common/context/activeReferenda";
import { TreasuryProvider, useTreasuryPallet, } from "next-common/context/treasury";
import Tooltip from "next-common/components/tooltip";
import useFiatPrice from "next-common/hooks/useFiatPrice";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";

function useAllSpends() {
  const api = useContextApi();
  const { value: spends, loading } = useCall(api?.query?.fellowshipTreasury?.spends?.entries, []);

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

function useActiveTreasurySpendReferenda() {
  const { activeReferenda, isLoading } = useActiveReferendaContext();
  const treasuryPallet = useTreasuryPallet();

  const activeSpendReferenda = activeReferenda.filter(({ call }) => {
    if (!call) {
      return false;
    }
    const { section, method } = call;
    return section === treasuryPallet && "spend" === method;
  });

  return {
    activeSpendReferenda,
    isLoading,
  };
}

function sumSpendAmounts(referenda) {
  return referenda.reduce((prev, referendum) => {
    const { call } = referendum;
    if (!call) {
      return prev;
    }

    const amount = call.args.find((arg) => arg.name === "amount");
    if (!amount) {
      return prev;
    }

    return prev + BigInt(amount.value);
  }, 0n);
}

function RequestingItem({ price }) {
  const { activeSpendReferenda, isLoading } = useActiveTreasurySpendReferenda();
  const requesting = sumSpendAmounts(activeSpendReferenda);
  return (
    <SummaryItem title="Requesting">
      <LoadableContent isLoading={isLoading}>
        <BalanceWithFiat balance={requesting.toString()} fiatPrice={price} />
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryProposalsItem() {
  const { value: allSpends, loading: isAllSpendsLoading } = useAllSpends();
  const active = allSpends.filter(
    (spend) => spend?.value?.status?.isPending,
  ).length;
  const total = allSpends.length;

  return (
    <SummaryItem title="Spends">
      <LoadableContent isLoading={isAllSpendsLoading}>
        <div className="flex gap-[4px]">
          <Tooltip content="Active spends">
            <span className="text-textPrimary">{active}</span>
          </Tooltip>
          <span className="text-textDisabled">/</span>
          <span className="text-textTertiary">{total}</span>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function FellowshipTreasuryAvailableItem({ price }) {
  const api = useAssetHubApi();
  const { result } = useSubStorage("system", "account", [StatemintFellowShipTreasuryAccount], {
    api,
  });

  return <AvailableItem free={result?.data?.free?.toString()} price={price} />;
}

export default function FellowshipTreasurySummary() {
  const { price } = useFiatPrice();

  return (
    <ActiveReferendaProvider pallet="fellowshipReferenda">
      <TreasuryProvider pallet="fellowshipTreasury">
        <SummaryLayout>
          <FellowshipTreasuryAvailableItem price={price} />
          <RequestingItem price={price} />
          <ToBeAwardedItem price={price} />
          <TreasuryProposalsItem />
        </SummaryLayout>
      </TreasuryProvider>
    </ActiveReferendaProvider>
  );
}
