import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "../common/summaryLabelItem";
import SpendPeriodCountdown from "./spendPeriodCountdown";
import ToBeAwarded from "./toBeAwarded";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "./nextBurn";
import SpendPeriod from "./spendPeriod";
import FiatPriceLabel from "../common/fiatPriceLabel";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";

export default function RelayChainTreasury() {
  const {
    dotTreasuryBalanceOnRelayChain,
    isDotTreasuryBalanceOnRelayChainLoading,
  } = usePolkadotTreasury();

  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  return (
    <SummaryItem title="Relay Chain">
      <LoadableContent
        isLoading={
          isDotTreasuryBalanceOnRelayChainLoading ||
          isNil(toBeAwarded) ||
          isNil(summary)
        }
      >
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel free={dotTreasuryBalanceOnRelayChain} />
          <div className="!ml-0 flex flex-col gap-y-1">
            <div>
              <NativeTokenSymbolAsset free={dotTreasuryBalanceOnRelayChain} />
            </div>
            <SummaryLabelItem label={"To be awarded"}>
              <ToBeAwarded toBeAwarded={toBeAwarded} />
            </SummaryLabelItem>
            <SummaryLabelItem label={"Next burn"}>
              <NextBurn free={dotTreasuryBalanceOnRelayChain} />
            </SummaryLabelItem>
            <SummaryLabelItem label={"Spend period"}>
              <SpendPeriod summary={summary} />
              <SpendPeriodCountdown summary={summary} />
            </SummaryLabelItem>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
