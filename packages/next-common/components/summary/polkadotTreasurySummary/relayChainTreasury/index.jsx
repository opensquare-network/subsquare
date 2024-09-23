import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "./summaryLabelItem";
import SpendPeriodCountdown from "./spendPeriodCountdown";
import ToBeAwarded from "./toBeAwarded";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "./nextBurn";
import SpendPeriod from "./spendPeriod";
import FiatPriceLabel from "../common/fiatPriceLabel";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import { usePolkadotTreasurySummary } from "../context";

export default function RelayChainTreasury() {
  const { relayChainFree } = usePolkadotTreasurySummary();

  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  return (
    <SummaryItem title="Relay Chain">
      <LoadableContent
        isLoading={
          isNil(relayChainFree) || isNil(toBeAwarded) || isNil(summary)
        }
      >
        <FiatPriceLabel free={relayChainFree} />
        <div className="!ml-0 flex flex-col gap-y-1">
          <div className="mb-3">
            <DotTokenSymbolAsset free={relayChainFree} />
          </div>
          <SummaryLabelItem label={"To be awarded"}>
            <ToBeAwarded toBeAwarded={toBeAwarded} />
          </SummaryLabelItem>
          <SummaryLabelItem label={"Next burn"}>
            <NextBurn free={relayChainFree} />
          </SummaryLabelItem>
          <SummaryLabelItem label={"Spend period"}>
            <SpendPeriod summary={summary} />
            <SpendPeriodCountdown summary={summary} />
          </SummaryLabelItem>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
