import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";

function SummaryPanel() {
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Spent">123</SummaryItem>
        <SummaryItem title="Spent Circles">234</SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}

export default function FellowshipCollectivesStatistics() {
  return (
    <div className="flex flex-col gap-[16px]">
      <TitleContainer>Expenditure</TitleContainer>
      <SummaryPanel />
    </div>
  );
}
