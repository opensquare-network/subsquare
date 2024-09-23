import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssetsTreasury from "./multiAssetsTreasury";
import FellowshipTreasury from "./fellowshipTreasury";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import {
  PolkadotTreasurySummaryProvider,
  usePolkadotTreasurySummary,
} from "./context";

function PolkadotTreasurySummaryInContext() {
  const {
    relayChainFree,
    multiAssetsFree,
    fellowshipFree,
    setDOTBalance,
    setIsTotalTreasuryLoading,
  } = usePolkadotTreasurySummary();

  useEffect(() => {
    if (
      isNil(relayChainFree) ||
      isNil(multiAssetsFree) ||
      isNil(fellowshipFree)
    ) {
      return;
    }

    const DOTBalanceTotal = BigNumber(relayChainFree)
      .plus(multiAssetsFree)
      .plus(fellowshipFree);
    setDOTBalance(DOTBalanceTotal);
    setIsTotalTreasuryLoading(false);
  }, [
    relayChainFree,
    multiAssetsFree,
    fellowshipFree,
    setDOTBalance,
    setIsTotalTreasuryLoading,
  ]);

  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <RelayChainTreasury />
      <MultiAssetsTreasury />
      <FellowshipTreasury />
    </SummaryLayout>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasurySummaryProvider>
      <PolkadotTreasurySummaryInContext />
    </PolkadotTreasurySummaryProvider>
  );
}
