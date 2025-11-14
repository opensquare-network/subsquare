import TreasuryBurnChart from "./chart";
import TreasuryBurnTable from "./table";
import TreasuryBurnSummary from "./summary";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ListLayout from "next-common/components/layout/ListLayout";
import businessCategory from "next-common/utils/consts/business/category";

export default function TreasuryBurn() {
  const category = businessCategory.treasuryBurn;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasuryBurnSummary />}
    >
      <TitleContainer className="mb-4 !px-6 !text16Bold">
        <span>Burnt</span>
      </TitleContainer>
      <SecondaryCard className="space-y-4 flex flex-col text-textPrimary relative">
        <TreasuryBurnChart />
        <TreasuryBurnTable />
      </SecondaryCard>
    </ListLayout>
  );
}
