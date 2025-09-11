import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import Loans from "./loans";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";

export default function KusamaTreasurySummary() {
  return (
    <CollapsePanel labelItem={<TotalTreasury />}>
      <RelayChainTreasury />
      <TreasuryOnAssetHub />
      <Loans />
    </CollapsePanel>
  );
}
