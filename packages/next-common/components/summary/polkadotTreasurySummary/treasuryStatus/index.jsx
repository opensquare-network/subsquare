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
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import SpendPeriodLabelTip from "../../labelTips/spendPeriod";

export default function TreasuryStatus() {
  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();
  const {
    nativeTreasuryBalanceOnRelayChain,
    isRelayChainTreasuryBalanceLoading,
  } = usePolkadotTreasury();

  return (
    <SummaryItem title="Treasury Status">
      <LoadableContent
        isLoading={
          isRelayChainTreasuryBalanceLoading ||
          isNil(toBeAwarded) ||
          isNil(summary)
        }
      >
        <div className="flex flex-col gap-[4px]">
          <div className="!ml-0 flex flex-col gap-y-1">
            <SummaryLabelItem label="To be awarded">
              <ToBeAwarded toBeAwarded={toBeAwarded} />
            </SummaryLabelItem>
            <SummaryLabelItem label="Next burn">
              <NextBurn free={nativeTreasuryBalanceOnRelayChain} />
            </SummaryLabelItem>
            <SummaryLabelItem label={<SpendPeriodLabelTip />}>
              <SpendPeriod summary={summary} />
              <SpendPeriodCountdown summary={summary} />
            </SummaryLabelItem>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
