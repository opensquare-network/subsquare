import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import SpendPeriodCountdown from "next-common/components/summary/polkadotTreasurySummary/treasuryStatus/spendPeriodCountdown";
import ToBeAwarded from "next-common/components/summary/polkadotTreasurySummary/treasuryStatus/toBeAwarded";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "next-common/components/summary/polkadotTreasurySummary/treasuryStatus/nextBurn";
import SpendPeriod from "next-common/components/summary/polkadotTreasurySummary/treasuryStatus/spendPeriod";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";
import SpendPeriodLabelTip from "../../labelTips/spendPeriod";

export default function TreasuryStatus() {
  const {
    nativeTreasuryBalanceOnRelayChain,
    isNativeTreasuryBalanceOnRelayChainLoading,
  } = useKusamaTreasuryContext();

  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  return (
    <SummaryItem title="Treasury Status">
      <LoadableContent
        isLoading={
          isNativeTreasuryBalanceOnRelayChainLoading ||
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
