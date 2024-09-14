import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "./summaryLabelItem";
import SpendPeriodCountdown from "./spendPeriodCountdown";
import ToBeAwarded from "./toBeAwarded";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "./nextBurn";
import SpendPeriod from "./spendPeriod";
import FiatPriceLabel from "../common/fiatPriceLabel";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import { useEffect } from "react";

export default function RelayChainTreasury({ setRelayChainDOTFree }) {
  const api = useContextApi();

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  useEffect(() => {
    if (!free) return;

    setRelayChainDOTFree(free);
  }, [free, setRelayChainDOTFree]);

  return (
    <SummaryItem title="Relay Chain Treasury">
      <LoadableContent
        isLoading={isNil(free) || isNil(toBeAwarded) || isNil(summary)}
      >
        <FiatPriceLabel free={free} />
        <div className="!ml-0">
          <DotTokenSymbolAsset free={free} />
          <SummaryLabelItem label={"To be awarded"}>
            <ToBeAwarded toBeAwarded={toBeAwarded} />
          </SummaryLabelItem>
          <SummaryLabelItem label={"Next burn"}>
            <NextBurn free={free} />
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
