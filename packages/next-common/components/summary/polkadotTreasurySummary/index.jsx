import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssetsTreasury from "./multiAssetsTreasury";
import FellowshipTreasury from "./fellowshipTreasury";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function PolkadotTreasurySummary() {
  const [relayChainFree, setRelayChainDotFree] = useState(null);
  const [multiAssetsFree, setMultiAssetsFree] = useState(null);
  const [fellowshipFree, setFellowshipFree] = useState(null);
  const [USDtFree, setUSDtFree] = useState(0);
  const [USDCFree, setUSDCFree] = useState(0);
  const [DOTFree, setDOTFree] = useState(0);

  useEffect(() => {
    setUSDtFree(multiAssetsFree?.USDtFree || 0);
    setUSDCFree(multiAssetsFree?.USDCFree || 0);

    const DOTFreeTotal = BigNumber(relayChainFree || 0)
      .plus(multiAssetsFree?.DOTFree || 0)
      .plus(fellowshipFree || 0);
    setDOTFree(DOTFreeTotal);
  }, [relayChainFree, multiAssetsFree, fellowshipFree]);

  return (
    <SummaryLayout>
      <TotalTreasury
        USDtFree={USDtFree}
        USDCFree={USDCFree}
        DOTFree={DOTFree}
      />
      <RelayChainTreasury setRelayChainDotFree={setRelayChainDotFree} />
      <MultiAssetsTreasury
        setMultiAssetsFree={setMultiAssetsFree}
        setUSDtFree={setUSDtFree}
        setUSDCFree={setUSDCFree}
      />
      <FellowshipTreasury setFellowshipFree={setFellowshipFree} />
    </SummaryLayout>
  );
}
