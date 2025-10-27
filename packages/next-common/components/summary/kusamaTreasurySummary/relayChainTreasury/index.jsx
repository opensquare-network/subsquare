import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import SpendPeriodCountdown from "next-common/components/summary/polkadotTreasurySummary/relayChainTreasury/spendPeriodCountdown";
import ToBeAwarded from "next-common/components/summary/polkadotTreasurySummary/relayChainTreasury/toBeAwarded";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "next-common/components/summary/polkadotTreasurySummary/relayChainTreasury/nextBurn";
import SpendPeriod from "next-common/components/summary/polkadotTreasurySummary/relayChainTreasury/spendPeriod";
import FiatPriceLabel from "../common/fiatPriceLabel";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";
import {
  ToBeAwardedLabel,
  SpendPeriodLabel,
  NextBurnLabel,
} from "next-common/components/summary/kusamaTreasurySummary/tooltipLables/cycleLabels";

export default function RelayChainTreasury() {
  const {
    nativeTreasuryBalanceOnRelayChain,
    isNativeTreasuryBalanceOnRelayChainLoading,
  } = useKusamaTreasuryContext();

  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  return (
    <SummaryItem title="Relay Chain">
      <LoadableContent
        isLoading={
          isNativeTreasuryBalanceOnRelayChainLoading ||
          isNil(toBeAwarded) ||
          isNil(summary)
        }
      >
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel free={nativeTreasuryBalanceOnRelayChain} />
          <div className="!ml-0 flex flex-col gap-y-1">
            <div>
              <NativeTokenSymbolAsset
                free={nativeTreasuryBalanceOnRelayChain}
              />
            </div>
            <SummaryLabelItem label={<ToBeAwardedLabel />}>
              <ToBeAwarded toBeAwarded={toBeAwarded} />
            </SummaryLabelItem>
            <SummaryLabelItem label={<NextBurnLabel />}>
              <NextBurn free={nativeTreasuryBalanceOnRelayChain} />
            </SummaryLabelItem>
            <SummaryLabelItem label={<SpendPeriodLabel />}>
              <SpendPeriod summary={summary} />
              <SpendPeriodCountdown summary={summary} />
            </SummaryLabelItem>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
