import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";
import KusamaTreasuryProvider from "next-common/context/treasury/kusamaTreasury";

export default function KusamaTreasurySummary() {
  return (
    <KusamaTreasuryProvider>
      <CollapsePanel labelItem={<TotalTreasury />}>
        <RelayChainTreasury />
        <TreasuryOnAssetHub />
      </CollapsePanel>
    </KusamaTreasuryProvider>
  );
}
