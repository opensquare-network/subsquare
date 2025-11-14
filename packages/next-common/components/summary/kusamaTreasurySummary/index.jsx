import TotalTreasury from "./totalTreasury";
import Treasury from "./treasury";
import Loans from "./loans";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";
import TreasuryStatus from "./treasuryStatus";

export default function KusamaTreasurySummary() {
  return (
    <CollapsePanel labelItem={<TotalTreasury />}>
      <Treasury />
      <Loans />
      <TreasuryStatus />
    </CollapsePanel>
  );
}
