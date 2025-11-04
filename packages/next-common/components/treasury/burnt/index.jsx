import TreasuryBurntChart from "./chart";
import TreasuryBurntTable from "./table";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function TreasuryBurnt() {
  return (
    <SecondaryCard className="space-y-2 flex flex-col text-textPrimary relative">
      <TitleContainer className="mb-4 !px-0 !text20Bold">
        <span>Burnt</span>
      </TitleContainer>
      <TreasuryBurntChart />
      <TreasuryBurntTable />
    </SecondaryCard>
  );
}
