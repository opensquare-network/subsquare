import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssetsTreasury from "./multiAssetsTreasury";
import FellowshipTreasury from "./fellowshipTreasury";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

export default function PolkadotTreasurySummary() {
  const [relayChainFree, setRelayChainDOTFree] = useState(null);
  const [multiAssetsFree, setMultiAssetsFree] = useState(null);
  const [fellowshipFree, setFellowshipFree] = useState(null);
  const [USDtBalance, setUSDtBalance] = useState(0);
  const [USDCBalance, setUSDCBalance] = useState(0);
  const [DOTBalance, setDOTBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, [relayChainFree, multiAssetsFree, fellowshipFree]);

  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury
        USDtBalance={USDtBalance}
        USDCBalance={USDCBalance}
        DOTBalance={DOTBalance}
        isLoading={isLoading}
      />
      <RelayChainTreasury setRelayChainDOTFree={setRelayChainDOTFree} />
      <MultiAssetsTreasury
        setMultiAssetsFree={setMultiAssetsFree}
        setUSDtBalance={setUSDtBalance}
        setUSDCBalance={setUSDCBalance}
      />
      <FellowshipTreasury setFellowshipFree={setFellowshipFree} />
    </SummaryLayout>
  );
}
