import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssetsTreasury from "./multiAssetsTreasury";
import FellowshipTreasury from "./fellowshipTreasury";
import { useState } from "react";

export default function PolkadotTreasurySummary() {
  const [relayChainFree, setRelayChainDotFree] = useState(null);
  const [multiAssetsFree, setMultiAssetsFree] = useState(null);
  const [fellowshipFree, setFellowshipFree] = useState(null);

  return (
    <SummaryLayout>
      <TotalTreasury />
      <RelayChainTreasury setRelayChainDotFree={setRelayChainDotFree}/>
      <MultiAssetsTreasury setMultiAssetsFree={setMultiAssetsFree} />
      <FellowshipTreasury />
    </SummaryLayout>
  );
}
