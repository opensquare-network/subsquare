import TreasuryBurntChart from "./chart";
import TreasuryBurntTable from "./table";
import TreasuryBurntSummary from "./summary";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ListLayout from "next-common/components/layout/ListLayout";
import businessCategory from "next-common/utils/consts/business/category";

export default function TreasuryBurnt() {
  const category = businessCategory.treasuryBurnt;
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      summary={<TreasuryBurntSummary />}
    >
      <SecondaryCard className="space-y-4 flex flex-col text-textPrimary relative">
        <TitleContainer className="mb-4 !px-0 !text20Bold">
          <span>Burnt</span>
        </TitleContainer>
        <TreasuryBurntChart />
        <TreasuryBurntTable />
      </SecondaryCard>
    </ListLayout>
  );
}
