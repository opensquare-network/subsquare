import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssets from "./multiAssets";
import FellowshipTreasury from "./fellowshipTreasury";

export default function PolkadotTreasurySummary() {
  return (
    <SummaryLayout>
      <TotalTreasury />
      <RelayChainTreasury />
      <MultiAssets />
      <FellowshipTreasury />
    </SummaryLayout>
  );
}
