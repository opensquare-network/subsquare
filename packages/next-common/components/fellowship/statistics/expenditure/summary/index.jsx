import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";

export default function StatisticsExpenditureSummary({ value = [], loading }) {
  console.log(":::StatisticsExpenditureSummary Data:", value, loading);
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Spent">123</SummaryItem>
        <SummaryItem title="Spent Circles">234</SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
