import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import { useChain } from "../../../context/chain";
import TreasurySummaryNextBurn from "./nextBurn";
import { isKintsugiChain } from "next-common/utils/chain";
import SpendPeriod from "next-common/components/summary/treasurySummary/spendPeriod";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import TreasurySummarySpendPeriodCountDown from "./spendPeriodCountDown";
import { useContextApi } from "next-common/context/api";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import BalanceWithFiat from "./balanceWithFiat";
import { usePrice } from "./usePrice";
import useSpendPeriodSummary from "./useSpendPeriodSummary";

export function AvailableItem({ free, price }) {
  return (
    <SummaryItem title="Available">
      <LoadableContent isLoading={isNil(free)}>
        <BalanceWithFiat balance={free} fiatPrice={price} />
      </LoadableContent>
    </SummaryItem>
  );
}

export function ToBeAwardedItem({ price }) {
  const toBeAwarded = useToBeAwarded();
  return (
    <SummaryItem title="To Be Awarded">
      <LoadableContent isLoading={isNil(toBeAwarded)}>
        <BalanceWithFiat balance={toBeAwarded} fiatPrice={price} />
      </LoadableContent>
    </SummaryItem>
  );
}

function NextBurnItem({ free }) {
  return (
    <SummaryItem title="Next Burn">
      <LoadableContent isLoading={isNil(free)}>
        <TreasurySummaryNextBurn free={free} />
      </LoadableContent>
    </SummaryItem>
  );
}

function SpendPeriodItem() {
  const summary = useSpendPeriodSummary();
  return (
    <SummaryItem
      title="Spend Period"
      suffix={<TreasurySummarySpendPeriodCountDown summary={summary} />}
    >
      <SpendPeriod summary={summary} />
    </SummaryItem>
  );
}

export default function TreasurySummary() {
  const chain = useChain();
  const price = usePrice();
  const api = useContextApi();
  const free = useTreasuryFree(api);

  return (
    <SummaryLayout>
      <AvailableItem free={free} price={price} />
      {!isKintsugiChain(chain) && <ToBeAwardedItem price={price} />}
      <NextBurnItem free={free} />
      {!isKintsugiChain(chain) && <SpendPeriodItem />}
    </SummaryLayout>
  );
}
