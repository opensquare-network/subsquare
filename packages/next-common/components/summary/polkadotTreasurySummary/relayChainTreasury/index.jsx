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
      <LoadableContent isLoading={isNil(free)}>
        <FiatPriceLabel free={free} />
      </LoadableContent>
      <div className="!ml-0">
        <LoadableContent isLoading={isNil(free)}>
          <DotTokenSymbolAsset free={free} />
        </LoadableContent>
        <SummaryLabelItem label={"To be awarded"}>
          <LoadableContent isLoading={isNil(toBeAwarded)}>
            <ToBeAwarded toBeAwarded={toBeAwarded} />
          </LoadableContent>
        </SummaryLabelItem>
        <SummaryLabelItem label={"Next burn"}>
          <LoadableContent isLoading={isNil(free)}>
            <NextBurn free={free} />
          </LoadableContent>
        </SummaryLabelItem>
        <SummaryLabelItem label={"Spend period"}>
          <LoadableContent isLoading={isNil(summary)}>
            <SpendPeriod summary={summary} />
            <SpendPeriodCountdown summary={summary} />
          </LoadableContent>
        </SummaryLabelItem>
      </div>
    </SummaryItem>
  );
}
